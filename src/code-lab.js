export const exercises = {
  'js-basics': {
    title: 'Delivery fee',
    prompt: 'Write deliveryFee(subtotal). Return 0 for orders of at least 50, and 5 for lower orders.',
    starter: 'function deliveryFee(subtotal) {\n  // Return the delivery fee.\n}',
    name: 'deliveryFee',
    cases: [
      { args: [24], expected: 5, label: 'Below the threshold' },
      { args: [50], expected: 0, label: 'At the threshold' },
      { args: [51], expected: 0, label: 'Above the threshold' },
      { args: [0], expected: 5, label: 'Empty subtotal' },
    ],
  },
  'js-arrays': {
    title: 'Running balance',
    prompt: 'Write runningBalance(transactions). Return an array with the total after each transaction.',
    starter: 'function runningBalance(transactions) {\n  // Return the running totals.\n}',
    name: 'runningBalance',
    cases: [
      { args: [[4, -2, 3]], expected: [4, 2, 5], label: 'Mixed transactions' },
      { args: [[]], expected: [], label: 'Empty transaction list' },
      { args: [[-5]], expected: [-5], label: 'Single transaction' },
      { args: [[0, 3, -3]], expected: [0, 3, 0], label: 'Zero and reset to zero' },
    ],
  },
};

let modulePromise;

async function getRunner() {
  const [{ newQuickJSWASMModuleFromVariant }, { default: release }] = await Promise.all([
    import('quickjs-emscripten-core'),
    import('@jitl/quickjs-singlefile-browser-release-sync'),
  ]);
  return newQuickJSWASMModuleFromVariant(release);
}

export async function evaluateExercise(exercise, source) {
  modulePromise ??= getRunner().catch(error => {
    modulePromise = undefined;
    throw error;
  });
  const vm = await modulePromise;
  return exercise.cases.map(({ args, expected, label }) => {
    const runtime = vm.newRuntime();
    runtime.setMemoryLimit(4 * 1024 * 1024);
    runtime.setMaxStackSize(256 * 1024);
    const deadline = Date.now() + 80;
    runtime.setInterruptHandler(() => Date.now() > deadline);
    const context = runtime.newContext();
    try {
      const argumentsCode = args.map(arg => JSON.stringify(arg)).join(',');
      const code = `
        (() => {
          const encode = JSON.stringify;
          const solve = () => {
            ${source}
            return ${exercise.name}(${argumentsCode});
          };
          return encode(solve());
        })()
      `;
      const result = context.evalCode(code, 'solution.js');
      if (result.error) {
        try {
          const nameHandle = context.getProp(result.error, 'name');
          try {
            const name = context.getString(nameHandle);
            return { label, passed: false, detail: /^(Syntax|Reference|Type|Range)Error$/.test(name) ? name : 'Execution error or time limit reached' };
          } finally {
            nameHandle.dispose();
          }
        } finally {
          result.error.dispose();
        }
      }
      try {
        const output = context.getString(result.value);
        const passed = output === JSON.stringify(expected);
        return { label, passed, detail: passed ? '' : `Expected ${JSON.stringify(expected)}, received ${output.slice(0, 120)}.` };
      } finally {
        result.value.dispose();
      }
    } finally {
      context.dispose();
      runtime.dispose();
    }
  });
}
