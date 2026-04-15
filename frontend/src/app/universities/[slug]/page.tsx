// src/app/universities/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Globe, Calendar, Users, BookOpen, ChevronRight } from 'lucide-react'
import PublicLayout from '@/components/layout/PublicLayout'
import { AccreditationBadge, UniversityTypeBadge, Card } from '@/components/ui'
import { getUniversityInitials, formatDate } from '@/lib/utils'
import { universitiesApi } from '@/lib/api'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const { data } = await universitiesApi.getOne(params.slug)
    const uni = data.data
    return { title: uni.name, description: uni.description || `${uni.name} — NUC accreditation details` }
  } catch { return { title: 'University' } }
}

export default async function UniversityDetailPage({ params }: { params: { slug: string } }) {
  let university: any
  try {
    const { data } = await universitiesApi.getOne(params.slug)
    university = data.data
  } catch { notFound() }

  const initials = getUniversityInitials(university.name)
  const programs = university.programs || []
  const allAcc = programs.flatMap((p: any) => p.accreditations || [])
  const fullCount = allAcc.filter((a: any) => a.status === 'FULL').length
  const interimCount = allAcc.filter((a: any) => a.status === 'INTERIM').length
  const deniedCount = allAcc.filter((a: any) => a.status === 'DENIED').length

  return (
    <PublicLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link href="/universities" className="hover:text-brand-600 transition-colors">Universities</Link>
          <ChevronRight size={14} />
          <span className="text-gray-700">{university.name}</span>
        </nav>

        {/* Hero card */}
        <Card className="mb-6 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-brand-500 to-brand-400" />
          <div className="p-6 sm:p-8">
            <div className="flex items-start gap-5 mb-5">
              <div className="w-16 h-16 rounded-2xl bg-brand-600 flex items-center justify-center text-white font-display font-bold text-xl shrink-0">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-start gap-2 mb-2">
                  <h1 className="font-display font-bold text-2xl text-gray-900">{university.name}</h1>
                  {university.abbreviation && (
                    <span className="text-sm text-gray-400 font-mono mt-1">({university.abbreviation})</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <UniversityTypeBadge type={university.type} />
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-100 text-green-800 text-xs font-semibold border border-green-200">
                    NUC Approved
                  </span>
                </div>
                {university.description && (
                  <p className="text-gray-500 text-sm leading-relaxed">{university.description}</p>
                )}
              </div>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pt-5 border-t border-gray-100">
              {[
                { icon: MapPin, label: 'Location', value: `${university.city || ''} ${university.state}`.trim() },
                { icon: Calendar, label: 'Established', value: university.yearEstablished },
                { icon: Users, label: 'Vice-Chancellor', value: university.vcName },
                { icon: BookOpen, label: 'Programs', value: programs.length },
              ].filter(d => d.value).map(({ icon: Icon, label, value }) => (
                <div key={label}>
                  <div className="flex items-center gap-1 text-xs text-gray-400 mb-0.5">
                    <Icon size={11} />
                    {label}
                  </div>
                  <div className="text-sm font-semibold text-gray-800">{String(value)}</div>
                </div>
              ))}
            </div>

            {university.website && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <a href={university.website} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-brand-600 hover:text-brand-700 font-medium">
                  <Globe size={14} /> {university.website}
                </a>
              </div>
            )}
          </div>
        </Card>

        {/* Accreditation summary */}
        {allAcc.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 border border-green-100 rounded-2xl p-4 text-center">
              <div className="text-3xl font-bold text-green-700 font-display">{fullCount}</div>
              <div className="text-xs text-green-600 font-medium mt-1">Full accreditation</div>
            </div>
            <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-4 text-center">
              <div className="text-3xl font-bold text-yellow-700 font-display">{interimCount}</div>
              <div className="text-xs text-yellow-600 font-medium mt-1">Interim</div>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4 text-center">
              <div className="text-3xl font-bold text-red-700 font-display">{deniedCount}</div>
              <div className="text-xs text-red-600 font-medium mt-1">Denied</div>
            </div>
          </div>
        )}

        {/* Programs table */}
        <Card>
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-display font-bold text-lg text-gray-900">
              Programs offered <span className="text-gray-400 font-normal text-sm">({programs.length})</span>
            </h2>
          </div>
          {programs.length === 0 ? (
            <div className="p-10 text-center text-gray-400 text-sm">No programs found for this university.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Program</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Faculty</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Degree</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Expires</th>
                  </tr>
                </thead>
                <tbody>
                  {programs.map((program: any) => {
                    const acc = program.accreditations?.[0]
                    return (
                      <tr key={program.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3.5 font-medium text-gray-900">{program.name}</td>
                        <td className="px-5 py-3.5 text-gray-500 hidden sm:table-cell">{program.faculty?.name || '—'}</td>
                        <td className="px-5 py-3.5 text-gray-500 font-mono text-xs">{program.degreeType}</td>
                        <td className="px-5 py-3.5">
                          {acc ? <AccreditationBadge status={acc.status} /> : (
                            <span className="text-xs text-gray-400">Not assessed</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-gray-400 text-xs hidden md:table-cell">
                          {acc?.expiryDate ? new Date(acc.expiryDate).getFullYear() : '—'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </PublicLayout>
  )
}
