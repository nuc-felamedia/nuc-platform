'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import PublicLayout from '@/components/layout/PublicLayout'
import SearchBar from '@/components/search/SearchBar'
import { AccreditationBadge, PageLoader, EmptyState } from '@/components/ui'
import { searchApi } from '@/lib/api'
import { cn } from '@/lib/utils'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const q = searchParams.get('q') || ''

  const { data, isLoading } = useQuery({
    queryKey: ['search', q],
    queryFn: () => searchApi.search(q),
    select: (res) => res.data.data,
    enabled: q.length > 1,
  })

  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-gray-900 mb-4">Search results</h1>
          <SearchBar placeholder="Search universities, programs..." />
        </div>

        {!q && <EmptyState title="Enter a search term" description="Search for universities, programs or bulletins" />}
        {isLoading && <PageLoader />}

        {data && (
          <div className="space-y-8">
            {data.universities?.length > 0 && (
              <div>
                <h2 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Universities ({data.universities.length})</h2>
                <div className="space-y-2">
                  {data.universities.map((u: any) => (
                    <Link key={u.id} href={`/universities/${u.slug}`}
                      className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-brand-200 transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-sm shrink-0">
                        {u.abbreviation?.slice(0,2) || u.name.slice(0,2)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{u.name}</div>
                        <div className="text-xs text-gray-400">{u.state} · {u.type}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {data.programs?.length > 0 && (
              <div>
                <h2 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Programs ({data.programs.length})</h2>
                <div className="space-y-2">
                  {data.programs.map((p: any) => (
                    <Link key={p.id} href={`/universities/${p.university.slug}`}
                      className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:border-brand-200 transition-colors">
                      <div>
                        <div className="font-semibold text-gray-900">{p.name}</div>
                        <div className="text-xs text-gray-400">{p.degreeType} · {p.university.name}</div>
                      </div>
                      {p.accreditations?.[0] && <AccreditationBadge status={p.accreditations[0].status} />}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {data.posts?.length > 0 && (
              <div>
                <h2 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Bulletins ({data.posts.length})</h2>
                <div className="space-y-2">
                  {data.posts.map((p: any) => (
                    <Link key={p.id} href={`/bulletins/${p.slug}`}
                      className="block p-4 bg-white rounded-xl border border-gray-100 hover:border-brand-200 transition-colors">
                      <div className="font-semibold text-gray-900">{p.title}</div>
                      <div className="text-xs text-gray-400 mt-1">{p.type}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {data.universities?.length === 0 && data.programs?.length === 0 && data.posts?.length === 0 && (
              <EmptyState title={`No results for "${q}"`} description="Try a different search term" />
            )}
          </div>
        )}
      </div>
    </PublicLayout>
  )
}
