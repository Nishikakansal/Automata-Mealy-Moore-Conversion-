/**
 * Sample machines for demonstration purposes.
 */

/** Sample Mealy Machine: detects 0→1 transition */
export const SAMPLE_MEALY = {
  states: ["q0", "q1"],
  inputAlpha: ["0", "1"],
  outputAlpha: ["a", "b"],
  initial: "q0",
  transitions: [
    { from: "q0", input: "0", to: "q0", output: "a" },
    { from: "q0", input: "1", to: "q1", output: "b" },
    { from: "q1", input: "0", to: "q0", output: "b" },
    { from: "q1", input: "1", to: "q1", output: "a" },
  ],
};

/** Sample Mealy Machine 2: 3-state parity checker */
export const SAMPLE_MEALY_2 = {
  states: ["A", "B", "C"],
  inputAlpha: ["0", "1"],
  outputAlpha: ["x", "y"],
  initial: "A",
  transitions: [
    { from: "A", input: "0", to: "B", output: "x" },
    { from: "A", input: "1", to: "C", output: "y" },
    { from: "B", input: "0", to: "A", output: "y" },
    { from: "B", input: "1", to: "C", output: "x" },
    { from: "C", input: "0", to: "B", output: "x" },
    { from: "C", input: "1", to: "A", output: "y" },
  ],
};

/** Sample Moore Machine: simple 2-state */
export const SAMPLE_MOORE = {
  states: ["s0", "s1"],
  inputAlpha: ["0", "1"],
  outputAlpha: ["0", "1"],
  initial: "s0",
  stateOutputs: { s0: "0", s1: "1" },
  transitions: [
    { from: "s0", input: "0", to: "s0" },
    { from: "s0", input: "1", to: "s1" },
    { from: "s1", input: "0", to: "s0" },
    { from: "s1", input: "1", to: "s1" },
  ],
};

/** Sample Moore Machine 2: 3-state sequence */
export const SAMPLE_MOORE_2 = {
  states: ["p0", "p1", "p2"],
  inputAlpha: ["a", "b"],
  outputAlpha: ["0", "1", "2"],
  initial: "p0",
  stateOutputs: { p0: "0", p1: "1", p2: "2" },
  transitions: [
    { from: "p0", input: "a", to: "p1" },
    { from: "p0", input: "b", to: "p0" },
    { from: "p1", input: "a", to: "p2" },
    { from: "p1", input: "b", to: "p0" },
    { from: "p2", input: "a", to: "p2" },
    { from: "p2", input: "b", to: "p1" },
  ],
};
