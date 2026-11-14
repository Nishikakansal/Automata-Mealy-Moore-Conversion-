import React from "react";
import "./StateEditor.css";

/**
 * StateEditor – add/edit/delete states, mark initial state, assign Moore outputs.
 */
export default function StateEditor({
  states,
  initial,
  stateOutputs, // only for Moore
  outputAlpha,  // only for Moore
  onAddState,
  onRemoveState,
  onSetInitial,
  onSetOutput,   // only for Moore
  machineType,   // "mealy" | "moore"
}) {
  const [newName, setNewName] = React.useState("");
  const [error, setError] = React.useState("");

  const handleAdd = () => {
    const val = newName.trim();
    if (!val) return;
    if (!/^[a-zA-Z0-9_]+$/.test(val)) {
      setError("State names can only contain letters, digits, and underscores.");
      return;
    }
    if (states.includes(val)) {
      setError(`State "${val}" already exists.`);
      return;
    }
    setError("");
    onAddState(val);
    setNewName("");
  };

  const handleKey = (e) => {
    if (e.key === "Enter") handleAdd();
  };

  return (
    <div className="state-editor">
      <div className="state-add-row">
        <input
          className="state-input"
          value={newName}
          onChange={(e) => { setNewName(e.target.value); setError(""); }}
          onKeyDown={handleKey}
          placeholder="State name, e.g. q0"
        />
        <button className="btn btn-sm btn-primary" onClick={handleAdd}>
          + Add State
        </button>
      </div>
      {error && <p className="state-error">{error}</p>}

      {states.length === 0 ? (
        <p className="state-empty">No states yet. Add some above.</p>
      ) : (
        <div className="state-list">
          {states.map((s) => (
            <div key={s} className={`state-row ${s === initial ? "state-row--initial" : ""}`}>
              <div className="state-row-left">
                <span className="state-badge">
                  {s === initial && <span className="state-initial-arrow">→ </span>}
                  {s}
                </span>
                {machineType === "moore" && (
                  <div className="state-output-selector">
                    <label>Output:</label>
                    <select
                      value={stateOutputs?.[s] || ""}
                      onChange={(e) => onSetOutput(s, e.target.value)}
                      className="state-output-select"
                    >
                      <option value="">-- select --</option>
                      {outputAlpha?.map((sym) => (
                        <option key={sym} value={sym}>{sym}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <div className="state-row-actions">
                <button
                  className={`btn btn-xs ${s === initial ? "btn-success" : "btn-outline"}`}
                  onClick={() => onSetInitial(s)}
                  title="Set as initial state"
                >
                  {s === initial ? "✓ Initial" : "Set Initial"}
                </button>
                <button
                  className="btn btn-xs btn-danger"
                  onClick={() => onRemoveState(s)}
                  title="Remove state"
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
