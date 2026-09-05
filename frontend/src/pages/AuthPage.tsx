import { useState, type FormEvent } from 'react'
import axios from 'axios'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Brand } from '../components/Brand'
import { PasswordField } from '../components/PasswordField'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export function AuthPage({ mode }: { mode: 'login' | 'register' }) {
  const { user, signIn, signUp } = useAuth()
  const notify = useToast()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [busy, setBusy] = useState(false)
  if (user) return <Navigate to="/app" replace/>

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (mode === 'register' && password !== confirm) { notify('Les mots de passe ne correspondent pas.', 'error'); return }
    setBusy(true)
    try {
      if (mode === 'login') await signIn(email, password)
      else await signUp(name, email, password)
      notify(mode === 'login' ? 'Connexion réussie.' : 'Compte créé avec succès.', 'success')
      navigate('/app')
    } catch (error) {
      notify(axios.isAxiosError(error) ? error.response?.data?.detail ?? 'Connexion impossible.' : 'Une erreur est survenue.', 'error')
    } finally { setBusy(false) }
  }

  return <div className="auth-page"><div className="auth-aside"><Brand/><div><span className="kicker light">Espace sécurisé</span><h1>{mode === 'login' ? 'Retrouvez vos analyses MPM.' : 'Créez votre espace de travail.'}</h1><p>Une application claire, rigoureuse et conçue pour présenter vos résultats d’ordonnancement.</p><div className="auth-benefits"><span>Calcul MPM automatisé</span><span>Résultats prêts à imprimer</span><span>Compte protégé</span></div></div><small>Sommet = tâche · Arc = contrainte</small></div><main className="auth-main"><form className="auth-card" onSubmit={submit}><Link to="/" className="back-link">← Retour à l’accueil</Link><h2>{mode === 'login' ? 'Se connecter' : 'Créer un compte'}</h2><p>{mode === 'login' ? 'Entrez vos identifiants pour continuer.' : 'Renseignez vos informations personnelles.'}</p>{mode === 'register' && <label>Nom complet<input value={name} onChange={event => setName(event.target.value)} minLength={2} required autoComplete="name" placeholder="Votre nom"/></label>}<label>Adresse email<input value={email} onChange={event => setEmail(event.target.value)} type="email" required autoComplete="email" placeholder="nom@exemple.com"/></label><PasswordField label="Mot de passe" value={password} onChange={setPassword} autoComplete={mode === 'login' ? 'current-password' : 'new-password'}/>{mode === 'register' && <PasswordField label="Confirmer le mot de passe" value={confirm} onChange={setConfirm} autoComplete="new-password" placeholder="Répétez le mot de passe"/>}<button className="button full" disabled={busy}>{busy ? 'Veuillez patienter…' : mode === 'login' ? 'Se connecter' : 'Créer mon compte'}</button><p className="auth-switch">{mode === 'login' ? 'Pas encore de compte ?' : 'Vous avez déjà un compte ?'} <Link to={mode === 'login' ? '/inscription' : '/connexion'}>{mode === 'login' ? 'S’inscrire' : 'Se connecter'}</Link></p></form></main></div>
}
