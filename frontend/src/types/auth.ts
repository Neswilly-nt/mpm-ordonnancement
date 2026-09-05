export type User = { id: number; full_name: string; email: string }
export type AuthResponse = { access_token: string; token_type: string; user: User }

