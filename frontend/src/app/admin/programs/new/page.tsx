'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { universitiesApi, programsApi } from '@/lib/api'
import { Button, Input, Select, Card } from '@/components/ui'
import toast from 'react-hot-toast'

export default function NewProgramPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [form, setForm] = useState({
    name: '', universityId: '', degreeType: 'BSC', duration: '', description: '',
  })

  const { data: universities } = useQuery({
    queryKey: ['universities-list'],
    queryFn: () => universitiesApi.getAll({ limit: 300 }),
    select: (res) => res.data.data,
  })

  const mutation = useMutation({
    mutationFn: (data: any) => programsApi.create(data),
    onSuccess: () => {
      toast.success('Program created successfully')
      queryClient.invalidateQueries({ queryKey: ['admin-programs'] })
      router.push('/admin/accreditation')
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to create program'),
  })

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="p-6 sm:p-8 max-w-2xl">
      <div className="mb-6">
        <Link href="/admin/accreditation" className="text-sm text-brand-600 hover:text-brand-700">← Back</Link>
      </div>
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-6">Add new program</h1>

      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">University *</label>
            <select
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              value={form.universityId}
              onChange={e => set('universityId', e.target.value)}
            >
              <option value="">Select university...</option>
              {(universities || []).map((u: any) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>

          <Input label="Program name *" placeholder="e.g. Computer Science" value={form.name} onChange={e => set('name', e.target.value)} />

          <Select label="Degree type *" value={form.degreeType} onChange={e => set('degreeType', e.target.value)}>
            {['BSC','BA','BENG','BTECH','LLB','MBBS','BPHARM','MSC','MA','MBA','MENG','LLM','PHD','HND','OND'].map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </Select>

          <Input label="Duration (years)" placeholder="e.g. 4" type="number" value={form.duration} onChange={e => set('duration', e.target.value)} />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description (optional)</label>
            <textarea
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 h-24 resize-none"
              placeholder="Brief description of this program..."
              value={form.description}
              onChange={e => set('description', e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button onClick={() => mutation.mutate(form)} loading={mutation.isPending} disabled={!form.name || !form.universityId}>
              Create program
            </Button>
            <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
