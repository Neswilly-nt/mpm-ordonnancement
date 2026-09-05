/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

type ToastKind = 'success' | 'error' | 'info'
type Toast = { id: number; message: string; kind: ToastKind }
const ToastContext = createContext<(message: string, kind?: ToastKind) => void>(() => undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const notify = useCallback((message: string, kind: ToastKind = 'info') => {
    const id = Date.now()
    setToasts(items => [...items, { id, message, kind }])
    window.setTimeout(() => setToasts(items => items.filter(item => item.id !== id)), 4200)
  }, [])
  return <ToastContext.Provider value={notify}>{children}<div className="toast-stack" aria-live="polite">{toasts.map(t => <div key={t.id} className={`toast ${t.kind}`}><span>{t.kind === 'success' ? '✓' : t.kind === 'error' ? '!' : 'i'}</span>{t.message}</div>)}</div></ToastContext.Provider>
}

export const useToast = () => useContext(ToastContext)
