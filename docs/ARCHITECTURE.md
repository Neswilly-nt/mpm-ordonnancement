# Architecture technique

## Principe directeur

Le domaine MPM est isolé dans `backend/app/services/mpm.py`. Il reçoit des tâches et dépendances, valide le graphe orienté acyclique, puis exécute les passes avant et arrière. Aucun calcul CPM/PERT n'est utilisé.

## Flux

1. React recueille Tâche, Durée et T.ant.
2. Axios envoie `POST /api/v1/mpm/analyze`.
3. Pydantic valide la forme des données.
4. NetworkX valide et ordonne topologiquement le graphe.
5. Le service calcule tôt, tard, marges et chemins critiques.
6. React Flow dessine les sommets-tâches et arcs-contraintes.

## Structure

```text
backend/app/
├── api/routes.py          # contrat HTTP
├── core/                  # configuration et SQLAlchemy
├── models/project.py      # Project, Task, relations de précédence
├── schemas/mpm.py         # entrées/sorties Pydantic
└── services/mpm.py        # algorithme MPM pur
frontend/src/
├── components/            # ronde MPM et graphe React Flow
├── services/api.ts        # client Axios
├── types/mpm.ts           # contrat TypeScript
└── App.tsx                # saisie, tableau et résultats
```

## Règles de calcul

- Arc `i → j` : `j` dépend de `i`; poids visuel = durée de `i`.
- Date tôt de `j` : maximum des `date_tôt(i) + durée(i)`.
- Date tard de `i` : minimum des `date_tard(j) - durée(i)`.
- Marge totale : `date_tard(i) - date_tôt(i)`.
- Marge libre : minimum des `date_tôt(j) - date_tôt(i) - durée(i)`.
- Tâche critique : marge totale nulle.

Les sommets Début et Fin sont artificiels, de durée nulle. Plusieurs sources, puits et chemins critiques sont supportés.

