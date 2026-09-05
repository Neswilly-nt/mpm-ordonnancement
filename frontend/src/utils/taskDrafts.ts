import type { TaskInput } from '../types/mpm'

export type TaskDraft = { id: string; duration: string; predecessors: string }

export function toTaskInputs(tasks: TaskDraft[]): TaskInput[] {
  return tasks.map((task, index) => {
    const id = task.id.trim()
    const duration = Number(task.duration.replace(',', '.'))
    if (!id) throw new Error(`Le nom de la tâche ${index + 1} est obligatoire.`)
    if (task.duration.trim() === '' || !Number.isFinite(duration) || duration < 0) {
      throw new Error(`La durée de la tâche ${id} doit être un nombre positif ou nul.`)
    }
    return {
      id,
      duration,
      predecessors: task.predecessors.split(/[,;]/).map(value => value.trim()).filter(Boolean),
    }
  })
}
