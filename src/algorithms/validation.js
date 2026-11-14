/**
 * Validation utilities for Mealy and Moore machines.
 */

export function validateMealyMachine({ states, inputAlpha, outputAlpha, initial, transitions }) {
  const errors = [];

  if (!states || states.length === 0) errors.push("At least one state is required.");
  if (!inputAlpha || inputAlpha.length === 0) errors.push("Input alphabet cannot be empty.");
  if (!outputAlpha || outputAlpha.length === 0) errors.push("Output alphabet cannot be empty.");
  if (!initial) errors.push("Initial state must be selected.");
  if (initial && !states.includes(initial)) errors.push(`Initial state "${initial}" is not in the states list.`);

  // Validate state names
  states.forEach((s) => {
    if (!/^[a-zA-Z0-9_]+$/.test(s)) errors.push(`State name "${s}" contains invalid characters. Use only letters, digits, and underscores.`);
  });

  // Validate alphabet symbols
  [...inputAlpha, ...outputAlpha].forEach((sym) => {
    if (sym.length === 0) errors.push("Alphabet symbol cannot be empty.");
  });

  // Check for duplicate transitions
  const seen = new Set();
  transitions.forEach(({ from, input, to, output }) => {
    const key = `${from}:${input}`;
    if (seen.has(key)) {
      errors.push(`Duplicate transition from state "${from}" on input "${input}".`);
    }
    seen.add(key);

    if (from && !states.includes(from)) errors.push(`Transition references unknown state "${from}".`);
    if (to && !states.includes(to)) errors.push(`Transition references unknown state "${to}".`);
    if (input && !inputAlpha.includes(input)) errors.push(`Transition uses unknown input symbol "${input}".`);
    if (output && !outputAlpha.includes(output)) errors.push(`Transition uses unknown output symbol "${output}".`);
  });

  // Missing transitions
  states.forEach((s) => {
    inputAlpha.forEach((a) => {
      const found = transitions.find((t) => t.from === s && t.input === a);
      if (!found) errors.push(`Missing transition from state "${s}" on input "${a}".`);
    });
  });

  return errors;
}

export function validateMooreMachine({ states, inputAlpha, outputAlpha, initial, stateOutputs, transitions }) {
  const errors = [];

  if (!states || states.length === 0) errors.push("At least one state is required.");
  if (!inputAlpha || inputAlpha.length === 0) errors.push("Input alphabet cannot be empty.");
  if (!outputAlpha || outputAlpha.length === 0) errors.push("Output alphabet cannot be empty.");
  if (!initial) errors.push("Initial state must be selected.");
  if (initial && !states.includes(initial)) errors.push(`Initial state "${initial}" is not in the states list.`);

  // Validate state outputs
  states.forEach((s) => {
    if (!/^[a-zA-Z0-9_]+$/.test(s)) errors.push(`State name "${s}" contains invalid characters.`);
    if (!stateOutputs[s]) errors.push(`State "${s}" has no output assigned.`);
    else if (!outputAlpha.includes(stateOutputs[s])) errors.push(`State "${s}" output "${stateOutputs[s]}" is not in the output alphabet.`);
  });

  // Check for duplicate transitions
  const seen = new Set();
  transitions.forEach(({ from, input, to }) => {
    const key = `${from}:${input}`;
    if (seen.has(key)) errors.push(`Duplicate transition from state "${from}" on input "${input}".`);
    seen.add(key);
    if (from && !states.includes(from)) errors.push(`Transition references unknown state "${from}".`);
    if (to && !states.includes(to)) errors.push(`Transition references unknown state "${to}".`);
    if (input && !inputAlpha.includes(input)) errors.push(`Transition uses unknown input symbol "${input}".`);
  });

  // Missing transitions
  states.forEach((s) => {
    inputAlpha.forEach((a) => {
      const found = transitions.find((t) => t.from === s && t.input === a);
      if (!found) errors.push(`Missing transition from state "${s}" on input "${a}".`);
    });
  });

  return errors;
}
