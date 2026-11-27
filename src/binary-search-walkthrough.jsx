import React, { useState } from 'react';

const exactValues = [3, 6, 8, 11, 14, 17, 21];
const boundValues = [3, 6, 8, 8, 8, 17, 21];
const targets = [2, 3, 6, 8, 10, 11, 14, 17, 21, 22];

export default function BinarySearchWalkthrough({ lowerBound = false }) {
  const values = lowerBound ? boundValues : exactValues;
  const initialRange = { low: 0, high: lowerBound ? values.length : values.length - 1, found: null };
  const [target, setTarget] = useState(lowerBound ? 8 : 17);
  const [range, setRange] = useState(initialRange);
  const { low, high, found } = range;
  const done = lowerBound ? low === high : found !== null || low > high;
  const mid = done ? (lowerBound ? low : found) : low + Math.floor((high - low) / 2);

  function compare() {
    if (values[mid] < target) {
      setRange({ ...range, low: mid + 1 });
    } else if (!lowerBound && values[mid] === target) {
      setRange({ ...range, found: mid });
    } else {
      setRange({ ...range, high: lowerBound ? mid : mid - 1 });
    }
  }

  const status = done
    ? lowerBound
      ? `Lower bound is index ${low}.${low === values.length ? ' Insert after the last value.' : ''}`
      : found === null ? `${target} is absent. The search range is empty.` : `Found ${target} at index ${found}.`
    : lowerBound
      ? `Range [${low}, ${high}) · Compare the middle value ${values[mid]} with ${target}.`
      : `Active indices ${low} through ${high}. The middle value is ${values[mid]}.`;

  return <div className="search-trace">
    <h3>{lowerBound ? 'Step through a lower-bound search' : 'Step through binary search'}</h3>
    <label>Target <select value={target} onChange={event => { setTarget(Number(event.target.value)); setRange(initialRange); }}>
      {targets.map(value => <option key={value} value={value}>{value}</option>)}
    </select></label>
    <ol className="trace-cells" aria-label="Sorted values">
      {values.map((value, index) => (
        <li key={index} className={index === mid ? 'trace-mid' : index < low || index > high || (lowerBound && index === high) ? 'trace-excluded' : undefined}>
          <strong>{value}</strong><small>i={index}</small>
        </li>
      ))}
    </ol>
    <p role="status">{status}</p>
    <div className="hero-actions space-top">
      <button className="button primary" type="button" onClick={compare} disabled={done}>Compare and narrow</button>
      <button className="button secondary" type="button" onClick={() => setRange(initialRange)}>Reset trace</button>
    </div>
  </div>;
}
