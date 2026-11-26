import { test } from 'node:test';
import assert from 'node:assert/strict';
import { evaluateExercise, exercises } from '../src/code-lab.js';

test('JavaScript grading handles outputs, errors, and bounded execution', async () => {
  const exercise = exercises['js-basics'];
  const valid = await evaluateExercise(exercise, 'function deliveryFee(value) { return value >= 50 ? 0 : 5; }');
  assert.ok(valid.every(result => result.passed));

  const wrong = await evaluateExercise(exercise, 'function deliveryFee() { return 5; }');
  assert.equal(wrong.filter(result => result.passed).length, 2);

  const erroneous = await evaluateExercise(exercise, 'function deliveryFee( {');
  assert.ok(erroneous.every(result => result.detail === 'SyntaxError'));

  const timedOut = await evaluateExercise({ ...exercise, cases: exercise.cases.slice(0, 1) }, 'function deliveryFee() { while (true) {} }');
  assert.ok(!timedOut[0].passed);
});

test('JavaScript grading does not expose browser or server capabilities', async () => {
  const exercise = {
    name: 'available',
    cases: [{ args: [], expected: ['undefined', 'undefined', 'undefined', 'undefined'], label: 'Host APIs' }],
  };
  const [result] = await evaluateExercise(exercise, 'function available() { return [typeof fetch, typeof document, typeof require, typeof process]; }');
  assert.ok(result.passed);
});
