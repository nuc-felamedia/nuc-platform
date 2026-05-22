// frontend/src/app/about/executive-secretary/page.tsx

import Link from 'next/link'
import PublicLayout from '@/components/layout/PublicLayout'

export const metadata = {
  title: 'Executive Secretary — Prof. Abdullahi Yusufu Ribadu | NUC',
  description: 'Profile of Professor Abdullahi Yusufu Ribadu, FCVSN, Executive Secretary of the National Universities Commission.',
}

export default function ExecutiveSecretaryPage() {
  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
          <span>›</span>
          <Link href="/about" className="hover:text-brand-600 transition-colors">About</Link>
          <span>›</span>
          <span className="text-gray-600">Executive Secretary</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col md:flex-row gap-10 items-start mb-12 pb-10 border-b border-gray-100">
          <div className="shrink-0">
            <img
              src="/es-photo.jpg"
              alt="Prof. Abdullahi Yusufu Ribadu"
              className="w-64 h-80 object-cover object-top rounded-2xl border border-gray-100 shadow-sm"
            />
          </div>
          <div>
            <div className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-3">Executive Secretary</div>
            <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
              Prof. Abdullahi Yusufu Ribadu, FCVSN
            </h1>
            <p className="text-brand-600 font-medium mb-6">Executive Secretary, National Universities Commission</p>
            <div className="space-y-2 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">Born:</span> September 2, 1960 — Fufore, Adamawa State
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">Address:</span> Plot 430, Aguiyi Ironsi Street, Maitama, Abuja
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">Email:</span> info@nuc.edu.ng
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">Website:</span>{' '}
                <a href="https://www.nuc.edu.ng" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">www.nuc.edu.ng</a>
              </div>
            </div>
          </div>
        </div>

        {/* Full biography */}
        <div className="prose prose-gray max-w-none">
          <p>
            Born in Fufore, Adamawa State on September 2nd, 1960, Professor Abdullahi Yusufu Ribadu, FCVSN embodies a lifelong
            dedication to education and a relentless pursuit of excellence. Now, as the Executive Secretary of the National Universities
            Commission (NUC), Professor Ribadu brings a wealth of experience and a deep understanding of the Nigerian academic landscape
            to steer its future.
          </p>

          <p>
            Professor Ribadu's formative years laid a solid foundation for his illustrious career. His primary education (1967–1973)
            paved the way for his admission to the Government Comprehensive Secondary School, Mubi, where he excelled, earning his
            West African School Certificate (WASC) in 1978. He spent a brief but impactful period at the School of Basic Studies at
            Ahmadu Bello University (ABU) in Zaria from 1978 to 1979. In October of 1979, Professor Ribadu began his Doctor of
            Veterinary Medicine programme at ABU Zaria, graduating in June 1984. He then fulfilled his mandatory National Youth
            Service year at the Lower Niger River Basin and Rural Development Authority in Ilorin, from 1984 to 1985.
          </p>

          <p>
            Returning to his passion for academia, Professor Ribadu joined the University of Maiduguri in September 1985 as an
            Assistant Lecturer in the Department of Veterinary Surgery and Reproduction. His thirst for knowledge led him to pursue
            a Master of Science degree in Theriogenology at his alma mater, ABU Zaria (1986–1988). This pursuit was further fueled
            by a prestigious Commonwealth Scholarship in 1990, which took him to the University of Liverpool, United Kingdom, for
            his PhD. His groundbreaking work on "ultrasonography and endocrinology of ovarian cysts in cattle" during this period
            has garnered significant international recognition and continues to be widely cited.
          </p>

          <p>
            Professor Ribadu's commitment to global academic engagement is further evidenced by a coveted 2-year Postdoctoral
            Fellowship awarded by the Japan Society for the Promotion of Science (JSPS) in 1997, which saw him immersed in research
            at Rakuno Gakuen University in Hokkaido, Japan.
          </p>

          <p>
            His ascent through the academic ranks at the University of Maiduguri culminated in his appointment as a Professor of
            Veterinary Reproduction in October 2002. As a testament to his leadership acumen, in April 2004, President Olusegun
            Obasanjo appointed Professor Ribadu as the 5th Vice-Chancellor of the Federal University of Technology, Yola (FUTY),
            now Modibbo Adama University. His five-year tenure (2004–2009) as Vice-Chancellor was marked by transformative
            initiatives that left a lasting positive impact on the university.
          </p>

          <p>
            In December 2013, Professor Ribadu assumed the role of pioneer Vice-Chancellor at the newly established Jigawa State
            University, Kafin Hausa (later renamed Sule Lamido University), skilfully leading the institution through its
            foundational years.
          </p>

          <p>
            Professor Ribadu's deep understanding of the NUC's operations stems from his sabbatical (June 2009 – November 2011),
            during which he chaired the Commission's Committee on Monitoring of Private Universities (COMPU). More recently, his
            roles as a Visiting Professor at Guru Angad Dev Veterinary and Animal Science University (GADVASU), India (2023),
            and at the NUC itself before becoming Executive Secretary, highlight his sustained engagement with the Nigerian
            University System.
          </p>

          <h2>Professional Memberships and Honours</h2>
          <ul>
            <li>Membership Diploma (MCVSN, 2003) and Fellowship (FCVSN, 2011) — College of Veterinary Surgeons of Nigeria</li>
            <li>Member, Nigeria Institute of Management (MNIM)</li>
            <li>Honorary Fellow, Nigerian Institution of Agricultural Engineers (FNIAE)</li>
            <li>Fellow, Global e-policy and e-government Institute, South Korea</li>
            <li>Fellow, Institute for Government Research and Leadership Technology (2014)</li>
            <li>Honorary Secretary-General, Association of West Africa Universities (AWAU), 2016–2019</li>
            <li>Honorary Degree — Doctor of Letters (D.Litt.) Honoris Causa, Commonwealth University, London (2017)</li>
            <li>Member, TETFund National Research Fund Screening and Monitoring Committee (NRF), since 2021</li>
          </ul>

          <h2>Seven-Point Agenda</h2>
          <p>As Executive Secretary of NUC, Professor Ribadu is implementing a seven-point cardinal agenda:</p>
          <ol>
            <li>Increasing Access and Balance</li>
            <li>Enhancing Funding and External Support</li>
            <li>Driving Digitisation</li>
            <li>Strengthening Quality Assurance</li>
            <li>Promoting Innovation and Research</li>
            <li>Stabilising the Academic Calendar</li>
            <li>Revisiting NUC Laws</li>
          </ol>

          <p>
            Professor Ribadu is also fluent in Fulfulde, Hausa, and English, and possesses a working knowledge of Japanese.
            He is a devoted family man and an avid traveller who enjoys reading and table tennis.
          </p>
        </div>

        <div className="mt-10 pt-8 border-t border-gray-100">
          <Link href="/" className="text-brand-600 hover:text-brand-700 text-sm font-medium">
            ← Back to home
          </Link>
        </div>
      </div>
    </PublicLayout>
  )
}
