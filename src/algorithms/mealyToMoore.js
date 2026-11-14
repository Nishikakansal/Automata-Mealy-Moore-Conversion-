/**
 * Mealy → Moore Conversion Algorithm
 *
 * Key idea:
 *   In a Mealy machine, output depends on (state, input).
 *   In a Moore machine, output depends only on state.
 *
 * Strategy:
 *   For each Mealy state q, look at every transition that arrives AT q.
 *   Group incoming transitions by their output symbol.
 *   If all incoming transitions to q share the same output → one Moore state q/output.
 *   If incoming transitions to q have different outputs → split q into q_a, q_b, …
 *     one copy per distinct output symbol (q_out).
 *
 *   Special case – initial state:
 *     The initial state has no incoming transition, so its output is undefined/arbitrary.
 *     We create a dedicated "start" copy whose Moore output is the empty string "ε"
 *     (or a user-supplied start output). This correctly models the one-symbol timing
 *     difference: Moore outputs one extra symbol at the start (before any input).
 */

/**
 * @param {object} mealy
 *   {
 *     states:      string[],
 *     inputAlpha:  string[],
 *     outputAlpha: string[],
 *     initial:     string,
 *     transitions: { from, input, to, output }[]
 *   }
 * @returns {object} moore
 *   {
 *     states:      string[],          // new Moore state names like "q0_a"
 *     inputAlpha:  string[],
 *     outputAlpha: string[],
 *     initial:     string,
 *     stateOutputs: { [state]: string },
 *     transitions: { from, input, to }[]
 *     originMap:   { [mooreState]: mealyState }  // for UI labelling
 *   }
 */
export function mealyToMoore(mealy) {
  const { states, inputAlpha, outputAlpha, initial, transitions } = mealy;

  // Step 1: For each Mealy state, collect all distinct outputs from incoming transitions.
  //         incoming[state] = Set of output symbols that arrive at `state`.
  const incoming = {};
  states.forEach((s) => (incoming[s] = new Set()));

  transitions.forEach(({ to, output }) => {
    incoming[to].add(output);
  });

  // Step 2: Build Moore state names.
  //   For a Mealy state q:
  //     If |incoming[q]| <= 1  →  one Moore state, named "q" (or "q_ε" for initial)
  //     If |incoming[q]| > 1   →  one Moore state per output: "q_<output>"
  //
  //   The initial state always gets an extra copy called "q_start" with output "ε"
  //   (since no transition leads to it, we can't derive its output from transitions).

  // mooreStates: Array of { name, mealyOrigin, output }
  const mooreStates = [];
  // mealyToMooreMap[mealyState][outputSymbol] = mooreName
  const mealyToMooreMap = {};

  states.forEach((s) => {
    mealyToMooreMap[s] = {};
    const outs = [...incoming[s]];

    if (outs.length === 0) {
      // No incoming transitions (could be the initial state or unreachable)
      // Give it output "ε"
      const name = s;
      mooreStates.push({ name, mealyOrigin: s, output: "ε" });
      mealyToMooreMap[s]["ε"] = name;
      // Also add a default entry so look-ups work for any output
      mealyToMooreMap[s]["_default"] = name;
    } else if (outs.length === 1) {
      // All incoming transitions carry the same output
      const out = outs[0];
      const name = s;
      mooreStates.push({ name, mealyOrigin: s, output: out });
      mealyToMooreMap[s][out] = name;
      mealyToMooreMap[s]["_default"] = name;
    } else {
      // Need to split
      outs.forEach((out) => {
        const safeName = out.replace(/[^a-zA-Z0-9]/g, "X");
        const name = `${s}_${safeName}`;
        mooreStates.push({ name, mealyOrigin: s, output: out });
        mealyToMooreMap[s][out] = name;
      });
    }
  });

  // Step 3: Handle the initial state.
  //   Add a dedicated initial Moore state with output "ε".
  //   This is necessary because Moore machines emit an output before reading any input.
  const initMooreState = `${initial}_start`;
  mooreStates.unshift({ name: initMooreState, mealyOrigin: initial, output: "ε" });
  mealyToMooreMap[initial]["_start"] = initMooreState;

  // Step 4: Build transitions.
  //   For each Moore state M (which originated from Mealy state q),
  //   and for each input symbol a:
  //     Find the Mealy transition q --a--> r / z
  //     The target Moore state is mealyToMooreMap[r][z]
  const mooreTransitions = [];
  const stateOutputs = {};

  mooreStates.forEach(({ name, mealyOrigin, output }) => {
    stateOutputs[name] = output;

    inputAlpha.forEach((a) => {
      // Find the Mealy transition from mealyOrigin on input a
      const mealyTrans = transitions.find(
        (t) => t.from === mealyOrigin && t.input === a
      );

      if (mealyTrans) {
        const targetMealy = mealyTrans.to;
        const outSym = mealyTrans.output;
        // Target Moore state: the copy of targetMealy with output = outSym
        let targetMoore =
          mealyToMooreMap[targetMealy]?.[outSym] ??
          mealyToMooreMap[targetMealy]?.["_default"];

        if (!targetMoore) {
          // fallback: pick first copy
          const firstCopy = mooreStates.find(
            (ms) => ms.mealyOrigin === targetMealy
          );
          targetMoore = firstCopy ? firstCopy.name : targetMealy;
        }

        mooreTransitions.push({ from: name, input: a, to: targetMoore });
      }
    });
  });

  // Build originMap for UI display
  const originMap = {};
  mooreStates.forEach(({ name, mealyOrigin }) => {
    originMap[name] = mealyOrigin;
  });

  return {
    states: mooreStates.map((s) => s.name),
    inputAlpha,
    outputAlpha,
    initial: initMooreState,
    stateOutputs,
    transitions: mooreTransitions,
    originMap,
    mooreStates, // full detail for display
  };
}
