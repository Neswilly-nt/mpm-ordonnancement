import pytest
from uuid import uuid4
from fastapi.testclient import TestClient

from app.main import app
from app.schemas.mpm import MPMRequest
from app.services.mpm import MPMValidationError, analyze_mpm


def test_course_style_network_dates_margins_and_critical_path():
    result = analyze_mpm(MPMRequest(tasks=[
        {"id": "a", "duration": 7, "predecessors": []},
        {"id": "b", "duration": 7, "predecessors": ["a"]},
        {"id": "c", "duration": 15, "predecessors": ["b"]},
        {"id": "d", "duration": 30, "predecessors": ["c"]},
        {"id": "e", "duration": 45, "predecessors": ["d"]},
        {"id": "g", "duration": 45, "predecessors": ["d"]},
    ]))
    by_id = {task.id: task for task in result.tasks}
    assert result.project_duration == 104
    assert by_id["e"].earliest_start == 59
    assert by_id["e"].total_float == 0
    assert by_id["g"].total_float == 0
    assert result.critical_paths == [["a", "b", "c", "d", "e"], ["a", "b", "c", "d", "g"]]


def test_parallel_tasks_and_free_float():
    result = analyze_mpm(MPMRequest(tasks=[
        {"id": "A", "duration": 3},
        {"id": "B", "duration": 2},
        {"id": "C", "duration": 4, "predecessors": ["A", "B"]},
    ]))
    by_id = {task.id: task for task in result.tasks}
    assert result.project_duration == 7
    assert by_id["B"].total_float == 1
    assert by_id["B"].free_float == 1
    assert result.critical_paths == [["A", "C"]]


def test_cycle_is_rejected():
    with pytest.raises(MPMValidationError, match="Cycle"):
        analyze_mpm(MPMRequest(tasks=[
            {"id": "A", "duration": 1, "predecessors": ["B"]},
            {"id": "B", "duration": 1, "predecessors": ["A"]},
        ]))


def test_api_health_and_analysis():
    client = TestClient(app)
    assert client.get("/api/v1/health").json()["method"] == "MPM"
    email = f"mpm-{uuid4().hex}@example.com"
    registered = client.post("/api/v1/auth/register", json={"full_name": "Test MPM", "email": email, "password": "motdepasse-solide"})
    token = registered.json()["access_token"]
    response = client.post(
        "/api/v1/mpm/analyze",
        json={"tasks": [{"id": "A", "duration": 2}]},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    assert response.json()["project_duration"] == 2


def test_analysis_requires_authentication():
    response = TestClient(app).post("/api/v1/mpm/analyze", json={"tasks": [{"id": "A", "duration": 2}]})
    assert response.status_code == 401
