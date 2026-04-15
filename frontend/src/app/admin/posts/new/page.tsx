'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { postsApi } from '@/lib/api'
import { Button, Input, Select, Card } from '@/components/ui'
import toast from 'react-hot-toast'

export default function NewPostPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [form, setForm] = useState({
    title: '', excerpt: '', content: '', type: 'BULLETIN',
    status: 'PUBLISHED', authorName: '', featuredImage: '',
  })

  const mutation = useMutation({
    mutationFn: (data: any) => postsApi.create(data),
    onSuccess: () => {
      toast.success('Post published successfully')
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      router.push('/admin/posts')
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to publish post'),
  })

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="p-6 sm:p-8 max-w-3xl">
      <div className="mb-6">
        <Link href="/admin/posts" className="text-sm text-brand-600 hover:text-brand-700">← Back to posts</Link>
      </div>
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-6">Publish new bulletin</h1>

      <div className="space-y-5">
        <Card className="p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Post details</h2>
          <div className="space-y-4">
            <Input label="Title *" placeholder="e.g. NUC Releases 2024 Accreditation Results" value={form.title} onChange={e => set('title', e.target.value)} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select label="Type" value={form.type} onChange={e => set('type', e.target.value)}>
                <option value="BULLETIN">Bulletin</option>
                <option value="NEWS">News</option>
                <option value="PRESS_RELEASE">Press Release</option>
                <option value="CIRCULAR">Circular</option>
                <option value="ANNOUNCEMENT">Announcement</option>
              </Select>
              <Select label="Status" value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="PUBLISHED">Published (live now)</option>
                <option value="DRAFT">Draft (save for later)</option>
              </Select>
            </div>

            <Input label="Author name" placeholder="e.g. NUC Communications" value={form.authorName} onChange={e => set('authorName', e.target.value)} />
            <Input label="Featured image URL (optional)" placeholder="https://..." value={form.featuredImage} onChange={e => set('featuredImage', e.target.value)} />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Excerpt (short summary)</label>
              <textarea
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 h-20 resize-none"
                placeholder="One or two sentences summarising the post..."
                value={form.excerpt}
                onChange={e => set('excerpt', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full content *</label>
              <textarea
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 h-64 resize-none"
                placeholder="Write the full bulletin or news content here..."
                value={form.content}
                onChange={e => set('content', e.target.value)}
              />
            </div>
          </div>
        </Card>

        <div className="flex gap-3">
          <Button onClick={() => mutation.mutate(form)} loading={mutation.isPending} disabled={!form.title || !form.content} size="lg">
            {form.status === 'PUBLISHED' ? 'Publish now' : 'Save as draft'}
          </Button>
          <Button variant="outline" size="lg" onClick={() => router.push('/admin/posts')}>Cancel</Button>
        </div>
      </div>
    </div>
  )
}
