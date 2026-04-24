'use client'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { Calendar, User, Eye, ArrowLeft, Share2 } from 'lucide-react'
import PublicLayout from '@/components/layout/PublicLayout'
import { PageLoader, Card } from '@/components/ui'
import { postsApi } from '@/lib/api'
import { formatDate, cn } from '@/lib/utils'

const TYPE_COLORS: Record<string, string> = {
  NEWS: 'bg-blue-100 text-blue-700',
  BULLETIN: 'bg-green-100 text-green-700',
  PRESS_RELEASE: 'bg-purple-100 text-purple-700',
  CIRCULAR: 'bg-orange-100 text-orange-700',
  ANNOUNCEMENT: 'bg-teal-100 text-teal-700',
}

const TYPE_LABELS: Record<string, string> = {
  NEWS: 'News', BULLETIN: 'Bulletin', PRESS_RELEASE: 'Press Release',
  CIRCULAR: 'Circular', ANNOUNCEMENT: 'Announcement',
}

function cleanWordPressContent(content: string): string {
  return (content || '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<figure[^>]*>[\s\S]*?<\/figure>/g, '')
    .trim()
}

export default function BulletinDetailPage() {
  const { slug } = useParams()

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', slug],
    queryFn: () => postsApi.getOne(slug as string),
    select: (res) => res.data.data,
    retry: false,
  })

  const { data: relatedPosts } = useQuery({
    queryKey: ['posts-related', post?.type],
    queryFn: () => postsApi.getAll({ type: post?.type, limit: 3 }),
    select: (res) => res.data.data.filter((p: any) => p.slug !== slug),
    enabled: !!post?.type,
  })

  if (isLoading) return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <PageLoader />
      </div>
    </PublicLayout>
  )

  if (error || !post) return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="text-5xl mb-4">📋</div>
        <h2 className="font-display font-bold text-xl text-gray-700 mb-2">Post not found</h2>
        <p className="text-gray-500 text-sm mb-6">This bulletin may have been removed or the link is incorrect.</p>
        <Link href="/bulletins" className="text-brand-600 hover:text-brand-700 font-medium">
          ← Back to bulletins
        </Link>
      </div>
    </PublicLayout>
  )

  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
          <span>›</span>
          <Link href="/bulletins" className="hover:text-brand-600 transition-colors">Bulletins</Link>
          <span>›</span>
          <span className="text-gray-600 line-clamp-1">{post.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Type badge */}
            <div className="mb-4">
              <span className={cn('inline-block text-xs font-semibold px-3 py-1.5 rounded-full', TYPE_COLORS[post.type] || 'bg-gray-100 text-gray-600')}>
                {TYPE_LABELS[post.type] || post.type}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-4">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6 pb-6 border-b border-gray-100">
              {post.publishedAt && (
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  {formatDate(post.publishedAt)}
                </span>
              )}
              {post.authorName && (
                <span className="flex items-center gap-1.5">
                  <User size={14} />
                  {post.authorName}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Eye size={14} />
                {post.viewCount} views
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href)
                  alert('Link copied to clipboard!')
                }}
                className="flex items-center gap-1.5 text-brand-600 hover:text-brand-700 transition-colors ml-auto"
              >
                <Share2 size={14} />
                Share
              </button>
            </div>

            {/* Featured image */}
            {post.featuredImage && (
              <div className="mb-6 rounded-2xl overflow-hidden">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full object-cover max-h-72"
                />
              </div>
            )}

            {/* Excerpt */}
            {post.excerpt && (
              <div className="bg-brand-50 border-l-4 border-brand-400 rounded-r-xl px-5 py-4 mb-6">
                <p className="text-brand-800 font-medium text-sm leading-relaxed">{post.excerpt}</p>
              </div>
            )}

            {/* Content — renders WordPress HTML properly */}
            <div
              className="prose prose-gray max-w-none text-sm sm:text-base"
              dangerouslySetInnerHTML={{
                __html: cleanWordPressContent(post.content)
              }}
            />

            {/* Tags */}
            {post.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-gray-100">
                {post.tags.map((tag: string) => (
                  <span key={tag} className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Back button */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <Link href="/bulletins"
                className="inline-flex items-center gap-2 text-sm text-brand-600 hover:text-brand-700 font-medium transition-colors">
                <ArrowLeft size={14} />
                Back to all bulletins
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-5">

            {/* Quick info card */}
            <Card className="p-5">
              <h3 className="font-semibold text-gray-800 text-sm mb-3">Post details</h3>
              <div className="space-y-2.5">
                {[
                  { label: 'Type', value: TYPE_LABELS[post.type] || post.type },
                  { label: 'Status', value: post.status },
                  { label: 'Published', value: post.publishedAt ? formatDate(post.publishedAt) : 'Not published' },
                  { label: 'Author', value: post.authorName || 'NUC' },
                  { label: 'Views', value: post.viewCount?.toLocaleString() },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-start justify-between gap-2 text-sm">
                    <span className="text-gray-400 shrink-0">{label}</span>
                    <span className="text-gray-700 font-medium text-right">{value}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Related posts */}
            {relatedPosts && relatedPosts.length > 0 && (
              <Card className="p-5">
                <h3 className="font-semibold text-gray-800 text-sm mb-3">Related posts</h3>
                <div className="space-y-3">
                  {relatedPosts.map((related: any) => (
                    <Link
                      key={related.id}
                      href={`/bulletins/${related.slug}`}
                      className="block group"
                    >
                      <div className="text-sm font-medium text-gray-800 group-hover:text-brand-600 transition-colors line-clamp-2 leading-tight">
                        {related.title}
                      </div>
                      {related.publishedAt && (
                        <div className="text-xs text-gray-400 mt-1">
                          {formatDate(related.publishedAt)}
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
                <Link href="/bulletins" className="block mt-4 text-xs text-brand-600 hover:text-brand-700 font-medium">
                  View all bulletins →
                </Link>
              </Card>
            )}

            {/* Share card */}
            <Card className="p-5">
              <h3 className="font-semibold text-gray-800 text-sm mb-3">Share this post</h3>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href)
                  alert('Link copied!')
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 hover:text-brand-600 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Share2 size={14} />
                Copy link
              </button>
            </Card>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
