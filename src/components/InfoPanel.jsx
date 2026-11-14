import React from "react";
import "./InfoPanel.css";

/**
 * InfoPanel – explains the timing difference and algorithm steps.
 */
export default function InfoPanel({ direction, result }) {
  if (direction === "mealyToMoore") {
    return (
      <div className="info-wrapper">
        <h3 className="info-title">🔄 Mealy → Moore: How it Works</h3>
        <ol className="info-steps">
          <li>
            <strong>Identify incoming transition outputs</strong> – For each
            Mealy state <em>q</em>, collect the output symbols on all transitions
            arriving at <em>q</em>.
          </li>
          <li>
            <strong>Split states if needed</strong> – If multiple distinct
            outputs arrive at <em>q</em>, create one Moore copy per output:
            <code>q_a</code>, <code>q_b</code>, … Each copy carries that output
            as its Moore output λ(state).
          </li>
          <li>
            <strong>Handle the initial state</strong> – The initial Mealy state
            has no incoming transition, so its output is undefined. A dedicated
            copy <code>q₀_start</code> with output <strong>ε</strong> is added.
          </li>
          <li>
            <strong>Redirect transitions</strong> – For every (Moore state, input)
            pair, follow the original Mealy transition to find the next Mealy
            state <em>r</em> and output <em>z</em>. The Moore target is the copy
            of <em>r</em> whose output equals <em>z</em>.
          </li>
        </ol>
        <div className="info-note">
          <strong>⏱ Timing note:</strong> Moore machines emit one extra output
          (λ(q₀)) <em>before</em> reading any input. This is why the converted
          Moore machine has one more state than the Mealy machine — the
          start-state output must be modelled explicitly.
        </div>
        {result && (
          <div className="info-result-summary">
            <strong>Conversion summary:</strong> {result.states.length} Moore
            states generated from {result.mooreStates?.length} Mealy states.
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="info-wrapper">
      <h3 className="info-title">🔄 Moore → Mealy: How it Works</h3>
      <ol className="info-steps">
        <li>
          <strong>Keep the same states & structure</strong> – Moore and the
          resulting Mealy machine share identical states and transitions.
        </li>
        <li>
          <strong>Assign transition outputs</strong> – For each Moore transition
          <em> q →[input]→ r</em>, the Mealy output on that transition becomes
          <strong> λ(r)</strong> (the output of the <em>destination</em> state).
        </li>
        <li>
          <strong>No state splitting needed</strong> – Moore→Mealy is always a
          straightforward one-to-one mapping.
        </li>
      </ol>
      <div className="info-note">
        <strong>⏱ Timing note:</strong> The Moore machine emits{" "}
        <strong>λ(q₀)</strong> at time 0 (before reading any input). The Mealy
        machine emits its first output only after reading the first input symbol.
        The converted Mealy output sequence equals the Moore sequence shifted
        left by one symbol — the initial output{" "}
        {result?.lostInitialOutput ? `"${result.lostInitialOutput}"` : "ε"} is
        lost.
      </div>
    </div>
  );
}
