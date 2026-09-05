import '@testing-library/jest-dom/vitest'
import { configure } from '@testing-library/react'

// Le chargement différé de l'espace d'analyse peut dépasser une seconde
// dans Docker Desktop sur Windows. Ce délai évite un échec de test aléatoire.
configure({ asyncUtilTimeout: 5000 })
