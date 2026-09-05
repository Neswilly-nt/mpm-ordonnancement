import networkx as nx

from app.schemas.mpm import GraphEdge, GraphNode, MPMRequest, MPMResponse, TaskResult


EPSILON = 1e-9


class MPMValidationError(ValueError):
    pass


def analyze_mpm(payload: MPMRequest) -> MPMResponse:
    ids = [task.id for task in payload.tasks]
    if len(ids) != len(set(ids)):
        raise MPMValidationError("Les identifiants de tâches doivent être uniques.")
    known = set(ids)
    durations = {task.id: task.duration for task in payload.tasks}
    predecessors = {task.id: list(dict.fromkeys(task.predecessors)) for task in payload.tasks}
    for task_id, preds in predecessors.items():
        unknown = set(preds) - known
        if unknown:
            raise MPMValidationError(f"Antécédent(s) inconnu(s) pour {task_id}: {', '.join(sorted(unknown))}.")
        if task_id in preds:
            raise MPMValidationError(f"La tâche {task_id} ne peut pas se précéder elle-même.")

    graph = nx.DiGraph()
    graph.add_nodes_from(ids)
    for target, preds in predecessors.items():
        graph.add_edges_from((source, target) for source in preds)
    if not nx.is_directed_acyclic_graph(graph):
        cycle = nx.find_cycle(graph)
        raise MPMValidationError("Cycle détecté: " + " → ".join(edge[0] for edge in cycle) + f" → {cycle[0][0]}.")

    order = list(nx.lexicographical_topological_sort(graph, key=str))
    successors = {task_id: sorted(graph.successors(task_id)) for task_id in ids}
    earliest: dict[str, float] = {}
    levels: dict[str, int] = {}
    for task_id in order:
        preds = predecessors[task_id]
        earliest[task_id] = max((earliest[p] + durations[p] for p in preds), default=0.0)
        levels[task_id] = max((levels[p] + 1 for p in preds), default=1)
    project_duration = max(earliest[t] + durations[t] for t in ids)

    latest: dict[str, float] = {}
    for task_id in reversed(order):
        succs = successors[task_id]
        latest[task_id] = min((latest[s] - durations[task_id] for s in succs), default=project_duration - durations[task_id])

    total_float = {t: latest[t] - earliest[t] for t in ids}
    free_float = {
        t: min((earliest[s] - earliest[t] - durations[t] for s in successors[t]), default=project_duration - earliest[t] - durations[t])
        for t in ids
    }
    critical = {t for t in ids if abs(total_float[t]) < EPSILON}

    augmented = nx.DiGraph()
    augmented.add_nodes_from(["__start__", *ids, "__finish__"])
    sources = [t for t in ids if not predecessors[t]]
    sinks = [t for t in ids if not successors[t]]
    augmented.add_edges_from(("__start__", t) for t in sources)
    augmented.add_edges_from(graph.edges)
    augmented.add_edges_from((t, "__finish__") for t in sinks)

    def critical_edge(source: str, target: str) -> bool:
        if source == "__start__":
            return target in critical and abs(earliest[target]) < EPSILON
        if target == "__finish__":
            return source in critical and abs(earliest[source] + durations[source] - project_duration) < EPSILON
        return source in critical and target in critical and abs(earliest[source] + durations[source] - earliest[target]) < EPSILON

    critical_graph = nx.DiGraph((u, v) for u, v in augmented.edges if critical_edge(u, v))
    paths = [path[1:-1] for path in nx.all_simple_paths(critical_graph, "__start__", "__finish__")]

    node_results = [GraphNode(id="__start__", kind="start", earliest=0, latest=0, margin=0, duration=0, is_critical=True, level=0)]
    node_results += [GraphNode(id=t, kind="task", earliest=earliest[t], latest=latest[t], margin=total_float[t], duration=durations[t], is_critical=t in critical, level=levels[t]) for t in order]
    node_results.append(GraphNode(id="__finish__", kind="finish", earliest=project_duration, latest=project_duration, margin=0, duration=0, is_critical=True, level=max(levels.values()) + 1))

    edge_results = []
    for source, target in augmented.edges:
        weight = 0 if source == "__start__" else durations[source]
        edge_results.append(GraphEdge(source=source, target=target, weight=weight, is_critical=critical_edge(source, target)))

    task_results = [TaskResult(id=t, duration=durations[t], predecessors=sorted(predecessors[t]), successors=successors[t], earliest_start=earliest[t], earliest_finish=earliest[t] + durations[t], latest_start=latest[t], latest_finish=latest[t] + durations[t], total_float=total_float[t], free_float=free_float[t], is_critical=t in critical) for t in order]
    return MPMResponse(project_duration=project_duration, tasks=task_results, nodes=node_results, edges=edge_results, critical_tasks=[t for t in order if t in critical], critical_paths=paths)
