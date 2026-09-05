import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

vi.mock('./services/api', () => ({
  analyze: vi.fn(),
  login: vi.fn(),
  register: vi.fn(),
  getMe: vi.fn().mockResolvedValue({ id: 1, full_name: 'Ada Lovelace', email: 'ada@example.com' }),
}))

describe('Application MPM', () => {
  beforeEach(() => localStorage.clear())
  afterEach(cleanup)

  it('présente une page d’accueil professionnelle', () => {
    render(<MemoryRouter initialEntries={['/']}><App /></MemoryRouter>)
    expect(screen.getByRole('heading', { name: /Du tableau des tâches à un projet/i })).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /Créer un compte/i })[0]).toHaveAttribute('href', '/inscription')
  })

  it('présente le formulaire de connexion', () => {
    render(<MemoryRouter initialEntries={['/connexion']}><App /></MemoryRouter>)
    expect(screen.getByRole('heading', { name: /Se connecter/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Se connecter/i })).toBeEnabled()
    const password = screen.getByLabelText('Mot de passe')
    expect(password).toHaveAttribute('type', 'password')
    fireEvent.click(screen.getByRole('button', { name: /Afficher le mot de passe/i }))
    expect(password).toHaveAttribute('type', 'text')
    expect(screen.getByRole('button', { name: /Masquer le mot de passe/i })).toBeInTheDocument()
  })

  it('affiche clairement le compte connecté dans l’espace protégé', async () => {
    localStorage.setItem('mpm_token', 'jeton-test')
    render(<MemoryRouter initialEntries={['/app']}><App /></MemoryRouter>)
    expect(await screen.findByText('Ada Lovelace')).toBeInTheDocument()
    expect(screen.getByText('ada@example.com')).toBeInTheDocument()
    expect(screen.getByText('Connecté')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /Ajouter une tâche/i })).toHaveLength(2)
  })

  it('ferme le menu du compte après un clic en dehors', async () => {
    localStorage.setItem('mpm_token', 'jeton-test')
    render(<MemoryRouter initialEntries={['/app']}><App /></MemoryRouter>)
    const account = await screen.findByRole('button', { name: /Ada Lovelace/i })
    fireEvent.click(account)
    expect(screen.getByRole('menu')).toBeInTheDocument()
    fireEvent.pointerDown(document.body)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })
})
