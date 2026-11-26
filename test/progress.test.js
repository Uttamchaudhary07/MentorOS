import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tracks, topics } from '../src/curriculum.js';
import { DAY, initialProfile, ready, recordAttempt, trackPassed } from '../src/progress.js';

test('all seven tracks have complete lessons with valid prerequisite chains and practice links', () => {
  assert.equal(tracks.length, 7);
  assert.equal(new Set(topics.map(topic => topic.id)).size, 21);
  for (const track of tracks) {
    for (const [index, topic] of track.topics.entries()) {
      assert.equal(topic.prerequisite, track.topics[index - 1]?.id);
      assert.equal(topic.questions.length, 4);
      assert.ok(topic.practice.length >= 2);
      assert.ok(topic.practice.slice(1).every(link => new URL(link[2]).protocol === 'https:'));
    }
  }
});

test('a failed check records evidence and only a pass unlocks the next topic', () => {
  const [first, second] = tracks[0].topics;
  const start = 100;
  assert.ok(ready(first, initialProfile));
  assert.ok(!ready(second, initialProfile));
  const failed = recordAttempt(initialProfile, 'check', first.id, ['a', 'x'], ['a', 'b'], start);
  assert.equal(failed.attempts[0].score, 1);
  assert.ok(!ready(second, failed));
  const passed = recordAttempt(failed, 'check', first.id, ['a', 'b'], ['a', 'b'], start + 1);
  assert.equal(passed.attempts.length, 2);
  assert.ok(ready(second, passed));
  assert.equal(passed.reviews[first.id].due, start + 1 + DAY);
  const retried = recordAttempt(passed, 'check', first.id, ['a', 'b'], ['a', 'b'], start + 2);
  assert.deepEqual(retried.reviews, passed.reviews);
});

test('Recall intervals grow and reset based on the result without changing earlier topic passes', () => {
  const [first] = tracks[0].topics;
  const passed = recordAttempt(initialProfile, 'check', first.id, ['a'], ['a'], 100);
  const correct = recordAttempt(passed, 'review', first.id, ['a'], ['a'], 200);
  assert.deepEqual(correct.reviews[first.id], { due: 200 + 2 * DAY, days: 2 });
  const incorrect = recordAttempt(correct, 'review', first.id, ['b'], ['a'], 300);
  assert.deepEqual(incorrect.reviews[first.id], { due: 300 + DAY, days: 1 });
  assert.equal(incorrect.passed[first.id], 100);
});

test('a passing mixed test completes the track', () => {
  const [track] = tracks;
  assert.equal(trackPassed(track, initialProfile), false);
  const progress = recordAttempt(initialProfile, 'mixed', track.id, ['a'], ['a'], 100);
  assert.equal(trackPassed(track, progress), true);
  assert.equal(trackPassed(tracks[1], progress), false);
});
