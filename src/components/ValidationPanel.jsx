import React from "react";
import "./ValidationPanel.css";

export default function ValidationPanel({ errors }) {
  if (!errors || errors.length === 0) return null;

  return (
    <div className="vp-wrapper">
      <div className="vp-header">
        <span className="vp-icon">⚠️</span>
        <span className="vp-title">Validation Errors ({errors.length})</span>
      </div>
      <ul className="vp-list">
        {errors.map((err, i) => (
          <li key={i} className="vp-item">
            {err}
          </li>
        ))}
      </ul>
    </div>
  );
}
