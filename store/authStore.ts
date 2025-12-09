import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, UserRole } from '@/types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  register: (email: string, password: string, name: string, phone: string, role?: UserRole) => Promise<{ success: boolean; error?: string }>
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; role?: UserRole }>
  logout: () => void
  hasRole: (role: UserRole) => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      register: async (email: string, password: string, name: string, phone: string, role: UserRole = 'user') => {
        try {
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, name, phone, role }),
          })

          const data = await response.json()

          if (data.success) {
            // Registration successful - user must login separately
            return { success: true }
          } else {
            return { success: false, error: data.error || 'Registration failed' }
          }
        } catch (error) {
          console.error('Registration error:', error)
          return { success: false, error: 'Registration failed. Please try again.' }
        }
      },

      login: async (email: string, password: string) => {
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          })

          const data = await response.json()

          if (data.success && data.user) {
            set({
              user: data.user as User,
              isAuthenticated: true,
            })
            return { success: true, role: data.role }
          } else {
            return { success: false, error: data.error || 'Login failed' }
          }
        } catch (error) {
          console.error('Login error:', error)
          return { success: false, error: 'Login failed. Please try again.' }
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
      },

      hasRole: (role: UserRole) => {
        const { user } = get()
        return user?.role === role
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)
