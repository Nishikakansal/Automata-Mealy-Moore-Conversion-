import React, { useState, useCallback } from "react";
import AlphabetEditor from "./components/AlphabetEditor";
import StateEditor from "./components/StateEditor";
import TransitionEditor from "./components/TransitionEditor";
import TransitionTable from "./components/TransitionTable";
import StateDiagram from "./components/StateDiagram";
import ValidationPanel from "./components/ValidationPanel";
import InfoPanel from "./components/InfoPanel";
import SimulatorPanel from "./components/SimulatorPanel";
import { mealyToMoore } from "./algorithms/mealyToMoore";
import { mooreToMealy } from "./algorithms/mooreToMealy";
import { validateMealyMachine, validateMooreMachine } from "./algorithms/validation";
import {
  SAMPLE_MEALY,
  SAMPLE_MEALY_2,
  SAMPLE_MOORE,
  SAMPLE_MOORE_2,
} from "./algorithms/samples";
import "./App.css";

const TABS_INPUT = ["States & Alphabet", "Transitions", "Diagram", "Simulate"];
const TABS_OUTPUT = ["Transition Table", "Diagram", "Simulate"];

export default function App() {
  // ── Conversion direction ────────────────────────────────────────────────
  const [direction, setDirection] = useState("mealyToMoore"); // | "mooreToMealy"

  // ── Input machine state ─────────────────────────────────────────────────
  const [states, setStates] = useState([]);
  const [inputAlpha, setInputAlpha] = useState([]);
  const [outputAlpha, setOutputAlpha] = useState([]);
  const [initial, setInitial] = useState("");
  const [transitions, setTransitions] = useState([]);
  const [stateOutputs, setStateOutputs] = useState({}); // Moore only

  // ── UI state ─────────────────────────────────────────────────────────────
  const [inputTab, setInputTab] = useState(0);
  const [outputTab, setOutputTab] = useState(0);
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState([]);
  const [converted, setConverted] = useState(false);

  const inputMachineType = direction === "mealyToMoore" ? "mealy" : "moore";
  const outputMachineType = direction === "mealyToMoore" ? "moore" : "mealy";

  // ── Alphabet handlers ────────────────────────────────────────────────────
  const addInputSym = (sym) => setInputAlpha((prev) => [...prev, sym]);
  const removeInputSym = (sym) => {
    setInputAlpha((prev) => prev.filter((s) => s !== sym));
    setTransitions((prev) => prev.filter((t) => t.input !== sym));
  };

  const addOutputSym = (sym) => setOutputAlpha((prev) => [...prev, sym]);
  const removeOutputSym = (sym) => {
    setOutputAlpha((prev) => prev.filter((s) => s !== sym));
    if (direction === "mealyToMoore") {
      setTransitions((prev) => prev.filter((t) => t.output !== sym));
    } else {
      setStateOutputs((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((k) => { if (next[k] === sym) delete next[k]; });
        return next;
      });
    }
  };

  // ── State handlers ───────────────────────────────────────────────────────
  const addState = (name) => {
    setStates((prev) => [...prev, name]);
  };

  const removeState = (name) => {
    setStates((prev) => prev.filter((s) => s !== name));
    setTransitions((prev) => prev.filter((t) => t.from !== name && t.to !== name));
    setStateOutputs((prev) => { const n = { ...prev }; delete n[name]; return n; });
    if (initial === name) setInitial("");
  };

  const setInitialState = (name) => setInitial(name);

  const setStateOutput = (state, output) => {
    setStateOutputs((prev) => ({ ...prev, [state]: output }));
  };

  // ── Transition handlers ──────────────────────────────────────────────────
  const updateTransition = useCallback((from, input, to, output) => {
    setTransitions((prev) => {
      const filtered = prev.filter((t) => !(t.from === from && t.input === input));
      if (!to) return filtered;
      if (direction === "mealyToMoore") {
        return [...filtered, { from, input, to, output: output || "" }];
      }
      return [...filtered, { from, input, to }];
    });
  }, [direction]);

  // ── Convert ──────────────────────────────────────────────────────────────
  const handleConvert = () => {
    const machine = { states, inputAlpha, outputAlpha, initial, transitions, stateOutputs };
    const validationErrors =
      direction === "mealyToMoore"
        ? validateMealyMachine(machine)
        : validateMooreMachine(machine);

    setErrors(validationErrors);
    if (validationErrors.length > 0) {
      setResult(null);
      setConverted(false);
      return;
    }

    const output =
      direction === "mealyToMoore"
        ? mealyToMoore(machine)
        : mooreToMealy(machine);

    setResult(output);
    setConverted(true);
    setOutputTab(0);
  };

  // ── Load sample ──────────────────────────────────────────────────────────
  const loadSample = (sample) => {
    if (direction === "mealyToMoore") {
      setStates(sample.states);
      setInputAlpha(sample.inputAlpha);
      setOutputAlpha(sample.outputAlpha);
      setInitial(sample.initial);
      setTransitions(sample.transitions);
      setStateOutputs({});
    } else {
      setStates(sample.states);
      setInputAlpha(sample.inputAlpha);
      setOutputAlpha(sample.outputAlpha);
      setInitial(sample.initial);
      setTransitions(sample.transitions);
      setStateOutputs(sample.stateOutputs || {});
    }
    setResult(null);
    setErrors([]);
    setConverted(false);
    setInputTab(0);
  };

  // ── Reset ────────────────────────────────────────────────────────────────
  const handleReset = () => {
    setStates([]); setInputAlpha([]); setOutputAlpha([]);
    setInitial(""); setTransitions([]); setStateOutputs({});
    setResult(null); setErrors([]); setConverted(false);
  };

  // ── Direction change ─────────────────────────────────────────────────────
  const handleDirectionChange = (dir) => {
    setDirection(dir);
    handleReset();
  };

  const samples = direction === "mealyToMoore"
    ? [{ label: "Sample 1 (2-state)", data: SAMPLE_MEALY }, { label: "Sample 2 (3-state)", data: SAMPLE_MEALY_2 }]
    : [{ label: "Sample 1 (2-state)", data: SAMPLE_MOORE }, { label: "Sample 2 (3-state)", data: SAMPLE_MOORE_2 }];

  const inputMachine = { states, inputAlpha, outputAlpha, initial, transitions, stateOutputs };

  return (
    <div className="app">
      {/* ── Header ── */}
      <header className="app-header">
        <div className="header-content">
          <div className="header-logo">
            <span className="logo-icon">⚙️</span>
            <span className="logo-text">Mealy–Moore Converter</span>
          </div>
          <p className="header-subtitle">
            Convert between Mealy and Moore finite state machines with interactive diagrams
          </p>
        </div>
      </header>

      {/* ── Direction selector ── */}
      <section className="direction-section">
        <div className="direction-card">
          <h2 className="direction-label">Conversion Direction</h2>
          <div className="direction-toggle">
            <button
              className={`dir-btn ${direction === "mealyToMoore" ? "dir-btn--active" : ""}`}
              onClick={() => handleDirectionChange("mealyToMoore")}
            >
              <span className="dir-icon">🔀</span>
              Mealy → Moore
            </button>
            <span className="dir-arrow">⟷</span>
            <button
              className={`dir-btn ${direction === "mooreToMealy" ? "dir-btn--active" : ""}`}
              onClick={() => handleDirectionChange("mooreToMealy")}
            >
              <span className="dir-icon">🔁</span>
              Moore → Mealy
            </button>
          </div>

          {/* Sample loaders */}
          <div className="sample-row">
            <span className="sample-label">Load sample:</span>
            {samples.map((s) => (
              <button
                key={s.label}
                className="btn btn-sm btn-ghost"
                onClick={() => loadSample(s.data)}
              >
                {s.label}
              </button>
            ))}
            <button className="btn btn-sm btn-danger-ghost" onClick={handleReset}>
              Reset
            </button>
          </div>
        </div>
      </section>

      {/* ── Main layout ── */}
      <div className="main-grid">
        {/* ── Left: Input machine builder ── */}
        <section className="panel panel-input">
          <div className="panel-header">
            <h2 className="panel-title">
              {inputMachineType === "mealy" ? "🟣 Mealy Machine" : "🔵 Moore Machine"}
              <span className="panel-subtitle"> (Input)</span>
            </h2>
          </div>

          <div className="tab-bar">
            {TABS_INPUT.map((tab, i) => (
              <button
                key={tab}
                className={`tab-btn ${inputTab === i ? "tab-btn--active" : ""}`}
                onClick={() => setInputTab(i)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="tab-content">
            {inputTab === 0 && (
              <div className="setup-grid">
                <div className="setup-col">
                  <h3 className="section-heading">Input Alphabet (Σ)</h3>
                  <AlphabetEditor
                    label=""
                    symbols={inputAlpha}
                    onAdd={addInputSym}
                    onRemove={removeInputSym}
                    placeholder="e.g. 0"
                  />
                  <h3 className="section-heading mt">Output Alphabet (Δ)</h3>
                  <AlphabetEditor
                    label=""
                    symbols={outputAlpha}
                    onAdd={addOutputSym}
                    onRemove={removeOutputSym}
                    placeholder="e.g. a"
                  />
                </div>
                <div className="setup-col">
                  <h3 className="section-heading">States (Q)</h3>
                  <StateEditor
                    states={states}
                    initial={initial}
                    stateOutputs={stateOutputs}
                    outputAlpha={outputAlpha}
                    onAddState={addState}
                    onRemoveState={removeState}
                    onSetInitial={setInitialState}
                    onSetOutput={setStateOutput}
                    machineType={inputMachineType}
                  />
                </div>
              </div>
            )}

            {inputTab === 1 && (
              <div>
                <p className="trans-hint">
                  {inputMachineType === "mealy"
                    ? "For each cell, select next state and output symbol."
                    : "For each cell, select next state. Output is set per state above."}
                </p>
                <TransitionEditor
                  states={states}
                  inputAlpha={inputAlpha}
                  outputAlpha={outputAlpha}
                  transitions={transitions}
                  onUpdateTransition={updateTransition}
                  machineType={inputMachineType}
                />
              </div>
            )}

            {inputTab === 2 && (
              <StateDiagram machine={inputMachine} machineType={inputMachineType} />
            )}

            {inputTab === 3 && (
              <SimulatorPanel machine={inputMachine} machineType={inputMachineType} />
            )}
          </div>

          {/* Convert button */}
          <div className="convert-bar">
            <button className="btn btn-convert" onClick={handleConvert}>
              ⚡ Convert Machine
            </button>
          </div>
        </section>

        {/* ── Right: Output machine ── */}
        <section className={`panel panel-output ${converted ? "panel-output--ready" : ""}`}>
          <div className="panel-header">
            <h2 className="panel-title">
              {outputMachineType === "mealy" ? "🟣 Mealy Machine" : "🔵 Moore Machine"}
              <span className="panel-subtitle"> (Output)</span>
            </h2>
            {converted && (
              <span className="panel-badge">✓ Converted</span>
            )}
          </div>

          <ValidationPanel errors={errors} />

          {!converted && errors.length === 0 && (
            <div className="output-placeholder">
              <div className="placeholder-icon">🔄</div>
              <p>Define your input machine and click <strong>Convert Machine</strong>.</p>
            </div>
          )}

          {converted && result && (
            <>
              <div className="tab-bar">
                {TABS_OUTPUT.map((tab, i) => (
                  <button
                    key={tab}
                    className={`tab-btn ${outputTab === i ? "tab-btn--active" : ""}`}
                    onClick={() => setOutputTab(i)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="tab-content">
                {outputTab === 0 && (
                  <TransitionTable machine={result} machineType={outputMachineType} />
                )}
                {outputTab === 1 && (
                  <StateDiagram machine={result} machineType={outputMachineType} />
                )}
                {outputTab === 2 && (
                  <SimulatorPanel machine={result} machineType={outputMachineType} />
                )}
              </div>
            </>
          )}
        </section>
      </div>

      {/* ── Algorithm explanation ── */}
      <section className="info-section">
        <InfoPanel direction={direction} result={result} />
      </section>

      <footer className="app-footer">
        <p>Mealy–Moore Machine Converter · Built with React + Vite</p>
      </footer>
    </div>
  );
}
