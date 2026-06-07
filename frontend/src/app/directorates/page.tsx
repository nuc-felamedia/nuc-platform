'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Mail, ChevronDown, ChevronRight, Building2 } from 'lucide-react'
import PublicLayout from '@/components/layout/PublicLayout'
import { api } from '@/lib/api'

function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden mb-2">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-gray-50 transition-colors text-left"
      >
        <span className="font-semibold text-gray-800 text-sm">{title}</span>
        <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-5 pb-5 pt-2 bg-gray-50 border-t border-gray-100 text-sm text-gray-600 leading-relaxed">
          {children}
        </div>
      )}
    </div>
  )
}

export default function DirectoratesPage() {
  const [directorates, setDirectorates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    api.get('/directorates').then(res => {
      setDirectorates(res.data?.data || [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const activeDir = selected
    ? directorates.find(d => d.id === selected)
    : directorates[0]

  if (loading) return (
    <PublicLayout>
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-9 h-9 border-[3px] border-gray-200 border-t-brand-600 rounded-full animate-spin" />
      </div>
    </PublicLayout>
  )

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

        {/* Header */}
        <div className="mb-8">
          <div className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-2">Structure</div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Directorates</h1>
          <p className="text-gray-500 max-w-2xl leading-relaxed">
            The National Universities Commission is organised into 13 directorates that oversee different aspects of university education in Nigeria.
          </p>
        </div>

        {directorates.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Building2 size={40} className="mx-auto mb-4 opacity-30" />
            <p>No directorates found</p>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-8 lg:items-start">

            {/* Mobile directorate selector */}
            <div className="lg:hidden mb-6">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl font-medium text-gray-800"
              >
                <span>{activeDir?.name || 'Select directorate'}</span>
                <ChevronDown size={18} className={`transition-transform ${mobileMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {mobileMenuOpen && (
                <div className="mt-2 bg-white border border-gray-100 rounded-xl overflow-hidden shadow-lg z-10 relative">
                  {directorates.map(dir => (
                    <button key={dir.id}
                      onClick={() => { setSelected(dir.id); setMobileMenuOpen(false) }}
                      className={`w-full text-left px-4 py-3 text-sm border-b border-gray-50 last:border-0 transition-colors
                        ${(selected ? selected === dir.id : directorates[0]?.id === dir.id)
                          ? 'bg-brand-50 text-brand-700 font-semibold'
                          : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      {dir.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop sidebar */}
            <div className="hidden lg:block sticky top-6">
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-50">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">All Directorates</p>
                </div>
                {directorates.map(dir => {
                  const isActive = selected ? selected === dir.id : directorates[0]?.id === dir.id
                  return (
                    <button key={dir.id} onClick={() => setSelected(dir.id)}
                      className={`w-full text-left px-4 py-3.5 text-sm border-b border-gray-50 last:border-0 transition-all
                        ${isActive
                          ? 'bg-brand-50 text-brand-700 font-semibold border-l-[3px] border-l-brand-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-[3px] border-l-transparent'}`}
                    >
                      {dir.name}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Main content */}
            {activeDir && (
              <div>
                {/* Director card */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 mb-6">
                  <div className="flex flex-col sm:flex-row gap-6 items-start">
                    {/* Photo */}
                    {activeDir.directorPhotoUrl ? (
                      <img
                        src={activeDir.directorPhotoUrl}
                        alt={activeDir.directorName}
                        className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover object-top border border-gray-100 shrink-0"
                      />
                    ) : (
                      <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0">
                        <Building2 size={32} className="text-brand-300" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-2">
                        {activeDir.name}
                      </div>
                      {activeDir.directorName ? (
                        <>
                          <h2 className="font-display text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                            {activeDir.directorName}
                          </h2>
                          <p className="text-brand-600 font-medium text-sm mb-3">{activeDir.directorTitle}</p>
                        </>
                      ) : (
                        <h2 className="font-display text-xl font-bold text-gray-900 mb-3">{activeDir.name}</h2>
                      )}
                      {activeDir.directorEmail && (
                        <a href={`mailto:${activeDir.directorEmail}`}
                          className="inline-flex items-center gap-2 text-sm text-brand-600 hover:text-brand-700">
                          <Mail size={14} /> {activeDir.directorEmail}
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Info accordions */}
                <div className="mb-6">
                  {activeDir.description && (
                    <Accordion title="About this Directorate">
                      <p>{activeDir.description}</p>
                    </Accordion>
                  )}
                  {activeDir.vision && (
                    <Accordion title="Vision">
                      <p>{activeDir.vision}</p>
                    </Accordion>
                  )}
                  {activeDir.mandate && (
                    <Accordion title="Mandate & Functions">
                      <p>{activeDir.mandate}</p>
                    </Accordion>
                  )}
                </div>

                {/* Divisions */}
                {activeDir.divisions?.length > 0 && (
                  <div>
                    <h3 className="font-display text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <ChevronRight size={18} className="text-brand-600" />
                      Directorate Divisions
                    </h3>
                    <div className="space-y-2">
                      {activeDir.divisions.map((division: any) => (
                        <Accordion key={division.id} title={division.name}>
                          {division.description && (
                        <div className="mb-3 space-y-1 text-sm">
                          {division.description.split('\n').map((line: string, i: number) => (
                            <p key={i} className={line.trim() === '' ? 'mt-2' : ''}>{line}</p>
                          ))}
                        </div>
                      )}
                          {division.staff?.length > 0 && (
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {division.staff.map((member: any) => (
                                <div key={member.id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
                                  {member.photoUrl ? (
                                    <img src={member.photoUrl} alt={member.name}
                                      className="w-10 h-10 rounded-full object-cover shrink-0 border border-gray-100" />
                                  ) : (
                                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                                      <span className="text-sm font-bold text-indigo-400">{member.name?.[0]}</span>
                                    </div>
                                  )}
                                  <div className="min-w-0">
                                    <div className="text-sm font-semibold text-gray-900 truncate">{member.name}</div>
                                    {member.title && <div className="text-xs text-gray-500 truncate">{member.title}</div>}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          {(!division.staff || division.staff.length === 0) && (
                            <p className="text-gray-400 italic text-xs mt-2">
                              No staff profiles yet.{' '}
                              <Link href="/profile/setup" className="text-brand-600">Staff can add their profile here</Link>
                            </p>
                          )}
                        </Accordion>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </PublicLayout>
  )
}
