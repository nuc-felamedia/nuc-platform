// frontend/src/app/about/page.tsx
import Link from 'next/link'
import PublicLayout from '@/components/layout/PublicLayout'

export const metadata = {
  title: 'About NUC — National Universities Commission',
  description: 'About the National Universities Commission of Nigeria — history, functions, directorates and leadership.',
}

export default function AboutPage() {
  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
          <span>›</span>
          <span className="text-gray-600">About NUC</span>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <div className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-3">About</div>
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-4">National Universities Commission</h1>
          <p className="text-lg text-gray-500 leading-relaxed">
            The regulatory body for university education in Nigeria — ensuring quality, promoting excellence, and protecting the integrity of Nigerian degrees.
          </p>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-12">
          {[
            { label: 'Executive Secretary', href: '/about/executive-secretary', icon: '👤' },
            { label: 'Directorates', href: '/directorates', icon: '🏛️' },
            { label: 'Nigerian Universities', href: '/universities', icon: '🎓' },
            { label: 'Accreditation', href: '/accreditation', icon: '✅' },
            { label: 'Bulletins & News', href: '/bulletins', icon: '📋' },
            { label: 'Contact Us', href: '/contact', icon: '📞' },
          ].map(item => (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-brand-200 hover:bg-brand-50 transition-all text-sm font-medium text-gray-700 hover:text-brand-700">
              <span className="text-xl">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>

        {/* History */}
        <div className="prose prose-gray max-w-none">
          <h2>History</h2>
          <p>
            The National Universities Commission was established in 1962 as an advisory agency in the Cabinet Office. However
            in 1974, it became a statutory body and the first Executive Secretary, in the person of Prof. Jibril Aminu, was
            then appointed.
          </p>
          <p>
            The National Universities Commission (NUC) is a parastatal under the Federal Ministry of Education (FME). The
            Commission has a Governing Council. Its Executive Secretary is Prof. Abdullahi Yusufu Ribadu, FCVSN, who assumed
            the duty of overseeing the activities of the Commission in December 2024.
          </p>
          <p>
            Over the years, the Commission has transformed from a small office in the cabinet office to an important arm of
            government in the area of development and management of university education in Nigeria.
          </p>

          <h2>Functions</h2>
          <p>The main functions of the Commission are outlined as follows:</p>
          <ol>
            <li>Granting approval for all academic programmes run in Nigerian universities</li>
            <li>Granting approval for the establishment of all higher educational institutions offering degree programmes in Nigerian universities</li>
            <li>Ensuring quality assurance of all academic programmes offered in Nigerian universities</li>
            <li>Serving as the channel for all external support to the Nigerian universities</li>
          </ol>

          <h2>Directorates</h2>
          <p>The Commission has thirteen Directorates, each headed by a Director:</p>
          <ul>
            <li>Directorate of Academic Planning</li>
            <li>Directorate of Inspection and Monitoring</li>
            <li>Directorate of Human Resources</li>
            <li>Directorate of the Establishment of Private Universities</li>
            <li>Directorate of Students</li>
            <li>Directorate of Research, Innovations & Information Technology</li>
            <li>Directorate of Finance and Accounts</li>
            <li>Directorate of Accreditation</li>
            <li>Directorate of Open and Distance and e-Learning</li>
            <li>Directorate of Skills Development and Entrepreneurship</li>
            <li>Directorate of Public Affairs</li>
            <li>Directorate of Special Projects</li>
            <li>Directorate of the Executive Secretary's Office</li>
          </ul>

          <h2>Mission</h2>
          <p>
            To regulate and maintain quality assurance in university education in Nigeria through accreditation, funding
            advisory, capacity building, and policy development.
          </p>

          <h2>Vision</h2>
          <p>
            To be a dynamic regulatory agency acting as a catalyst for positive change and innovation for the delivery of
            quality university education in Nigeria.
          </p>

          <h2>Contact</h2>
          <p>
            Plot 430, Aguiyi Ironsi Street, Maitama District, Abuja, FCT<br />
            Email: <a href="mailto:info@nuc.edu.ng">info@nuc.edu.ng</a><br />
            Website: <a href="https://www.nuc.edu.ng" target="_blank" rel="noopener noreferrer">www.nuc.edu.ng</a>
          </p>
        </div>

        {/* ES CTA */}
        <div className="mt-12 p-6 bg-brand-50 rounded-2xl border border-brand-100 flex flex-col sm:flex-row items-center gap-6">
          <img src="/es-photo.jpg" alt="Prof. Ribadu"
            className="w-20 h-20 rounded-full object-cover object-top border-2 border-brand-200 shrink-0" />
          <div>
            <div className="font-bold text-gray-900 mb-1">Prof. Abdullahi Yusufu Ribadu, FCVSN</div>
            <div className="text-sm text-brand-600 mb-3">Executive Secretary, National Universities Commission</div>
            <Link href="/about/executive-secretary"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 px-4 py-2 rounded-lg transition-colors">
              Read full profile →
            </Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
