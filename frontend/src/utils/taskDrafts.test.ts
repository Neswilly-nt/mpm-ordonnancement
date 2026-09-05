import { describe, expect, it } from 'vitest'
import { toTaskInputs } from './taskDrafts'

describe('conversion des données MPM', () => {
  it('accepte trois antécédents séparés par virgules ou points-virgules', () => {
    expect(toTaskInputs([{ id: 'D', duration: '12', predecessors: 'A, B; C' }])[0]).toEqual({
      id: 'D', duration: 12, predecessors: ['A', 'B', 'C'],
    })
  })

  it('refuse une durée laissée vide au lieu de la transformer en zéro', () => {
    expect(() => toTaskInputs([{ id: 'A', duration: '', predecessors: '' }])).toThrow(/durée/i)
  })

  it('accepte une durée décimale saisie avec une virgule', () => {
    expect(toTaskInputs([{ id: 'A', duration: '2,5', predecessors: '' }])[0].duration).toBe(2.5)
  })
})
