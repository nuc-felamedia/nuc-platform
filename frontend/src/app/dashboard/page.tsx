'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'
import { PageLoader } from '@/components/ui'

export default function DashboardPage() {
  const { user } = useAuthStore()
  const router = useRouter()
  useEffect(() => {
    if (!user) { router.replace('/auth/login'); return }
    if (user.role === 'SUPER_ADMIN' || user.role === 'NUC_STAFF') {
      router.replace('/admin')
    } else {
      router.replace('/universities')
    }
  }, [user])
  return <PageLoader />
}
