import { Handle, Position, type Node, type NodeProps } from '@xyflow/react'

type Data = { label: string; earliest: number; latest: number; margin: number; duration: number; critical: boolean; kind: string }
type MPMNodeType = Node<Data, 'mpm'>
const handleOffsets = ['32%', '50%', '68%']

export function MPMNode({ data: d }: NodeProps<MPMNodeType>) {
  return <div className={`node-frame ${d.kind}`}>
    {d.kind === 'task' && <div className={`margin-badge ${d.critical ? 'zero' : ''}`}>MT {d.margin}</div>}
    <div className={`mpm-node ${d.critical ? 'critical' : ''} ${d.kind}`}>
      {handleOffsets.map((top, index) => <Handle key={`in-${index}`} id={`in-${index}`} type="target" position={Position.Left} style={{ top }}/>) }
      <div className="dates"><span title="Début au plus tôt">{d.earliest}</span><span title="Début au plus tard">{d.latest}</span></div>
      <strong>{d.label}</strong>
      {d.kind === 'task' && <small>durée {d.duration}</small>}
      {handleOffsets.map((top, index) => <Handle key={`out-${index}`} id={`out-${index}`} type="source" position={Position.Right} style={{ top }}/>) }
    </div>
    {d.kind !== 'task' && <small className="terminal-label">Sommet {d.kind === 'start' ? 'initial' : 'final'}</small>}
  </div>
}
