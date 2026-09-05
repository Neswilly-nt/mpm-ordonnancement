from pydantic import BaseModel, Field, field_validator


class TaskInput(BaseModel):
    id: str = Field(min_length=1, max_length=80)
    duration: float = Field(ge=0)
    predecessors: list[str] = Field(default_factory=list)

    @field_validator("id")
    @classmethod
    def clean_id(cls, value: str) -> str:
        return value.strip()


class MPMRequest(BaseModel):
    tasks: list[TaskInput] = Field(min_length=1)


class TaskResult(BaseModel):
    id: str
    duration: float
    predecessors: list[str]
    successors: list[str]
    earliest_start: float
    earliest_finish: float
    latest_start: float
    latest_finish: float
    total_float: float
    free_float: float
    is_critical: bool


class GraphNode(BaseModel):
    id: str
    kind: str
    earliest: float
    latest: float
    margin: float
    duration: float
    is_critical: bool
    level: int


class GraphEdge(BaseModel):
    source: str
    target: str
    weight: float
    is_critical: bool


class MPMResponse(BaseModel):
    project_duration: float
    tasks: list[TaskResult]
    nodes: list[GraphNode]
    edges: list[GraphEdge]
    critical_tasks: list[str]
    critical_paths: list[list[str]]

