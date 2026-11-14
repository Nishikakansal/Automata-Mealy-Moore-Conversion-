import React from "react";
import "./AlphabetEditor.css";

/**
 * AlphabetEditor – lets users add/remove symbols from a string set (input or output alphabet).
 */
export default function AlphabetEditor({ label, symbols, onAdd, onRemove, placeholder }) {
  const [input, setInput] = React.useState("");
  const [error, setError] = React.useState("");

  const handleAdd = () => {
    const val = input.trim();
    if (!val) return;
    if (symbols.includes(val)) {
      setError(`"${val}" already exists.`);
      return;
    }
    if (!/^[a-zA-Z0-9εε∅_\-+*]$/.test(val) && val.length > 1) {
      setError("Symbol must be a single character.");
      return;
    }
    setError("");
    onAdd(val);
    setInput("");
  };

  const handleKey = (e) => {
    if (e.key === "Enter") handleAdd();
  };

  return (
    <div className="alpha-editor">
      <label className="alpha-label">{label}</label>
      <div className="alpha-symbols">
        {symbols.map((sym) => (
          <span key={sym} className="alpha-chip">
            {sym}
            <button
              className="chip-remove"
              onClick={() => onRemove(sym)}
              title={`Remove ${sym}`}
            >
              ×
            </button>
          </span>
        ))}
        {symbols.length === 0 && (
          <span className="alpha-empty">No symbols yet</span>
        )}
      </div>
      <div className="alpha-input-row">
        <input
          className="alpha-input"
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(""); }}
          onKeyDown={handleKey}
          placeholder={placeholder || "e.g. 0"}
          maxLength={4}
        />
        <button className="btn btn-sm btn-primary" onClick={handleAdd}>
          + Add
        </button>
      </div>
      {error && <p className="alpha-error">{error}</p>}
    </div>
  );
}
