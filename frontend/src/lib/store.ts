// src/lib/store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types'
import { authApi } from './api'

interface AuthStore {
  user: User | null
  accessToken: string | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  fetchMe: () => Promise<void>
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isLoading: false,

      setUser: (user) => set({ user }),
      setToken: (accessToken) => {
        set({ accessToken })
        if (accessToken) localStorage.setItem('accessToken', accessToken)
        else localStorage.removeItem('accessToken')
      },

      login: async (email, password) => {
        set({ isLoading: true })
        try {
          const { data } = await authApi.login(email, password)
          set({ user: data.data.user, accessToken: data.data.accessToken })
          localStorage.setItem('accessToken', data.data.accessToken)
        } finally {
          set({ isLoading: false })
        }
      },

      logout: async () => {
        try { await authApi.logout() } catch {}
        localStorage.removeItem('accessToken')
        set({ user: null, accessToken: null })
      },

      fetchMe: async () => {
        try {
          const { data } = await authApi.getMe()
          set({ user: data.data })
        } catch {
          set({ user: null, accessToken: null })
          localStorage.removeItem('accessToken')
        }
      },
    }),
    {
      name: 'nuc-auth',
      partialize: (state) => ({ accessToken: state.accessToken }),
    }
  )
)
