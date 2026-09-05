# API MPM

## `GET /api/v1/health`

Retourne l'état de l'API et confirme la méthode `MPM`.

## `POST /api/v1/mpm/analyze`

Requête :

```json
{"tasks":[{"id":"A","duration":3,"predecessors":[]},{"id":"B","duration":2,"predecessors":["A"]}]}
```

La réponse contient la durée minimale, le tableau complet des tâches, les nœuds et arcs prêts pour React Flow, les tâches critiques et tous les chemins critiques.

Erreurs `422` : identifiant dupliqué, antécédent inconnu, auto-dépendance ou cycle.

