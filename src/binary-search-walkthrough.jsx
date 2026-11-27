import React, { useState } from 'react';

const values = [3, 6, 8, 11, 14, 17, 21];
const targets = [3, 6, 8, 10, 11, 14, 17, 21];
const initialRange = { low: 0, high: values.length - 1, found: null };

export default function BinarySearchWalkthrough() {
  const [target, setTarget] = useState(17);
  const [range, setRange] = useState(initialRange);
  const { low, high, found } = range;
  const done = found !== null || low > high;
  const mid = done ? found : low + Math.floor((high - low) / 2);

  function compare() {
    if (values[mid] === target) {
      setRange({ ...range, found: mid });
    } else if (values[mid] < target) {
      setRange({ ...range, low: mid + 1 });
    } else {
      setRange({ ...range, high: mid - 1 });
    }
  }

  return <div className="search-trace">
    <h3>Step through binary search</h3>
    <label>Target <select value={target} onChange={event => { setTarget(Number(event.target.value)); setRange(initialRange); }}>
      {targets.map(value => <option key={value} value={value}>{value}</option>)}
    </select></label>
    <ol className="trace-cells" aria-label="Sorted values">
      {values.map((value, index) => <li key={value} className={index === mid ? 'trace-mid' : index < low || index > high ? 'trace-excluded' : undefined}>
        <strong>{value}</strong><small>i={index}</small>
      </li>)}
    </ol>
    <p role="status">
      {found !== null ? `Found ${target} at index ${found}.` : low > high ? `${target} is absent. The search range is empty.` : `Active indices ${low} through ${high}. The middle value is ${values[mid]}.`}
    </p>
    <div className="hero-actions space-top">
      <button className="button primary" type="button" onClick={compare} disabled={done}>Compare and narrow</button>
      <button className="button secondary" type="button" onClick={() => setRange(initialRange)}>Reset trace</button>
    </div>
  </div>;
}
