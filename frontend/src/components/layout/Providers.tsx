'use client'
// src/components/layout/Providers.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/lib/store'

function AuthInit() {
  const { accessToken, fetchMe } = useAuthStore()
  useEffect(() => {
    if (accessToken) fetchMe()
  }, [])
  return null
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      <AuthInit />
      {children}
    </QueryClientProvider>
  )
}
