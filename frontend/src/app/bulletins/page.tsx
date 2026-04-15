'use client'
// src/app/bulletins/page.tsx
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { Calendar, Eye } from 'lucide-react'
import PublicLayout from '@/components/layout/PublicLayout'
import { Input, Select, PageLoader, EmptyState, Pagination } from '@/components/ui'
import { postsApi } from '@/lib/api'
import { formatDateShort, cn } from '@/lib/utils'

const POST_TYPES = ['', 'NEWS', 'BULLETIN', 'PRESS_RELEASE', 'CIRCULAR', 'ANNOUNCEMENT']
const TYPE_LABELS: Record<string, string> = {
  '': 'All', NEWS: 'News', BULLETIN: 'Bulletin', PRESS_RELEASE: 'Press Release', CIRCULAR: 'Circular', ANNOUNCEMENT: 'Announcement',
}
const TYPE_COLORS: Record<string, string> = {
  NEWS: 'bg-blue-100 text-blue-700', BULLETIN: 'bg-green-100 text-green-700',
  PRESS_RELEASE: 'bg-purple-100 text-purple-700', CIRCULAR: 'bg-orange-100 text-orange-700',
  ANNOUNCEMENT: 'bg-teal-100 text-teal-700',
}

export default function BulletinsPage() {
  const [q, setQ] = useState('')
  const [type, setType] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['posts', q, type, page],
    queryFn: () => postsApi.getAll({ q, type, page, limit: 12 }),
    select: (res) => res.data,
  })

  const posts = data?.data || []
  const pagination = data?.pagination

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Bulletins & News</h1>
          <p className="text-gray-500">Latest announcements, circulars and news from the National Universities Commission</p>
        </div>

        {/* Type filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
          {POST_TYPES.map((t) => (
            <button key={t} onClick={() => { setType(t); setPage(1) }}
              className={cn('shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all',
                type === t ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-gray-600 border-gray-200 hover:border-brand-300')}>
              {TYPE_LABELS[t]}
            </button>
          ))}
        </div>

        <div className="mb-5">
          <Input placeholder="Search bulletins..." value={q} onChange={(e) => { setQ(e.target.value); setPage(1) }} className="max-w-sm" />
        </div>

        {isLoading ? <PageLoader /> : posts.length === 0 ? (
          <EmptyState title="No posts found" description="No bulletins match your search" />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {posts.map((post: any) => (
                <Link key={post.id} href={`/bulletins/${post.slug}`}
                  className="group bg-white rounded-2xl border border-gray-100 hover:border-brand-200 hover:shadow-sm transition-all overflow-hidden">
                  {post.featuredImage && (
                    <div className="h-40 bg-gray-100 overflow-hidden">
                      <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  )}
                  <div className="p-5">
                    <span className={cn('inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-3', TYPE_COLORS[post.type] || 'bg-gray-100 text-gray-600')}>
                      {TYPE_LABELS[post.type] || post.type}
                    </span>
                    <h3 className="font-semibold text-gray-900 leading-tight mb-2 line-clamp-2 group-hover:text-brand-700 transition-colors">
                      {post.title}
                    </h3>
                    {post.excerpt && <p className="text-sm text-gray-500 line-clamp-2 mb-4">{post.excerpt}</p>}
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar size={11} />
                        {post.publishedAt ? formatDateShort(post.publishedAt) : ''}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye size={11} /> {post.viewCount}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {pagination && <Pagination page={page} totalPages={pagination.totalPages} onPage={setPage} />}
          </>
        )}
      </div>
    </PublicLayout>
  )
}
