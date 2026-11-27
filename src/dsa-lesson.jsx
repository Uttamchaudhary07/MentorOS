import React, { useState } from 'react';

export function AlgorithmTrace({ steps, children }) {
  const [count, setCount] = useState(1);
  return (
    <section className="panel content-panel">
      <h2>Trace the algorithm</h2>
      <p>Predict what changes before revealing the next step.</p>
      <ol className="algorithm-steps" aria-live="polite">
        {steps.slice(0, count).map(step => <li key={step}>{step}</li>)}
      </ol>
      <div className="hero-actions">
        <button type="button" className="button secondary" disabled={count === steps.length} onClick={() => setCount(count + 1)}>Reveal next step</button>
        <button type="button" className="button secondary" disabled={count === 1} onClick={() => setCount(1)}>Reset steps</button>
      </div>
      {children}
    </section>
  );
}

export function AlgorithmDecisions({ guide, cues }) {
  return (
    <section className="panel content-panel">
      <h2>Why this algorithm works</h2>
      <dl className="algorithm-decisions">
        <div><dt>How to recognize it</dt><dd>{cues}</dd></div>
        <div><dt>Invariant</dt><dd>{guide.invariant}</dd></div>
        <div><dt>Time and space</dt><dd>{guide.cost}</dd></div>
        <div><dt>Edge cases and what breaks</dt><dd>{guide.edge}</dd></div>
        <div><dt>When to switch algorithms</dt><dd>{guide.upgrade}</dd></div>
      </dl>
    </section>
  );
}

export function JavaExample({ topic }) {
  if (!topic.javaProgram) return <pre><code>{topic.example}</code></pre>;
  return (
    <>
      <p>Save as <code>Main.java</code> and run <code>java Main.java</code> with JDK 17 or later. The program checks boundary cases before printing the example result.</p>
      <pre><code>{topic.javaProgram}</code></pre>
    </>
  );
}
