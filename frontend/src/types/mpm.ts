export type TaskInput = { id: string; duration: number; predecessors: string[] }
export type TaskResult = TaskInput & { successors: string[]; earliest_start: number; earliest_finish: number; latest_start: number; latest_finish: number; total_float: number; free_float: number; is_critical: boolean }
export type GraphNode = { id: string; kind: 'start' | 'task' | 'finish'; earliest: number; latest: number; margin: number; duration: number; is_critical: boolean; level: number }
export type GraphEdge = { source: string; target: string; weight: number; is_critical: boolean }
export type MPMResult = { project_duration: number; tasks: TaskResult[]; nodes: GraphNode[]; edges: GraphEdge[]; critical_tasks: string[]; critical_paths: string[][] }

