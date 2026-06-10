'use client'
import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'
import { Plus, Eye } from 'lucide-react'
import Link from 'next/link'

const EMPTY = { title: '', subtitle: '', image: '', buttonText: 'Learn more', buttonLink: '/' }

export default function AdminCarouselPage() {
  const qc = useQueryClient()
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState<any>(EMPTY)

  const { data: slides = [], isLoading } = useQuery({
    queryKey: ['carousel-slides'],
    queryFn: async () => {
      const r = await api.get('/admin/settings')
      const val = r.data.data?.carousel_slides
      return val ? JSON.parse(val) : []
    },
  })

  async function save() {
    try {
      let updated
      if (editing === 'new') {
        updated = [...slides, { ...form, id: Date.now().toString() }]
      } else {
        updated = slides.map((s: any) => s.id === editing ? { ...s, ...form } : s)
      }
      await api.put('/admin/settings', { key: 'carousel_slides', value: JSON.stringify(updated) })
      qc.invalidateQueries({ queryKey: ['carousel-slides'] })
      toast.success('Saved!')
      setEditing(null)
      setForm(EMPTY)
    } catch { toast.error('Failed to save') }
  }

  async function deleteSlide(id: string) {
    if (!confirm('Delete this slide?')) return
    const updated = slides.filter((s: any) => s.id !== id)
    await api.put('/admin/settings', { key: 'carousel_slides', value: JSON.stringify(updated) })
    qc.invalidateQueries({ queryKey: ['carousel-slides'] })
    toast.success('Deleted')
  }

  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Homepage Carousel</h1>
          <p className="text-gray-500 text-sm mt-1">Manage the hero slideshow on the homepage</p>
        </div>
        <div className="flex gap-3">
          <Link href="/" target="_blank" className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">
            <Eye size={15} /> Preview
          </Link>
          <button onClick={() => { setEditing('new'); setForm(EMPTY) }}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl text-sm font-medium hover:bg-brand-700">
            <Plus size={15} /> Add slide
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? <p className="text-gray-400 text-sm">Loading...</p> :
         slides.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <div className="text-4xl mb-3">🖼️</div>
            <p className="text-gray-500 mb-4">No slides yet. The carousel uses default slides.</p>
            <button onClick={() => { setEditing('new'); setForm(EMPTY) }}
              className="px-4 py-2 bg-brand-600 text-white rounded-xl text-sm font-medium">
              + Add first slide
            </button>
          </div>
         ) : slides.map((slide: any, i: number) => (
          <div key={slide.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex">
            <div className="w-44 h-28 shrink-0 relative overflow-hidden bg-gray-100">
              {slide.image && <img src={slide.image} alt="" className="w-full h-full object-cover" />}
              <div className="absolute inset-0 bg-green-900/50 flex items-end p-2">
                <span className="text-white text-xs font-semibold truncate">{slide.title}</span>
              </div>
            </div>
            <div className="flex-1 p-4">
              <div className="font-semibold text-gray-900 mb-1">{slide.title}</div>
              <div className="text-sm text-gray-500 line-clamp-1 mb-2">{slide.subtitle}</div>
              <div className="text-xs text-gray-400">{slide.buttonText} → {slide.buttonLink}</div>
            </div>
            <div className="flex flex-col gap-2 justify-center px-4 border-l border-gray-50">
              <button onClick={() => { setEditing(slide.id); setForm({ title: slide.title, subtitle: slide.subtitle, image: slide.image, buttonText: slide.buttonText || '', buttonLink: slide.buttonLink || '/' }) }}
                className="px-3 py-1.5 text-xs font-medium text-brand-600 border border-brand-200 rounded-lg hover:bg-brand-50">Edit</button>
              <button onClick={() => deleteSlide(slide.id)}
                className="px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="font-display text-lg font-bold text-gray-900 mb-5">
              {editing === 'new' ? 'Add new slide' : 'Edit slide'}
            </h2>
            <div className="space-y-4">
              {[
                { key: 'title', label: 'Title', placeholder: 'e.g. National Universities Commission' },
                { key: 'subtitle', label: 'Subtitle', placeholder: 'Short description shown on slide', textarea: true },
                { key: 'image', label: 'Image URL', placeholder: 'https://example.com/image.jpg' },
                { key: 'buttonText', label: 'Button text', placeholder: 'Learn more' },
                { key: 'buttonLink', label: 'Button link', placeholder: '/universities' },
              ].map(field => (
                <div key={field.key}>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">{field.label}</label>
                  {field.textarea ? (
                    <textarea value={form[field.key]} onChange={e => setForm((f: any) => ({ ...f, [field.key]: e.target.value }))}
                      placeholder={field.placeholder} rows={2}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
                  ) : (
                    <input value={form[field.key]} onChange={e => setForm((f: any) => ({ ...f, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                  )}
                  {field.key === 'image' && form.image && (
                    <img src={form.image} alt="preview" className="mt-2 w-full h-28 object-cover rounded-xl border border-gray-100" />
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={save} className="flex-1 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-semibold">Save slide</button>
              <button onClick={() => setEditing(null)} className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
