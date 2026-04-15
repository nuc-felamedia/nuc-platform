'use client'
// src/components/layout/Navbar.tsx
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, Search, ChevronDown, LogIn, LayoutDashboard } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/lib/store'

const NAV_LINKS = [
  { label: 'Universities', href: '/universities' },
  {
    label: 'Accreditation',
    href: '/accreditation',
    children: [
      { label: 'Search results', href: '/accreditation' },
      { label: 'Undergraduate', href: '/accreditation?type=undergraduate' },
      { label: 'Postgraduate', href: '/accreditation?type=postgraduate' },
      { label: 'Verify a program', href: '/accreditation/verify' },
    ],
  },
  { label: 'Directorates', href: '/directorates' },
  { label: 'Bulletins', href: '/bulletins' },
  { label: 'About', href: '/about' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const { user, logout } = useAuthStore()

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm font-display">N</span>
            </div>
            <div className="hidden sm:block">
              <div className="font-display font-bold text-gray-900 text-sm leading-tight">
                NUC <span className="text-brand-600">Platform</span>
              </div>
              <div className="text-xs text-gray-400">National Universities Commission</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={() => link.children && setOpenDropdown(link.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={link.href}
                  className={cn(
                    'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    pathname.startsWith(link.href) && link.href !== '/'
                      ? 'text-brand-700 bg-brand-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  )}
                >
                  {link.label}
                  {link.children && <ChevronDown size={14} />}
                </Link>
                {link.children && openDropdown === link.label && (
                  <div className="absolute top-full left-0 mt-1 w-52 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-50">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-700 transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <Link
              href="/search"
              className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            >
              <Search size={18} />
            </Link>
            {user ? (
              <Link
                href={user.role === 'PUBLIC' || user.role === 'SUBSCRIBER' ? '/dashboard' : '/admin'}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-colors"
              >
                <LayoutDashboard size={15} />
                Dashboard
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                <LogIn size={15} />
                Sign in
              </Link>
            )}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-50"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 py-3 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  pathname.startsWith(link.href)
                    ? 'text-brand-700 bg-brand-50'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-gray-100">
              {user ? (
                <button
                  onClick={() => { logout(); setMobileOpen(false) }}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700"
                >
                  Sign out
                </button>
              ) : (
                <Link href="/auth/login" onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2.5 text-sm text-brand-700 font-medium">
                  Sign in
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
