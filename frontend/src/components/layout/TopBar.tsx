// frontend/src/components/layout/TopBar.tsx
// Utility bar above the main navbar — matches old NUC site structure

import Link from 'next/link'

const UTILITY_LINKS = [
  { label: 'Accreditation Results', href: '/accreditation' },
  { label: 'SERVICOM', href: '/servicom' },
  { label: 'Freedom of Information', href: '/freedom-of-information' },
  { label: 'Careers', href: 'https://careers.nuc.edu.ng', external: true },
  { label: 'CCMAS', href: '/ccmas' },
  { label: 'Part-Time Programmes', href: '/part-time-programmes' },
]

export default function TopBar() {
  return (
    <div className="bg-brand-900 text-white hidden md:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-end h-8 gap-6">
          {UTILITY_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              className="text-xs text-brand-200 hover:text-white transition-colors font-medium"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
