export const DAY = 86_400_000;
export const initialProfile = { name: '', goal: '', format: 'example', started: {}, passed: {}, reviews: {}, attempts: [] };

export function ready(topic, profile) {
  return !topic.prerequisite || Boolean(profile.passed[topic.id] || profile.passed[topic.prerequisite]);
}

export function recordAttempt(profile, mode, subject, answers, correct, now = Date.now()) {
  const score = answers.filter((answer, index) => answer === correct[index]).length;
  const passed = score === correct.length;
  const attempt = { mode, subject, answers, score, total: correct.length, at: now };
  const next = { ...profile, attempts: [attempt, ...profile.attempts] };
  if (mode === 'check' && passed && !profile.passed[subject]) {
    next.passed = { ...profile.passed, [subject]: now };
    next.reviews = { ...profile.reviews, [subject]: { due: now + DAY, days: 1 } };
  }
  if (mode === 'review') {
    const oldDays = profile.reviews[subject]?.days ?? 1;
    const days = passed ? Math.min(oldDays * 2, 30) : 1;
    next.reviews = { ...profile.reviews, [subject]: { due: now + days * DAY, days } };
  }
  return next;
}

export function modulePassed(module, profile) {
  return profile.attempts.some(attempt =>
    attempt.mode === module.mode && attempt.subject === module.subject && attempt.score === attempt.total
  );
}
