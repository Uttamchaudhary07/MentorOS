import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tracks, topics, getTrack } from '../src/curriculum.js';
import { DAY, initialProfile, ready, recordAttempt, modulePassed } from '../src/progress.js';
import { learningPlan } from '../src/learning-plan.js';

test('all seven expanded tracks have lessons, checked exercises, and valid module prerequisites', () => {
  assert.equal(tracks.length, 7);
  assert.equal(new Set(topics.map(topic => topic.id)).size, topics.length);
  assert.ok(topics.length > 100);
  for (const track of tracks) {
    assert.ok(track.modules.length >= 3);
    assert.ok(track.topics.length >= 10);
    assert.equal(track.modules[0].mode, 'mixed');
    assert.equal(track.modules[0].topics.length, 3);
    for (const module of track.modules) {
      for (const [index, topic] of module.topics.entries()) {
        if (index > 0) assert.equal(topic.prerequisite, module.topics[index - 1]?.id);
        if (topic.prerequisite) {
          const prerequisite = track.topics.find(item => item.id === topic.prerequisite);
          assert.ok(prerequisite?.level < topic.level);
        } else {
          assert.equal(topic.level, 1);
        }
        assert.equal(topic.questions.length, 4);
        assert.ok(topic.questions.every(question => new Set(question).size === 4));
        assert.ok(topic.explanation && topic.example && topic.cues && topic.rule && topic.edges);
        assert.ok(topic.practice[0] && topic.criteria.length >= 2);
        for (const link of topic.practice.slice(1)) {
          const url = new URL(link[2]);
          assert.equal(url.protocol, 'https:');
          assert.notEqual(url.hostname, 'codepen.io');
          assert.notEqual(url.hostname, 'stackblitz.com');
        }
      }
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

test('old mixed test scores still count for the original Essentials checkpoint', () => {
  const [track] = tracks;
  const [essentials, advanced] = track.modules;
  const progress = recordAttempt(initialProfile, 'mixed', track.id, ['a'], ['a'], 100);
  assert.equal(modulePassed(essentials, progress), true);
  assert.equal(modulePassed(advanced, progress), false);
});

test('changing goals changes the suggested lesson and respects prerequisites', () => {
  const profile = { ...initialProfile, goal: 'java' };
  const [first, second] = getTrack('java').topics;
  assert.equal(learningPlan(profile, 20)[0].topic.id, first.id);
  assert.equal(learningPlan({ ...profile, goal: 'react' }, 20)[0].topic.trackId, 'react');

  const progress = recordAttempt(profile, 'check', first.id, ['a'], ['a'], 10);
  assert.equal(learningPlan(progress, 20)[0].topic.id, second.id);
  assert.equal(learningPlan(progress, 20 + DAY)[0].kind, 'review');
});

test('the plan recommends revisiting a missed skill and taking ready checkpoints', () => {
  const profile = { ...initialProfile, goal: 'java' };
  const module = getTrack('java').modules[0];
  const first = module.topics[0];
  const correct = first.questions.slice(0, 2).map(question => question[1]);
  const failed = recordAttempt(profile, 'check', first.id, ['wrong', correct[1]], correct, 100);
  const [revisit] = learningPlan(failed, 101);
  assert.equal(revisit.kind, 'revisit');
  assert.match(revisit.reason, /last check/);
  assert.equal(revisit.topic.id, first.id);
  assert.equal(learningPlan(failed, 101).length, 1);

  const passed = { ...profile, passed: Object.fromEntries(module.topics.map(topic => [topic.id, 100])) };
  assert.equal(learningPlan(passed, 101)[0].kind, 'test');
  const checkpoint = module.topics.map(topic => topic.questions[2][1]);
  const failedCheckpoint = recordAttempt(passed, 'mixed', module.subject, ['wrong', ...checkpoint.slice(1)], checkpoint, 102);
  assert.equal(learningPlan(failedCheckpoint, 103)[0].kind, 'checkpoint');
  assert.equal(learningPlan(failedCheckpoint, 103)[0].href, `#lesson/${first.id}`);
});
