import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { MPMResult } from '../types/mpm'
import { MPMGraph } from './MPMGraph'

vi.mock('@xyflow/react', () => ({
  Background: () => null,
  Controls: () => <div data-testid="zoom-controls"/>,
  MarkerType: { ArrowClosed: 'arrowclosed' },
  ReactFlow: ({ nodesDraggable, children }: { nodesDraggable: boolean; children: React.ReactNode }) => <div data-testid="react-flow" data-draggable={String(nodesDraggable)}>{children}</div>,
  useNodesState: <T,>(initial: T[]) => [initial, vi.fn(), vi.fn()],
}))

vi.mock('./MPMNode', () => ({ MPMNode: () => null }))

const result: MPMResult = {
  project_duration: 5,
  critical_tasks: ['A'],
  critical_paths: [['A']],
  tasks: [],
  nodes: [
    { id: 'start', kind: 'start', earliest: 0, latest: 0, margin: 0, duration: 0, is_critical: true, level: 0 },
    { id: 'A', kind: 'task', earliest: 0, latest: 0, margin: 0, duration: 5, is_critical: true, level: 1 },
    { id: 'finish', kind: 'finish', earliest: 5, latest: 5, margin: 0, duration: 0, is_critical: true, level: 2 },
  ],
  edges: [
    { source: 'start', target: 'A', weight: 0, is_critical: true },
    { source: 'A', target: 'finish', weight: 5, is_critical: true },
  ],
}

describe('verrouillage du graphe', () => {
  it('est verrouillé par défaut puis autorise le déplacement', () => {
    render(<MPMGraph result={result}/>)
    expect(screen.getByTestId('react-flow')).toHaveAttribute('data-draggable', 'false')
    fireEvent.click(screen.getByRole('button', { name: 'Modifier la disposition' }))
    expect(screen.getByTestId('react-flow')).toHaveAttribute('data-draggable', 'true')
    expect(screen.getByRole('button', { name: 'Verrouiller la disposition' })).toBeInTheDocument()
  })
})
