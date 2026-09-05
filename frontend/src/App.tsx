import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { ScrollToTopButton } from './components/ScrollToTopButton'
import { AuthPage } from './pages/AuthPage'
import { LandingPage } from './pages/LandingPage'
import './styles.css'
import './enhancements.css'

const DashboardPage = lazy(() => import('./pages/DashboardPage').then(module => ({ default: module.DashboardPage })))

function ProtectedRoute() {
  const { user, loading } = useAuth()
  if (loading) return <div className="app-loader"><span/><p>Chargement de votre espace…</p></div>
  return user ? <DashboardPage/> : <Navigate to="/connexion" replace/>
}

export default function App() {
  return <ToastProvider><AuthProvider><Suspense fallback={<div className="app-loader"><span/><p>Chargement de votre espace…</p></div>}><Routes><Route path="/" element={<LandingPage/>}/><Route path="/connexion" element={<AuthPage mode="login"/>}/><Route path="/inscription" element={<AuthPage mode="register"/>}/><Route path="/app" element={<ProtectedRoute/>}/><Route path="*" element={<Navigate to="/" replace/>}/></Routes></Suspense><ScrollToTopButton/></AuthProvider></ToastProvider>
}
