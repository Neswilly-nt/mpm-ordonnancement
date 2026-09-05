import axios from 'axios'
import type { MPMResult, TaskInput } from '../types/mpm'
import type { AuthResponse, User } from '../types/auth'
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1', timeout: 10000 })
api.interceptors.request.use(config => {
  const token = localStorage.getItem('mpm_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
api.interceptors.response.use(response => response, error => {
  if (axios.isAxiosError(error) && error.response?.status === 401) {
    localStorage.removeItem('mpm_token')
    window.dispatchEvent(new Event('mpm-auth-expired'))
  }
  return Promise.reject(error)
})
export async function analyze(tasks: TaskInput[]): Promise<MPMResult> { return (await api.post<MPMResult>('/mpm/analyze', { tasks })).data }
export async function register(full_name: string, email: string, password: string): Promise<AuthResponse> { return (await api.post<AuthResponse>('/auth/register', { full_name, email, password })).data }
export async function login(email: string, password: string): Promise<AuthResponse> { return (await api.post<AuthResponse>('/auth/login', { email, password })).data }
export async function getMe(): Promise<User> { return (await api.get<User>('/auth/me')).data }
