import React, { useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "./StateDiagram.css";

/** Build circular layout positions */
function circleLayout(states, cx = 300, cy = 250, r = 180) {
  const n = states.length;
  return states.map((s, i) => {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    return {
      id: s,
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  });
}

/** Custom state node */
function StateNode({ data }) {
  return (
    <div className={`snode ${data.isInitial ? "snode--initial" : ""}`}>
      {data.isInitial && <div className="snode-arrow" />}
      <div className="snode-name">{data.label}</div>
      {data.output !== undefined && (
        <div className="snode-output">λ={data.output}</div>
      )}
    </div>
  );
}

const nodeTypes = { stateNode: StateNode };

/** Custom self-loop edge */
function SelfLoopEdge({ id, sourceX, sourceY, data, markerEnd, style }) {
  const size = 50;
  const path = `M ${sourceX},${sourceY - 15} C ${sourceX - size},${sourceY - size * 2} ${sourceX + size},${sourceY - size * 2} ${sourceX},${sourceY - 15}`;
  const labelX = sourceX;
  const labelY = sourceY - size * 2 - 10;
  return (
    <>
      <path id={id} className="react-flow__edge-path" d={path} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "all",
          }}
          className="edge-label"
        >
          {data.label}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

function CurvedEdge({ id, sourceX, sourceY, targetX, targetY, data, markerEnd, style }) {
  const [edgePath, labelX, labelY] = getBezierPath({ sourceX, sourceY, targetX, targetY });
  return (
    <>
      <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "all",
          }}
          className="edge-label"
        >
          {data.label}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

const edgeTypes = { selfLoop: SelfLoopEdge, curved: CurvedEdge };

/**
 * StateDiagram – renders a Mealy or Moore machine as an interactive flow diagram.
 */
export default function StateDiagram({ machine, machineType }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (!machine) return;
    const { states, transitions, initial, stateOutputs } = machine;

    const positions = circleLayout(states);
    const posMap = Object.fromEntries(positions.map((p) => [p.id, p]));

    const newNodes = states.map((s) => ({
      id: s,
      type: "stateNode",
      position: { x: posMap[s]?.x ?? 200, y: posMap[s]?.y ?? 200 },
      data: {
        label: s,
        isInitial: s === initial,
        output: machineType === "moore" ? stateOutputs?.[s] : undefined,
      },
    }));

    // Group transitions by from→to to combine labels
    const edgeMap = {};
    transitions.forEach((t) => {
      const key = `${t.from}__${t.to}`;
      if (!edgeMap[key]) edgeMap[key] = { from: t.from, to: t.to, labels: [] };
      const lbl = machineType === "mealy" ? `${t.input}/${t.output}` : t.input;
      edgeMap[key].labels.push(lbl);
    });

    const newEdges = Object.entries(edgeMap).map(([key, { from, to, labels }]) => {
      const isSelf = from === to;
      return {
        id: key,
        source: from,
        target: to,
        type: isSelf ? "selfLoop" : "curved",
        markerEnd: { type: MarkerType.ArrowClosed, color: "#818cf8" },
        style: { stroke: "#818cf8", strokeWidth: 2 },
        data: { label: labels.join(", ") },
      };
    });

    setNodes(newNodes);
    setEdges(newEdges);
  }, [machine, machineType]);

  if (!machine || machine.states.length === 0) {
    return (
      <div className="diagram-empty">
        <p>No machine to display. Define states and transitions first.</p>
      </div>
    );
  }

  return (
    <div className="diagram-wrapper">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#1e1b4b" gap={20} />
        <Controls />
        <MiniMap
          nodeColor={(n) => (n.data?.isInitial ? "#6366f1" : "#312e81")}
          maskColor="rgba(15,10,50,0.5)"
        />
      </ReactFlow>
    </div>
  );
}
