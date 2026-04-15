'use client'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { Plus, Eye, Edit, Trash2 } from 'lucide-react'
import { postsApi } from '@/lib/api'
import { Button, Input, Select, PageLoader, EmptyState, Pagination } from '@/components/ui'
import { formatDateShort, cn } from '@/lib/utils'
import toast from 'react-hot-toast'

const TYPE_COLORS: Record<string, string> = {
  NEWS: 'bg-blue-100 text-blue-700',
  BULLETIN: 'bg-green-100 text-green-700',
  PRESS_RELEASE: 'bg-purple-100 text-purple-700',
  CIRCULAR: 'bg-orange-100 text-orange-700',
  ANNOUNCEMENT: 'bg-teal-100 text-teal-700',
}

export default function AdminPostsPage() {
  const [q, setQ] = useState('')
  const [type, setType] = useState('')
  const [page, setPage] = useState(1)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-posts', q, type, page],
    queryFn: () => postsApi.getAll({ q, type, page, limit: 20 }),
    select: (res) => res.data,
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => postsApi.delete(id),
    onSuccess: () => {
      toast.success('Post archived')
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] })
    },
    onError: () => toast.error('Failed to archive post'),
  })

  const posts = data?.data || []
  const pagination = data?.pagination

  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Posts & bulletins</h1>
          <p className="text-gray-500 text-sm mt-1">{pagination?.total || 0} total posts</p>
        </div>
        <Link href="/admin/posts/new">
          <Button size="md"><Plus size={15} /> New post</Button>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-3 flex-wrap">
          <Input placeholder="Search posts..." value={q} onChange={e => { setQ(e.target.value); setPage(1) }} className="flex-1 min-w-48" />
          <Select value={type} onChange={e => { setType(e.target.value); setPage(1) }} className="w-44">
            <option value="">All types</option>
            <option value="NEWS">News</option>
            <option value="BULLETIN">Bulletin</option>
            <option value="PRESS_RELEASE">Press Release</option>
            <option value="CIRCULAR">Circular</option>
            <option value="ANNOUNCEMENT">Announcement</option>
          </Select>
        </div>

        {isLoading ? <PageLoader /> : posts.length === 0 ? (
          <EmptyState title="No posts found" description="Create your first bulletin using the button above" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Title</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Type</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Date</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post: any) => (
                  <tr key={post.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-gray-900 line-clamp-1">{post.title}</div>
                      {post.authorName && <div className="text-xs text-gray-400 mt-0.5">{post.authorName}</div>}
                    </td>
                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full', TYPE_COLORS[post.type] || 'bg-gray-100 text-gray-600')}>
                        {post.type}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full',
                        post.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600')}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs hidden md:table-cell">
                      {post.publishedAt ? formatDateShort(post.publishedAt) : '—'}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <Link href={`/bulletins/${post.slug}`} target="_blank">
                          <Button variant="ghost" size="sm"><Eye size={13} /></Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => { if (confirm('Archive this post?')) deleteMutation.mutate(post.id) }}
                        >
                          <Trash2 size={13} className="text-red-400" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pagination && <Pagination page={page} totalPages={pagination.totalPages} onPage={setPage} />}
    </div>
  )
}
