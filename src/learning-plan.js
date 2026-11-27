import { getTrack, topics, tracks } from './curriculum.js';
import { DAY, ready, modulePassed } from './progress.js';

export const formats = [
  { id: 'example', label: 'Worked example', description: 'See an example, then unpack the concept behind it.' },
  { id: 'visual', label: 'Visual walkthrough', description: 'Start with a short sequence that shows what to notice, do, and test.' },
  { id: 'practice', label: 'Practice first', description: 'Try a short prediction and read the worked answer when you’re ready.' },
];

export function learningPlan(profile, now = Date.now()) {
  const goal = getTrack(profile.goal);
  const pool = goal?.topics ?? topics;
  const selectedModules = (goal ? [goal] : tracks).flatMap(track => track.modules);
  const byId = new Map(pool.map(topic => [topic.id, topic]));
  const actions = [];
  const due = pool
    .filter(topic => profile.reviews[topic.id]?.due <= now)
    .sort((a, b) => profile.reviews[a.id].due - profile.reviews[b.id].due);
  if (due.length) {
    actions.push({
      kind: 'review', topic: due[0], href: `#quiz/${due[0].id}/review`,
      title: due[0].title, label: 'Start review',
      reason: 'Your Recall review is due. A short check helps you see what you still remember.',
    });
  }

  const latestByTopic = new Map();
  for (const attempt of profile.attempts) {
    if (attempt.mode === 'check' && byId.has(attempt.subject) && !latestByTopic.has(attempt.subject)) {
      latestByTopic.set(attempt.subject, attempt);
    }
  }
  const failed = Array.from(latestByTopic.values()).find(attempt =>
    attempt.score < attempt.total && attempt.at >= now - 14 * DAY &&
    !profile.passed[attempt.subject] && ready(byId.get(attempt.subject), profile)
  );
  if (failed) {
    const topic = byId.get(failed.subject);
    const missed = topic.questions.slice(0, 2).find((question, index) => question[1] !== failed.answers[index]);
    actions.push({
      kind: 'revisit', topic, href: `#lesson/${topic.id}`, title: topic.title,
      label: 'Review and retry',
      reason: missed ? `Revisit this question from your last check. ${missed[0]}` : 'Your last check on this topic needs another attempt.',
    });
  }

  const pendingModule = selectedModules.find(module =>
    !modulePassed(module, profile) && module.topics.every(topic => profile.passed[topic.id])
  );
  if (pendingModule) {
    const previous = profile.attempts.find(attempt =>
      attempt.mode === pendingModule.mode && attempt.subject === pendingModule.subject
    );
    const missed = previous && pendingModule.topics.find((topic, index) => topic.questions[2][1] !== previous.answers[index]);
    actions.push(missed ? {
      kind: 'checkpoint', title: missed.title, href: `#lesson/${missed.id}`,
      label: 'Revisit before checkpoint', reason: `Your mixed checkpoint for ${pendingModule.title} found a gap on this topic.`,
    } : {
      kind: 'test', title: pendingModule.title, href: `#quiz/${pendingModule.subject}/${pendingModule.mode}`,
      label: 'Take checkpoint', reason: 'You passed every topic check in this module. Apply the skills together in a mixed test.',
    });
  }

  const available = pool.filter(topic => ready(topic, profile) && !profile.passed[topic.id] && topic.id !== failed?.subject);
  const started = available.filter(topic => profile.started[topic.id])
    .sort((a, b) => profile.started[b.id] - profile.started[a.id]);
  const next = started[0] ?? available[0];
  if (next) {
    actions.push({
      kind: 'learn', topic: next, href: `#lesson/${next.id}`, title: next.title,
      label: profile.started[next.id] ? 'Resume lesson' : 'Start lesson',
      reason: next.prerequisite
        ? `You passed ${byId.get(next.prerequisite)?.title ?? 'the prerequisite check'} and unlocked this assessment.`
        : goal ? `This topic is ready to start in your ${goal.name} goal.` : 'This lesson is ready to start. Choose a goal to prioritize another track.',
    });
  }
  return actions;
}
