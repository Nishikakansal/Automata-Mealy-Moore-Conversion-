/**
 * Moore → Mealy Conversion Algorithm
 *
 * Key idea:
 *   In a Moore machine, output λ(q) is associated with each state q.
 *   In a Mealy machine, output is associated with each transition.
 *
 * Strategy (straightforward):
 *   Keep the same states, same transitions.
 *   For each Moore transition  q --a--> r,
 *   the Mealy output on that transition = λ(r)  (output of the DESTINATION state).
 *
 *   Timing note:
 *     Moore machines produce λ(q₀) at time 0 (before reading any input).
 *     Mealy machines produce output only on transitions — so the first output
 *     appears after reading the first input symbol.
 *     The converted Mealy machine's output sequence is the Moore machine's
 *     sequence shifted left by one symbol (the initial-state output is lost).
 *
 * This is the standard textbook conversion.
 */

/**
 * @param {object} moore
 *   {
 *     states:       string[],
 *     inputAlpha:   string[],
 *     outputAlpha:  string[],
 *     initial:      string,
 *     stateOutputs: { [state]: string },
 *     transitions:  { from, input, to }[]
 *   }
 * @returns {object} mealy
 *   {
 *     states:      string[],
 *     inputAlpha:  string[],
 *     outputAlpha: string[],
 *     initial:     string,
 *     transitions: { from, input, to, output }[]
 *   }
 */
export function mooreToMealy(moore) {
  const { states, inputAlpha, outputAlpha, initial, stateOutputs, transitions } = moore;

  // For each Moore transition q --a--> r, create Mealy transition q --a/λ(r)--> r
  const mealyTransitions = transitions.map(({ from, input, to }) => ({
    from,
    input,
    to,
    output: stateOutputs[to] ?? "ε",
  }));

  return {
    states: [...states],
    inputAlpha: [...inputAlpha],
    outputAlpha: [...outputAlpha],
    initial,
    transitions: mealyTransitions,
    // Note the initial state output that is lost in conversion
    lostInitialOutput: stateOutputs[initial] ?? "ε",
  };
}
