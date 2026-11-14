import React, { useState } from "react";
import "./SimulatorPanel.css";

/**
 * SimulatorPanel – step-by-step simulation of the machine on a given input string.
 */
export default function SimulatorPanel({ machine, machineType }) {
  const [inputStr, setInputStr] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [step, setStep] = useState(0);

  const runSimulation = () => {
    if (!machine || machine.states.length === 0) {
      setError("No machine to simulate.");
      return;
    }

    const { inputAlpha, transitions, initial, stateOutputs } = machine;
    const symbols = inputStr.split("").filter((c) => c.trim());

    // Validate input symbols
    for (const sym of symbols) {
      if (!inputAlpha.includes(sym)) {
        setError(`"${sym}" is not in the input alphabet [${inputAlpha.join(", ")}].`);
        return;
      }
    }

    setError("");

    const trace = [];
    let currentState = initial;

    // Initial Moore output
    if (machineType === "moore") {
      trace.push({
        stepNum: 0,
        state: currentState,
        input: "—",
        nextState: currentState,
        output: stateOutputs?.[currentState] ?? "ε",
        note: "Initial output (before reading any input)",
      });
    }

    for (let i = 0; i < symbols.length; i++) {
      const sym = symbols[i];
      const t = transitions.find((t) => t.from === currentState && t.input === sym);
      if (!t) {
        setError(`No transition from state "${currentState}" on input "${sym}". Simulation halted.`);
        setResult({ trace });
        setStep(0);
        return;
      }
      const out = machineType === "mealy" ? t.output : stateOutputs?.[t.to] ?? "ε";
      trace.push({
        stepNum: i + 1,
        state: currentState,
        input: sym,
        nextState: t.to,
        output: out,
      });
      currentState = t.to;
    }

    setResult({ trace, finalState: currentState });
    setStep(0);
  };

  const outputString = result
    ? (machineType === "moore" ? result.trace : result.trace)
        .map((r) => r.output)
        .join("")
    : "";

  return (
    <div className="sim-wrapper">
      <div className="sim-input-row">
        <input
          className="sim-input"
          value={inputStr}
          onChange={(e) => { setInputStr(e.target.value); setResult(null); setError(""); }}
          placeholder={`Enter input string, e.g. ${machine?.inputAlpha?.join("") || "010"}`}
        />
        <button className="btn btn-primary" onClick={runSimulation}>
          ▶ Simulate
        </button>
        <button className="btn btn-outline" onClick={() => { setResult(null); setInputStr(""); setError(""); }}>
          Clear
        </button>
      </div>

      {error && <p className="sim-error">{error}</p>}

      {result && (
        <div className="sim-results">
          <div className="sim-output-bar">
            <span className="sim-out-label">Output string:</span>
            <span className="sim-out-value">{outputString || "(none)"}</span>
            <span className="sim-out-label">Final state:</span>
            <span className="sim-out-value">{result.finalState}</span>
          </div>

          {/* Step navigator */}
          <div className="sim-nav">
            <button
              className="btn btn-sm btn-outline"
              disabled={step === 0}
              onClick={() => setStep((s) => s - 1)}
            >
              ◀ Prev
            </button>
            <span className="sim-step-label">
              Step {step + 1} / {result.trace.length}
            </span>
            <button
              className="btn btn-sm btn-outline"
              disabled={step === result.trace.length - 1}
              onClick={() => setStep((s) => s + 1)}
            >
              Next ▶
            </button>
          </div>

          {/* Trace table */}
          <div className="sim-trace-scroll">
            <table className="sim-trace-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Current State</th>
                  <th>Input</th>
                  <th>Next State</th>
                  <th>Output</th>
                  {machineType === "moore" && <th>Note</th>}
                </tr>
              </thead>
              <tbody>
                {result.trace.map((row, i) => (
                  <tr
                    key={i}
                    className={`sim-trace-row ${i === step ? "sim-trace-row--active" : ""}`}
                  >
                    <td>{row.stepNum}</td>
                    <td className="sim-state">{row.state}</td>
                    <td className="sim-input-sym">{row.input}</td>
                    <td className="sim-state">{row.nextState}</td>
                    <td className="sim-output">{row.output}</td>
                    {machineType === "moore" && <td className="sim-note">{row.note || ""}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
