import React from "react";
import "./TransitionTable.css";

/**
 * TransitionTable – read-only display of a machine as a transition table.
 * Supports both Mealy (cells show "nextState / output") and Moore (header row for outputs).
 */
export default function TransitionTable({ machine, machineType }) {
  if (!machine) return null;

  const { states, inputAlpha, transitions, stateOutputs, initial } = machine;

  const getCell = (from, input) => {
    const t = transitions.find((t) => t.from === from && t.input === input);
    if (!t) return <span className="tt-missing">—</span>;
    if (machineType === "mealy") {
      return (
        <span className="tt-cell">
          {t.to}
          <span className="tt-slash"> / </span>
          <span className="tt-output">{t.output || "?"}</span>
        </span>
      );
    }
    return <span className="tt-cell">{t.to}</span>;
  };

  return (
    <div className="tt-wrapper">
      <div className="tt-scroll">
        <table className="tt-table">
          <thead>
            <tr>
              <th className="tt-th tt-th-state">State</th>
              {machineType === "moore" && (
                <th className="tt-th tt-th-output">λ(q)</th>
              )}
              {inputAlpha.map((a) => (
                <th key={a} className="tt-th">
                  {a}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {states.map((s) => (
              <tr
                key={s}
                className={`tt-row ${s === initial ? "tt-row--initial" : ""}`}
              >
                <td className="tt-td-state">
                  {s === initial && <span className="tt-arrow">→</span>}
                  {s}
                </td>
                {machineType === "moore" && (
                  <td className="tt-td-output">
                    <span className="tt-output">{stateOutputs?.[s] ?? "?"}</span>
                  </td>
                )}
                {inputAlpha.map((a) => (
                  <td key={a} className="tt-td">
                    {getCell(s, a)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
