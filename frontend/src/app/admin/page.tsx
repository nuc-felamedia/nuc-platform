'use client'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { Building2, BookOpen, FileText, Plus } from 'lucide-react'
import { adminApi } from '@/lib/api'
import { PageLoader, Card } from '@/components/ui'
import { useAuthStore } from '@/lib/store'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { cn } from '@/lib/utils'

export default function AdminDashboard() {
  const { user } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (user && !['NUC_STAFF', 'SUPER_ADMIN'].includes(user.role)) {
      router.replace('/dashboard')
    }
  }, [user])

  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => adminApi.getDashboard(),
    select: (res) => res.data.data,
  })

  if (isLoading) return <PageLoader />

  const summary = data?.summary

  return (
    <div className="p-6 sm:p-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back, {user?.firstName}. Here's what's happening.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total universities',    value: summary?.totalUniversities,  color: 'text-blue-700',   href: '/admin/universities' },
          { label: 'Total programs',        value: summary?.totalPrograms,       color: 'text-green-700',  href: '/admin/programs' },
          { label: 'Accreditation records', value: summary?.totalAccreditations, color: 'text-purple-700', href: '/admin/accreditation' },
          { label: 'Users',                 value: summary?.totalUsers,          color: 'text-amber-700',  href: '/admin/users' },
        ].map(({ label, value, color, href }) => (
          <Link key={label} href={href} className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-brand-200 transition-colors">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{label}</p>
            <p className={cn('text-3xl font-bold font-display', color)}>{(value || 0).toLocaleString()}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick actions */}
        <Card className="p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Quick actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Add university',    href: '/admin/universities/new', icon: Building2 },
              { label: 'Add program',       href: '/admin/programs/new',     icon: BookOpen },
              { label: 'Add accreditation', href: '/admin/accreditation/new',icon: FileText },
              { label: 'Publish bulletin',  href: '/admin/posts/new',        icon: Plus },
            ].map(({ label, href, icon: Icon }) => (
              <Link key={label} href={href}
                className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 hover:bg-brand-50 hover:text-brand-700 transition-colors text-sm font-medium text-gray-700 border border-gray-100">
                <Icon size={15} /> {label}
              </Link>
            ))}
          </div>
        </Card>

        {/* Recent users */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Recent users</h2>
            <Link href="/admin/users" className="text-xs text-brand-600 hover:text-brand-700">View all →</Link>
          </div>
          <div className="space-y-3">
            {data?.recentUsers?.map((u: any) => (
              <div key={u.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-xs font-bold">
                    {u.firstName[0]}{u.lastName[0]}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-800">{u.firstName} {u.lastName}</div>
                    <div className="text-xs text-gray-400">{u.email}</div>
                  </div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{u.role}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Accreditation breakdown */}
        <Card className="p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Accreditation breakdown</h2>
          <div className="space-y-3">
            {data?.accreditationByStatus?.map((item: any) => {
              const total = data.accreditationByStatus.reduce((s: number, i: any) => s + i.count, 0)
              const pct = total > 0 ? Math.round((item.count / total) * 100) : 0
              const colors: Record<string, string> = { FULL: 'bg-green-400', INTERIM: 'bg-yellow-400', DENIED: 'bg-red-400', PENDING: 'bg-gray-300' }
              return (
                <div key={item.status}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-700 font-medium">{item.status}</span>
                    <span className="text-gray-500">{item.count.toLocaleString()} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={cn('h-full rounded-full', colors[item.status])} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Recent posts */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Recent posts</h2>
            <Link href="/admin/posts" className="text-xs text-brand-600 hover:text-brand-700">View all →</Link>
          </div>
          <div className="space-y-3">
            {data?.recentPosts?.map((post: any) => (
              <div key={post.id} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-gray-800 truncate">{post.title}</div>
                  <div className="text-xs text-gray-400">{post.type}</div>
                </div>
                <span className={cn('text-xs px-2 py-0.5 rounded-full shrink-0',
                  post.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600')}>
                  {post.status}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
