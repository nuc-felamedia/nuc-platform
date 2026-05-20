'use client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { Calendar, Eye, Archive } from 'lucide-react'
import PublicLayout from '@/components/layout/PublicLayout'
import { Input, PageLoader, EmptyState, Pagination } from '@/components/ui'
import { postsApi } from '@/lib/api'
import { formatDateShort, cn } from '@/lib/utils'

const POST_TYPES = ['', 'NEWS', 'BULLETIN', 'PRESS_RELEASE', 'CIRCULAR', 'ANNOUNCEMENT']
const TYPE_LABELS: Record<string, string> = {
  '': 'All', NEWS: 'News', BULLETIN: 'Bulletin',
  PRESS_RELEASE: 'Press Release', CIRCULAR: 'Circular', ANNOUNCEMENT: 'Announcement',
}
const TYPE_COLORS: Record<string, string> = {
  NEWS: 'bg-blue-100 text-blue-700',
  BULLETIN: 'bg-green-100 text-green-700',
  PRESS_RELEASE: 'bg-purple-100 text-purple-700',
  CIRCULAR: 'bg-orange-100 text-orange-700',
  ANNOUNCEMENT: 'bg-teal-100 text-teal-700',
}
const TYPE_BG: Record<string, string> = {
  NEWS: 'bg-blue-50',
  BULLETIN: 'bg-green-50',
  PRESS_RELEASE: 'bg-purple-50',
  CIRCULAR: 'bg-orange-50',
  ANNOUNCEMENT: 'bg-teal-50',
}

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = ['', ...Array.from({ length: CURRENT_YEAR - 2009 }, (_, i) => String(CURRENT_YEAR - i))]

// Extract first image URL from WordPress HTML content
function extractFirstImage(content: string): string | null {
  if (!content) return null
  const match = content.match(/src="(https?:\/\/[^"]+\.(jpg|jpeg|png|webp|gif)[^"]*)"/i)
  return match ? match[1] : null
}

export default function BulletinsPage() {
  const [q, setQ]       = useState('')
  const [type, setType] = useState('')
  const [year, setYear] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['posts', q, type, year, page],
    queryFn: () => postsApi.getAll({ q, type, year, page, limit: 12 }),
    select: (res) => res.data,
  })

  const posts = data?.data || []
  const pagination = data?.pagination

  function reset() { setQ(''); setType(''); setYear(''); setPage(1) }

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
              <Archive size={20} className="text-brand-600" />
            </div>
            <h1 className="font-display text-3xl font-bold text-gray-900">Bulletins & Archive</h1>
          </div>
          <p className="text-gray-500 ml-13">
            All NUC announcements, circulars, press releases and news — searchable and filterable by year
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-6 space-y-3">
          <Input
            placeholder="Search bulletins, circulars, announcements..."
            value={q}
            onChange={e => { setQ(e.target.value); setPage(1) }}
          />
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {POST_TYPES.map(t => (
              <button key={t} onClick={() => { setType(t); setPage(1) }}
                className={cn('shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all',
                  type === t ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-gray-600 border-gray-200 hover:border-brand-300')}>
                {TYPE_LABELS[t]}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-gray-400" />
              <span className="text-xs text-gray-500 font-medium">Year:</span>
            </div>
            <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
              {YEARS.map(y => (
                <button key={y || 'all'} onClick={() => { setYear(y); setPage(1) }}
                  className={cn('shrink-0 px-3 py-1 rounded-lg text-xs font-semibold border transition-all',
                    year === y ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400')}>
                  {y || 'All years'}
                </button>
              ))}
            </div>
            {(q || type || year) && (
              <button onClick={reset} className="ml-auto text-xs text-brand-600 hover:text-brand-700 font-medium shrink-0">
                Clear filters ×
              </button>
            )}
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">
            {isLoading ? 'Loading...' : `${(pagination?.total || 0).toLocaleString()} ${pagination?.total === 1 ? 'result' : 'results'}`}
            {year && ` from ${year}`}
            {type && ` · ${TYPE_LABELS[type]}`}
          </p>
        </div>

        {isLoading ? <PageLoader /> : posts.length === 0 ? (
          <EmptyState title="No bulletins found" description={q || type || year ? 'Try adjusting your filters' : 'No bulletins published yet'} />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {posts.map((post: any) => {
                const thumb = post.featuredImage || extractFirstImage(post.content || '')
                return (
                  <Link key={post.id} href={`/bulletins/${post.slug}`}
                    className="group bg-white rounded-2xl border border-gray-100 hover:border-brand-200 hover:shadow-sm transition-all overflow-hidden flex flex-col">

                    {/* Thumbnail */}
                    <div className="h-44 overflow-hidden shrink-0 relative">
                      {thumb ? (
                        <img src={thumb} alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className={cn('w-full h-full flex items-center justify-center', TYPE_BG[post.type] || 'bg-gray-50')}>
                          <img src="/nuc-logo.png" alt="NUC" className="h-16 w-auto opacity-20" />
                        </div>
                      )}
                      {/* Year badge overlay */}
                      {post.publishedAt && (
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-semibold px-2 py-1 rounded-lg">
                          {new Date(post.publishedAt).getFullYear()}
                        </div>
                      )}
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <span className={cn('inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-3 self-start',
                        TYPE_COLORS[post.type] || 'bg-gray-100 text-gray-600')}>
                        {TYPE_LABELS[post.type] || post.type}
                      </span>

                      <h3 className="font-semibold text-gray-900 leading-snug mb-2 line-clamp-2 group-hover:text-brand-700 transition-colors flex-1">
                        {post.title}
                      </h3>

                      {post.excerpt && (
                        <p className="text-sm text-gray-500 line-clamp-2 mb-4">{post.excerpt}</p>
                      )}

                      <div className="flex items-center justify-between text-xs text-gray-400 mt-auto pt-3 border-t border-gray-50">
                        <span className="flex items-center gap-1">
                          <Calendar size={11} />
                          {post.publishedAt ? formatDateShort(post.publishedAt) : 'Draft'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye size={11} />
                          {(post.viewCount || 0).toLocaleString()} views
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="mt-8">
                <Pagination page={page} totalPages={pagination.totalPages} onPage={setPage} />
              </div>
            )}
          </>
        )}
      </div>
    </PublicLayout>
  )
}
