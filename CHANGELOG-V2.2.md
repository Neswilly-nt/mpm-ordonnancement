# MPM Pilot V2.2

## Landing page

- page enrichie avec navigation, indicateurs, fonctionnalités, présentation de la méthode, formules et appel à l’action ;
- titre dynamique alternant « maîtrisé », « visualisé », « optimisé » et « présentable » ;
- animation du réseau MPM, des flux, des sommets et de l’arrière-plan ;
- prise en charge de `prefers-reduced-motion` ;
- bouton flottant de retour en haut.

## Authentification

- bouton œil barré lorsque le mot de passe est masqué ;
- bouton œil ouvert lorsque le mot de passe est visible ;
- comportement disponible pour connexion, mot de passe et confirmation d’inscription.

## Espace d’analyse

- suppression de « Conforme au cours » ;
- bouton d’ajout de tâche en haut et en bas du formulaire ;
- défilement automatique vers la nouvelle tâche ;
- compte connecté mieux cadré avec nom et email tronqués proprement si nécessaire.

## Tableau et graphe

- tâches critiques signalées en doré avec badge, sans coloration rouge assimilable à une erreur ;
- tâches non critiques conservées en présentation neutre ;
- disposition hiérarchique Dagre de gauche à droite ;
- espacement renforcé entre les branches ;
- arcs orthogonaux arrondis ;
- trois points d’entrée et de sortie invisibles par sommet pour réduire les chevauchements ;
- tri des connexions selon la position verticale des tâches.

## Vérifications

- 7 tests backend ;
- 6 tests frontend ;
- build TypeScript/Vite ;
- ESLint, Ruff et MyPy.
