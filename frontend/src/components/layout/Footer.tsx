// src/components/layout/Footer.tsx
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/nuc-logo.png" alt="NUC" style={{height: "40px", width: "auto", filter: "brightness(0) invert(1)"}} />
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Nigeria's official higher education accreditation database. Powered by the National Universities Commission.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Universities</h4>
            <ul className="space-y-2 text-sm">
              {['Federal universities', 'State universities', 'Private universities', 'Distance learning'].map(l => (
                <li key={l}><Link href="/universities" className="hover:text-white transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Accreditation</h4>
            <ul className="space-y-2 text-sm">
              {[
                ['Undergraduate results', '/accreditation'],
                ['Postgraduate results', '/accreditation'],
                ['Verify a program', '/accreditation/verify'],
                ['Accreditation guide', '/documents'],
              ].map(([l, h]) => (
                <li key={l}><Link href={h} className="hover:text-white transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">About NUC</h4>
            <ul className="space-y-2 text-sm">
              {[
                ['About us', '/about'],
                ['Executive Secretary', '/about/executive-secretary'],
                ['Directorates', '/directorates'],
                ['Bulletins', '/bulletins'],
                ['Contact us', '/contact'],
              ].map(([l, h]) => (
                <li key={l}><Link href={h} className="hover:text-white transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                ['SERVICOM', '/servicom'],
                ['Freedom of Information', '/freedom-of-information'],
                ['CCMAS', '/ccmas'],
                ['Part-Time Programmes', '/part-time-programmes'],
                ['Careers', 'https://careers.nuc.edu.ng'],
              ].map(([l, h]) => (
                <li key={l}><Link href={h} className="hover:text-white transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} National Universities Commission, Nigeria. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-gray-300 transition-colors">Terms</Link>
            <Link href="/api-docs" className="hover:text-gray-300 transition-colors">API docs</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
