// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter, Sora } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import '@/styles/globals.css'
import { Providers } from '@/components/layout/Providers'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'NUC Accreditation Platform',
    template: '%s | NUC Accreditation Platform',
  },
  description: 'Nigeria\'s official higher education accreditation database. Search universities, verify course accreditation status, and explore NUC data.',
  keywords: ['NUC', 'Nigeria', 'university accreditation', 'higher education', 'JAMB', 'university programs'],
  openGraph: {
    title: 'NUC Accreditation Platform',
    description: 'Nigeria\'s official higher education accreditation database.',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'NUC Platform',
    locale: 'en_NG',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${sora.variable} font-sans`}>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: { fontSize: '14px' },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
