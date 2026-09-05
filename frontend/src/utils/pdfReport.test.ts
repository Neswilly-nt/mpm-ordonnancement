import { describe, expect, it } from 'vitest'
import type { MPMResult } from '../types/mpm'
import { createAnalysisPdf } from './pdfReport'

const result: MPMResult = {
  project_duration: 12,
  critical_tasks: ['A', 'B'],
  critical_paths: [['A', 'B']],
  tasks: [
    { id: 'A', duration: 5, predecessors: [], successors: ['B'], earliest_start: 0, earliest_finish: 5, latest_start: 0, latest_finish: 5, total_float: 0, free_float: 0, is_critical: true },
    { id: 'B', duration: 7, predecessors: ['A'], successors: [], earliest_start: 5, earliest_finish: 12, latest_start: 5, latest_finish: 12, total_float: 0, free_float: 0, is_critical: true },
  ],
  nodes: [],
  edges: [],
}

describe('rapport PDF', () => {
  it('génère un vrai document PDF téléchargeable', async () => {
    const pdf = createAnalysisPdf(result)
    expect(pdf.type).toBe('application/pdf')
    expect(pdf.size).toBeGreaterThan(1000)
    const header = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(new TextDecoder().decode(reader.result as ArrayBuffer))
      reader.onerror = () => reject(reader.error)
      reader.readAsArrayBuffer(pdf.slice(0, 8))
    })
    expect(header).toBe('%PDF-1.4')
  })
})
