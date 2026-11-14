# ⚙️ Mealy–Moore Machine Converter

An interactive web application for converting between **Mealy** and **Moore** finite state machines — with live state diagrams, transition tables, step-by-step simulation, and full validation.

Built with **React + Vite**, plain CSS, and [@xyflow/react](https://reactflow.dev/) for diagrams.

---

## 🚀 Setup & Running

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Open in browser
# http://localhost:5173
```

---

## ✨ Features

| Feature | Description |
|---|---|
| **Mealy → Moore** | Converts Mealy machines to Moore, splitting states when needed |
| **Moore → Mealy** | Converts Moore machines to Mealy (straightforward output assignment) |
| **Custom alphabets** | Define your own input & output symbol sets |
| **State editor** | Add/remove states, set initial state, assign Moore outputs |
| **Transition editor** | Grid table — select next state (and output for Mealy) per cell |
| **Validation** | Catches missing/duplicate transitions, invalid symbols, missing outputs |
| **Transition table** | Read-only display of the converted machine |
| **State diagram** | Interactive React Flow diagram with drag, zoom, minimap |
| **Simulator** | Step-by-step trace on a custom input string |
| **Sample machines** | 2 Mealy + 2 Moore sample machines to explore immediately |
| **Timing explanation** | Algorithm steps + one-symbol timing difference explained in-app |

---

## 🧮 Conversion Algorithms

### Mealy → Moore

The key challenge is that Moore machine outputs are per-state, not per-transition.

**Algorithm:**

1. **Collect incoming outputs** — For each Mealy state `q`, gather all output symbols carried by transitions arriving at `q`.

2. **Split states** — If multiple distinct outputs arrive at `q`:
   - Create one Moore copy per distinct output: `q_a`, `q_b`, …
   - Each copy gets that output as its Moore output `λ(state)`.
   - If only one distinct output arrives, one copy suffices.

3. **Handle the initial state** — The initial Mealy state has *no* incoming transition, so its output is undefined. A dedicated copy `q₀_start` with output `ε` is prepended.

4. **Redirect transitions** — For each Moore state `M` (originating from Mealy state `q`) and each input `a`:
   - Find Mealy transition `q --a/z--> r`
   - The target Moore state is the copy of `r` whose output equals `z`

**Timing difference:** Moore machines emit `λ(q₀)` *before* reading any input (time 0). The extra `q₀_start` state models this initial output explicitly.

---

### Moore → Mealy

Much simpler — the machines are structurally identical.

**Algorithm:**

1. Keep all states and transitions as-is.
2. For each transition `q --a--> r`, assign the Mealy output = `λ(r)` (destination state's output).
3. No state splitting is needed.

**Timing difference:** The Moore machine emits `λ(q₀)` before the first input symbol. The converted Mealy machine only emits output on transitions, so `λ(q₀)` is *lost*. The Mealy output sequence equals the Moore sequence shifted left by one.

---

## 📁 Project Structure

```
src/
├── algorithms/
│   ├── mealyToMoore.js    # Mealy → Moore conversion
│   ├── mooreToMealy.js    # Moore → Mealy conversion
│   ├── validation.js      # Input validation utilities
│   └── samples.js         # Sample machines
├── components/
│   ├── AlphabetEditor     # Add/remove alphabet symbols
│   ├── StateEditor        # Add/remove states, set outputs
│   ├── TransitionEditor   # Grid-based transition definition
│   ├── TransitionTable    # Read-only transition table display
│   ├── StateDiagram       # Interactive React Flow diagram
│   ├── ValidationPanel    # Error display
│   ├── InfoPanel          # Algorithm explanation
│   └── SimulatorPanel     # Step-by-step simulation
├── hooks/
│   └── useList.js         # Reusable list management hook
├── App.jsx                # Main application with state management
├── App.css
└── index.css              # Global styles & design tokens
```

---

## 🔬 Sample Machines Included

### Mealy Machines
- **Sample 1** – 2-state machine over `{0,1}` with outputs `{a,b}`
- **Sample 2** – 3-state machine over `{0,1}` with outputs `{x,y}`

### Moore Machines  
- **Sample 1** – 2-state machine over `{0,1}` with outputs `{0,1}`
- **Sample 2** – 3-state machine over `{a,b}` with outputs `{0,1,2}`

---

## 🧪 Testing the Conversion

1. Click **Load Sample 1** under Mealy → Moore
2. Go to **Transitions** tab to see the input machine
3. Click **⚡ Convert Machine**
4. View the Moore machine in the **Transition Table** and **Diagram** tabs
5. Use **Simulate** on both machines to compare output sequences

---

## 📜 License

MIT
