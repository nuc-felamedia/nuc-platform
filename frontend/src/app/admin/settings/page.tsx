'use client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'
import { Database, Bell, RefreshCw, Download, Shield, Globe } from 'lucide-react'

export default function AdminSettingsPage() {
  const [announcement, setAnnouncement] = useState('')
  const [announcementType, setAnnouncementType] = useState('info')
  const [saving, setSaving] = useState(false)

  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => api.get('/admin/dashboard'),
    select: (res) => res.data.data,
  })

  const summary = stats?.summary

  return (
    <div className="p-6 sm:p-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Platform configuration and administration tools</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Database Stats */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
              <Database size={18} className="text-blue-600" />
            </div>
            <h2 className="font-semibold text-gray-900">Database Statistics</h2>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Universities', value: 309, sub: '315 in DB, 309 official' },
              { label: 'Academic Programs', value: summary?.totalPrograms?.toLocaleString() || '5,357' },
              { label: 'Accreditation Records', value: summary?.totalAccreditations?.toLocaleString() || '4,193' },
              { label: 'Registered Users', value: summary?.totalUsers || '—' },
              { label: 'Bulletins & Posts', value: '786' },
              { label: 'Directorates', value: '13' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                <div>
                  <div className="text-sm font-medium text-gray-700">{item.label}</div>
                  {item.sub && <div className="text-xs text-gray-400">{item.sub}</div>}
                </div>
                <span className="font-bold text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Info */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
              <Globe size={18} className="text-green-600" />
            </div>
            <h2 className="font-semibold text-gray-900">Platform Information</h2>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Platform', value: 'NUC Accreditation Platform' },
              { label: 'Frontend', value: 'Next.js 14 on Vercel' },
              { label: 'Backend', value: 'Node.js + Express on Railway' },
              { label: 'Database', value: 'PostgreSQL on Railway' },
              { label: 'Frontend URL', value: 'nuc-platform.vercel.app' },
              { label: 'API URL', value: 'nuc-platform-production.up.railway.app' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-500">{item.label}</span>
                <span className="text-sm font-medium text-gray-900 text-right max-w-48 truncate">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Announcement Banner */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
              <Bell size={18} className="text-amber-600" />
            </div>
            <h2 className="font-semibold text-gray-900">Site Announcement</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">Display a banner message at the top of the platform for all users.</p>
          <div className="space-y-3">
            <select value={announcementType} onChange={e => setAnnouncementType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
              <option value="info">ℹ️ Information</option>
              <option value="warning">⚠️ Warning</option>
              <option value="success">✅ Success</option>
            </select>
            <textarea
              value={announcement}
              onChange={e => setAnnouncement(e.target.value)}
              placeholder="Enter announcement message e.g. 'NUC accreditation results for 2025 are now available.'"
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            />
            <div className="flex gap-3">
              <button onClick={async () => {
                if (!announcement.trim()) { toast.error('Enter a message first'); return }
                setSaving(true)
                try {
                  await api.put('/admin/settings', { key: 'announcement', value: JSON.stringify({ message: announcement, type: announcementType }) })
                  toast.success('Announcement published!')
                } catch { toast.error('Failed to publish') }
                setSaving(false)
              }}
                className="flex-1 py-2 bg-brand-600 text-white rounded-xl text-sm font-medium hover:bg-brand-700 transition-colors">
                {saving ? 'Publishing...' : 'Publish announcement'}
              </button>
              <button onClick={() => setAnnouncement('')}
                className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center">
              <Shield size={18} className="text-purple-600" />
            </div>
            <h2 className="font-semibold text-gray-900">Admin Actions</h2>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Manage Universities', desc: 'View, edit and add universities', href: '/admin/universities', color: 'text-blue-600 bg-blue-50' },
              { label: 'Manage Users', desc: 'Assign roles and university access', href: '/admin/users', color: 'text-green-600 bg-green-50' },
              { label: 'Manage Directorates', desc: 'Update directorate and staff info', href: '/admin/directorates', color: 'text-purple-600 bg-purple-50' },
              { label: 'Publish Bulletin', desc: 'Create and publish news or circular', href: '/admin/posts', color: 'text-amber-600 bg-amber-50' },
              { label: 'View Accreditation', desc: 'Search and manage accreditation records', href: '/admin/accreditation', color: 'text-red-600 bg-red-50' },
            ].map(item => (
              <a key={item.href} href={item.href}
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-brand-200 hover:bg-brand-50 transition-all group">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${item.color}`}>
                  →
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 group-hover:text-brand-700">{item.label}</div>
                  <div className="text-xs text-gray-400">{item.desc}</div>
                </div>
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
