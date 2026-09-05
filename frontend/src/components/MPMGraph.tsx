import { useMemo, useState } from 'react'
import { Background, Controls, MarkerType, ReactFlow, useNodesState, type Edge, type Node } from '@xyflow/react'
import dagre from 'dagre'
import '@xyflow/react/dist/style.css'
import type { MPMResult } from '../types/mpm'
import { MPMNode } from './MPMNode'

const nodeTypes = { mpm: MPMNode }
const NODE_WIDTH = 112
const NODE_HEIGHT = 142

function distributedHandle(index: number, count: number, prefix: 'in' | 'out') {
  if (count <= 1) return `${prefix}-1`
  if (count === 2) return `${prefix}-${index === 0 ? 0 : 2}`
  return `${prefix}-${Math.min(2, Math.round(index * 2 / (count - 1)))}`
}

function createGraph(result: MPMResult) {
  const layout = new dagre.graphlib.Graph()
  layout.setGraph({ rankdir: 'LR', ranksep: 155, nodesep: 85, edgesep: 55, marginx: 45, marginy: 55, ranker: 'network-simplex' })
  layout.setDefaultEdgeLabel(() => ({}))
  result.nodes.forEach(node => layout.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT }))
  result.edges.forEach(edge => layout.setEdge(edge.source, edge.target))
  dagre.layout(layout)

  const nodes: Node[] = result.nodes.map(node => {
    const position = layout.node(node.id)
    return {
      id: node.id,
      type: 'mpm',
      position: { x: position.x - NODE_WIDTH / 2, y: position.y - NODE_HEIGHT / 2 },
      data: {
        label: node.kind === 'start' ? 'Début' : node.kind === 'finish' ? 'Fin' : node.id,
        earliest: node.earliest,
        latest: node.latest,
        margin: node.margin,
        duration: node.duration,
        critical: node.is_critical,
        kind: node.kind,
      },
    }
  })

  const outgoing = new Map<string, typeof result.edges>()
  const incoming = new Map<string, typeof result.edges>()
  result.edges.forEach(edge => {
    outgoing.set(edge.source, [...(outgoing.get(edge.source) ?? []), edge])
    incoming.set(edge.target, [...(incoming.get(edge.target) ?? []), edge])
  })
  outgoing.forEach(edges => edges.sort((left, right) => layout.node(left.target).y - layout.node(right.target).y))
  incoming.forEach(edges => edges.sort((left, right) => layout.node(left.source).y - layout.node(right.source).y))

  const edges: Edge[] = result.edges.map((edge, index) => {
    const sourceEdges = outgoing.get(edge.source) ?? []
    const targetEdges = incoming.get(edge.target) ?? []
    const sourceIndex = sourceEdges.findIndex(item => item.source === edge.source && item.target === edge.target)
    const targetIndex = targetEdges.findIndex(item => item.source === edge.source && item.target === edge.target)
    return {
      id: `e-${index}`,
      source: edge.source,
      target: edge.target,
      sourceHandle: distributedHandle(sourceIndex, sourceEdges.length, 'out'),
      targetHandle: distributedHandle(targetIndex, targetEdges.length, 'in'),
      type: 'smoothstep',
      pathOptions: { borderRadius: 22, offset: 34 },
      label: String(edge.weight),
      animated: edge.is_critical,
      markerEnd: { type: MarkerType.ArrowClosed, width: 18, height: 18 },
      style: { stroke: edge.is_critical ? '#dc3030' : '#64748b', strokeWidth: edge.is_critical ? 2.6 : 1.6 },
      labelStyle: { fill: edge.is_critical ? '#b42318' : '#334155', fontWeight: 800 },
      labelBgStyle: { fill: '#ffffff', fillOpacity: 0.92 },
      labelBgPadding: [5, 3],
    }
  })

  return { nodes, edges, height: Math.max(540, (layout.graph().height ?? 420) + 80) }
}

export function MPMGraph({ result }: { result: MPMResult }) {
  const initialGraph = useMemo(() => createGraph(result), [result])
  const [nodes, setNodes, onNodesChange] = useNodesState(initialGraph.nodes)
  const [locked, setLocked] = useState(true)

  const resetLayout = () => {
    setNodes(initialGraph.nodes)
    setLocked(true)
  }

  return <div className="graph-shell">
    <div className="graph-actions" aria-label="Disposition du graphe">
      <div className={`graph-lock-state ${locked ? 'locked' : 'editable'}`}>
        <span aria-hidden="true">●</span>
        <div><strong>{locked ? 'Disposition verrouillée' : 'Mode déplacement actif'}</strong><small>{locked ? 'Les sommets ne peuvent pas bouger.' : 'Faites glisser les sommets, puis verrouillez.'}</small></div>
      </div>
      <div>
        <button className="graph-reset" type="button" onClick={resetLayout}>Réinitialiser</button>
        <button className={`graph-lock ${locked ? '' : 'active'}`} type="button" aria-pressed={!locked} onClick={() => setLocked(value => !value)}>
          <span aria-hidden="true">{locked ? '↗' : '⌁'}</span>{locked ? 'Modifier la disposition' : 'Verrouiller la disposition'}
        </button>
      </div>
    </div>
    <div className={`graph ${locked ? 'is-locked' : 'is-editable'}`} style={{ height: initialGraph.height }}>
      <ReactFlow
        nodes={nodes}
        edges={initialGraph.edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        nodesDraggable={!locked}
        nodesConnectable={false}
        nodesFocusable={!locked}
        elementsSelectable={!locked}
        fitView
        fitViewOptions={{ padding: 0.16 }}
        minZoom={0.2}
      >
        <Background gap={20} size={1}/>
        <Controls showInteractive={false}/>
      </ReactFlow>
    </div>
  </div>
}
