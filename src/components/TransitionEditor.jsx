import React from "react";
import "./TransitionEditor.css";

/**
 * TransitionEditor – table-style grid to define transitions.
 * For Mealy: cells contain "to/output" selectors.
 * For Moore: cells contain "to" selectors only.
 */
export default function TransitionEditor({
  states,
  inputAlpha,
  outputAlpha,
  transitions,
  onUpdateTransition,
  machineType,
}) {
  const getTransition = (from, input) =>
    transitions.find((t) => t.from === from && t.input === input);

  if (states.length === 0 || inputAlpha.length === 0) {
    return (
      <p className="trans-empty">
        Add states and input alphabet symbols to define transitions.
      </p>
    );
  }

  return (
    <div className="trans-wrapper">
      <div className="trans-scroll">
        <table className="trans-table">
          <thead>
            <tr>
              <th className="trans-th trans-th-state">State</th>
              {inputAlpha.map((a) => (
                <th key={a} className="trans-th">
                  Input: <span className="input-sym">{a}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {states.map((from) => (
              <tr key={from} className="trans-row">
                <td className="trans-td-state">{from}</td>
                {inputAlpha.map((input) => {
                  const t = getTransition(from, input);
                  return (
                    <td key={input} className="trans-td">
                      <TransitionCell
                        from={from}
                        input={input}
                        transition={t}
                        states={states}
                        outputAlpha={outputAlpha}
                        machineType={machineType}
                        onChange={onUpdateTransition}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TransitionCell({ from, input, transition, states, outputAlpha, machineType, onChange }) {
  const to = transition?.to || "";
  const output = transition?.output || "";

  return (
    <div className="trans-cell">
      <select
        className="trans-select"
        value={to}
        onChange={(e) => onChange(from, input, e.target.value, output)}
        title={`Next state from ${from} on ${input}`}
      >
        <option value="">— to —</option>
        {states.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      {machineType === "mealy" && (
        <>
          <span className="trans-slash">/</span>
          <select
            className="trans-select trans-select-out"
            value={output}
            onChange={(e) => onChange(from, input, to, e.target.value)}
            title={`Output from ${from} on ${input}`}
          >
            <option value="">— out —</option>
            {outputAlpha.map((sym) => (
              <option key={sym} value={sym}>{sym}</option>
            ))}
          </select>
        </>
      )}
    </div>
  );
}
