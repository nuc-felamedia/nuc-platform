// frontend/src/app/admin/layout.tsx
// This file automatically wraps ALL pages under /admin/* with the sidebar
// No changes needed to individual admin pages

'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  BarChart2, Building2, BookOpen, FileText,
  Users, Settings, LogOut, ExternalLink,
  UserCircle, FolderOpen,
} from 'lucide-react'
import { useAuthStore } from '@/lib/store'
import { cn } from '@/lib/utils'

const NAV = [
  { label: 'Dashboard',    icon: BarChart2,  href: '/admin' },
  { label: 'Universities', icon: Building2,  href: '/admin/universities' },
  { label: 'Programs',     icon: BookOpen,   href: '/admin/programs' },
  { label: 'Accreditation',icon: FileText,   href: '/admin/accreditation' },
  { label: 'Directorates', icon: FolderOpen, href: '/admin/directorates' },
  { label: 'Posts',        icon: FileText,   href: '/admin/posts' },
  { label: 'Users',        icon: Users,      href: '/admin/users' },
  { label: 'Settings',     icon: Settings,   href: '/admin/settings' },
]

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuthStore()

  useEffect(() => {
    if (user && !['NUC_STAFF', 'SUPER_ADMIN'].includes(user.role)) {
      router.replace('/dashboard')
    }
  }, [user, router])

  const handleLogout = () => { logout(); router.push('/') }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar — desktop */}
      <aside className="w-56 bg-white border-r border-gray-100 hidden lg:flex flex-col fixed top-0 left-0 h-screen z-40">
        <div className="p-5 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs font-display">N</span>
            </div>
            <span className="font-display font-bold text-gray-900 text-sm">NUC Admin</span>
          </Link>
        </div>

        {user && (
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-xs font-bold shrink-0">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-gray-800 truncate">{user.firstName} {user.lastName}</div>
                <div className="text-xs text-gray-400 truncate">{user.role?.replace(/_/g, ' ')}</div>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {NAV.map(({ label, icon: Icon, href }) => {
            const isActive = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
            return (
              <Link key={href} href={href}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}>
                <Icon size={16} className={isActive ? 'text-brand-600' : 'text-gray-400'} />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="p-3 border-t border-gray-100 space-y-0.5">
          <Link href="/profile/setup"
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
            <UserCircle size={15} /> My profile
          </Link>
          <Link href="/"
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
            <ExternalLink size={15} /> View site
          </Link>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
            <LogOut size={15} /> Sign out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-100 px-4 h-14 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
            <span className="text-white font-bold text-xs">N</span>
          </div>
          <span className="font-bold text-sm text-gray-900">NUC Admin</span>
        </Link>
        <button onClick={handleLogout} className="text-xs text-red-500 px-3 py-1.5 rounded-lg border border-red-200">
          Sign out
        </button>
      </div>

      {/* Mobile bottom nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 flex justify-around py-1.5">
        {NAV.slice(0, 5).map(({ icon: Icon, href, label }) => {
          const isActive = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
          return (
            <Link key={href} href={href}
              className={cn('flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg', isActive ? 'text-brand-600' : 'text-gray-400')}>
              <Icon size={18} />
              <span className="text-xs">{label.split(' ')[0]}</span>
            </Link>
          )
        })}
      </div>

      {/* Main content */}
      <main className="flex-1 min-w-0 lg:ml-56 mt-14 lg:mt-0 mb-16 lg:mb-0">
        {children}
      </main>
    </div>
  )
}
