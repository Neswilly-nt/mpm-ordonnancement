import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { Brand } from './Brand'

export function AppHeader() {
  const { user, signOut } = useAuth()
  const notify = useToast()
  const [open, setOpen] = useState(false)
  const accountRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!open) return
    const closeOutside = (event: PointerEvent) => {
      if (!accountRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', closeOutside)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOutside)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [open])

  if (!user) return null
  const initials = user.full_name.split(' ').slice(0, 2).map(x => x[0]).join('').toUpperCase()
  const logout = () => {
    setOpen(false)
    signOut()
    notify('Vous êtes déconnecté.', 'info')
    navigate('/')
  }

  return <nav className="app-nav"><Brand/><div className="nav-actions" ref={accountRef}><span className="connected"><i/>Connecté</span><button className="account-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-haspopup="menu"><span className="avatar">{initials}</span><span className="account-copy"><strong>{user.full_name}</strong><small>{user.email}</small></span><span className={`account-chevron ${open ? 'open' : ''}`}>⌄</span></button>{open && <div className="account-menu" role="menu"><div><strong>{user.full_name}</strong><small>{user.email}</small></div><button onClick={logout} role="menuitem">Se déconnecter</button></div>}</div></nav>
}
