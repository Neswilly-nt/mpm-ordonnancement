from uuid import uuid4

from fastapi.testclient import TestClient

from app.main import app


def test_register_login_and_me():
    client = TestClient(app)
    email = f"test-{uuid4().hex}@example.com"
    registered = client.post("/api/v1/auth/register", json={"full_name": "Ada Lovelace", "email": email, "password": "motdepasse-solide"})
    assert registered.status_code == 201
    token = registered.json()["access_token"]
    me = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me.status_code == 200
    assert me.json()["email"] == email
    logged = client.post("/api/v1/auth/login", json={"email": email, "password": "motdepasse-solide"})
    assert logged.status_code == 200
    refused = client.post("/api/v1/auth/login", json={"email": email, "password": "motdepasse-incorrect"})
    assert refused.status_code == 401
    assert refused.json()["detail"] == "Adresse email ou mot de passe incorrect."


def test_me_requires_authentication():
    assert TestClient(app).get("/api/v1/auth/me").status_code == 401
