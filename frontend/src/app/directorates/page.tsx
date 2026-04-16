'use client'
// src/app/directorates/page.tsx

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Mail, ChevronRight } from 'lucide-react'
import PublicLayout from '@/components/layout/PublicLayout'
import { PageLoader, Card } from '@/components/ui'
import { directoratesApi } from '@/lib/api'
import { cn } from '@/lib/utils'

export default function DirectoratesPage() {
  const [activeSlug, setActiveSlug] = useState<string | null>(null)

  const { data: directorates, isLoading } = useQuery({
    queryKey: ['directorates'],
    queryFn: () => directoratesApi.getAll(),
    select: (res) => res.data.data,
  })

  useEffect(() => {
    if (directorates?.length && !activeSlug) {
      setActiveSlug(directorates[0].slug)
    }
  }, [directorates, activeSlug])

  const active = directorates?.find((d: any) => d.slug === activeSlug)

  if (isLoading) {
    return (
      <PublicLayout>
        <PageLoader />
      </PublicLayout>
    )
  }

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
            Directorates
          </h1>
          <p className="text-gray-500">
            Explore the departments and divisions of the National Universities Commission
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden sticky top-24">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Directorates
                </span>
              </div>
              <nav className="divide-y divide-gray-50">
                {directorates?.map((d: any) => (
                  <button
                    key={d.slug}
                    onClick={() => setActiveSlug(d.slug)}
                    className={cn(
                      'w-full text-left px-4 py-3 text-sm transition-all flex items-center justify-between group',
                      activeSlug === d.slug
                        ? 'bg-brand-50 text-brand-700 font-semibold border-l-2 border-brand-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    )}
                  >
                    <span className="leading-tight">{d.name}</span>
                    <ChevronRight
                      size={14}
                      className={cn(
                        activeSlug === d.slug
                          ? 'text-brand-500'
                          : 'text-gray-300 group-hover:text-gray-500'
                      )}
                    />
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3">
            {active ? (
              <div className="space-y-5">
                {/* Director header */}
                <Card className="p-6">
                  <div className="flex items-start gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-brand-100 flex items-center justify-center text-brand-700 font-bold font-display text-lg shrink-0">
                      {active.directorName
                        ? active.directorName
                            .split(' ')
                            .slice(0, 2)
                            .map((w: string) => w[0])
                            .join('')
                        : 'D'}
                    </div>

                    <div>
                      <h2 className="font-display text-2xl font-bold text-gray-900 mb-1">
                        {active.name}
                      </h2>

                      {active.directorName && (
                        <p className="text-gray-600 font-medium mb-1">
                          Director: {active.directorName}
                          {active.directorTitle && (
                            <span className="text-gray-400 font-normal">
                              {' '}
                              · {active.directorTitle}
                            </span>
                          )}
                        </p>
                      )}

                      {active.directorEmail && (
                        <a
                          href={`mailto:${active.directorEmail}`}
                          className="flex items-center gap-1.5 text-sm text-brand-600 hover:text-brand-700"
                        >
                          <Mail size={13} /> {active.directorEmail}
                        </a>
                      )}
                    </div>
                  </div>

                  {active.mandate && (
                    <div className="mt-5 pt-5 border-t border-gray-100">
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                        Mandate
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {active.mandate}
                      </p>
                    </div>
                  )}
                </Card>

                {/* Divisions */}
                {active.divisions?.length > 0 && (
                  <div>
                    <h3 className="font-display font-bold text-lg text-gray-900 mb-4">
                      Divisions{' '}
                      <span className="text-gray-400 font-normal text-sm">
                        ({active.divisions.length})
                      </span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {active.divisions.map((div: any) => (
                        <Card key={div.id} className="p-4">
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {div.name}
                          </h4>

                          {div.headName && (
                            <p className="text-sm text-gray-500 mb-2">
                              Head:{' '}
                              <span className="text-gray-700 font-medium">
                                {div.headName}
                              </span>
                            </p>
                          )}

                          {div.description && (
                            <p className="text-sm text-gray-500 leading-relaxed">
                              {div.description}
                            </p>
                          )}

                          {div.staff?.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                              {div.staff.map((s: any) => (
                                <div
                                  key={s.id}
                                  className="flex items-center gap-2"
                                >
                                  <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-600 shrink-0">
                                    {s.name
                                      .split(' ')
                                      .slice(0, 2)
                                      .map((w: string) => w[0])
                                      .join('')}
                                  </div>

                                  <div>
                                    <div className="text-xs font-semibold text-gray-700">
                                      {s.name}
                                    </div>
                                    {s.title && (
                                      <div className="text-xs text-gray-400">
                                        {s.title}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-400">
                Select a directorate to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}