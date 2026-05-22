// frontend/src/app/contact/page.tsx
import Link from 'next/link'
import PublicLayout from '@/components/layout/PublicLayout'

export const metadata = {
  title: 'Contact Us — National Universities Commission',
  description: 'Contact the National Universities Commission of Nigeria.',
}

export default function ContactPage() {
  return (
    <PublicLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
          <span>›</span>
          <span className="text-gray-600">Contact Us</span>
        </nav>

        <div className="mb-10">
          <div className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-3">Get in touch</div>
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-4">Contact NUC</h1>
          <p className="text-gray-500 leading-relaxed max-w-2xl">
            Reach out to the National Universities Commission for enquiries about accreditation,
            university programmes, guidelines, or general information.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Contact details */}
          <div className="space-y-6">
            {[
              {
                icon: '📍',
                label: 'Address',
                value: 'National Universities Commission\nPlot 430, Aguiyi Ironsi Street\nPMB 237 Garki GPO\nMaitama, Abuja, FCT',
              },
              {
                icon: '✉️',
                label: 'Email',
                value: 'info@nuc.edu.ng',
                href: 'mailto:info@nuc.edu.ng',
              },
              {
                icon: '🌐',
                label: 'Website',
                value: 'www.nuc.edu.ng',
                href: 'https://www.nuc.edu.ng',
              },
            ].map(item => (
              <div key={item.label} className="flex gap-4 p-5 bg-white rounded-2xl border border-gray-100">
                <div className="text-2xl shrink-0">{item.icon}</div>
                <div>
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{item.label}</div>
                  {item.href ? (
                    <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className="text-brand-600 hover:text-brand-700 font-medium">
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-gray-700 whitespace-pre-line">{item.value}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Directorate contacts */}
            <div className="p-5 bg-white rounded-2xl border border-gray-100">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Specific enquiries</div>
              <div className="space-y-2 text-sm">
                {[
                  { label: 'Accreditation matters', href: '/accreditation' },
                  { label: 'University listings', href: '/universities' },
                  { label: 'Directorates', href: '/directorates' },
                  { label: 'Bulletins & circulars', href: '/bulletins' },
                ].map(item => (
                  <Link key={item.href} href={item.href}
                    className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 text-gray-700 hover:text-brand-600 transition-colors">
                    {item.label}
                    <span className="text-gray-300">→</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3939.4!2d7.4923!3d9.0827!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e0b8b3b5b5b5b%3A0x5b5b5b5b5b5b5b5b!2sNational%20Universities%20Commission!5e0!3m2!1sen!2sng!4v1234567890"
                width="100%"
                height="320"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="NUC Location"
              />
              <div className="p-4 text-sm text-gray-500">
                Plot 430, Aguiyi Ironsi Street, Maitama, Abuja
              </div>
            </div>

            {/* Working hours */}
            <div className="p-5 bg-white rounded-2xl border border-gray-100">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Working hours</div>
              <div className="space-y-2 text-sm">
                {[
                  { day: 'Monday – Friday', hours: '8:00 AM – 5:00 PM' },
                  { day: 'Saturday', hours: 'Closed' },
                  { day: 'Sunday', hours: 'Closed' },
                  { day: 'Public holidays', hours: 'Closed' },
                ].map(item => (
                  <div key={item.day} className="flex justify-between py-1.5 border-b border-gray-50 last:border-0">
                    <span className="text-gray-600">{item.day}</span>
                    <span className={item.hours === 'Closed' ? 'text-gray-400' : 'text-gray-800 font-medium'}>{item.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
