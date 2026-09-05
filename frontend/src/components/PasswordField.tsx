import { useState } from 'react'

function EyeIcon({ crossed }: { crossed: boolean }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
    <circle cx="12" cy="12" r="2.8" />
    {crossed && <path d="m4 4 16 16" />}
  </svg>
}

type Props = {
  label: string
  value: string
  onChange: (value: string) => void
  autoComplete: string
  placeholder?: string
}

export function PasswordField({ label, value, onChange, autoComplete, placeholder = '8 caractères minimum' }: Props) {
  const [visible, setVisible] = useState(false)
  return <label>{label}<span className="password-field"><input value={value} onChange={event => onChange(event.target.value)} type={visible ? 'text' : 'password'} minLength={8} required autoComplete={autoComplete} placeholder={placeholder}/><button type="button" className="password-toggle" onClick={() => setVisible(current => !current)} aria-label={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'} title={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}><EyeIcon crossed={!visible}/></button></span></label>
}
