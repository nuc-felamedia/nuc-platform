'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function AdminSettingsPage() {
  const [saving, setSaving] = useState(false)

  return (
    <div className="p-6 sm:p-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Platform configuration and administration</p>
      </div>

      <div className="grid grid-cols-1 gap-6 max-w-2xl">

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Platform Information</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500">Platform</span>
              <span className="font-medium text-gray-900">NUC Accreditation Platform</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500">Backend</span>
              <span className="font-medium text-gray-900">Railway (Node.js + Express)</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500">Frontend</span>
              <span className="font-medium text-gray-900">Vercel (Next.js 14)</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500">Database</span>
              <span className="font-medium text-gray-900">PostgreSQL (Railway)</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-500">API URL</span>
              <span className="font-medium text-gray-900 text-xs">nuc-platform-production.up.railway.app</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {[
              { label: 'Manage Universities', href: '/admin/universities', desc: 'View and edit all universities' },
              { label: 'Manage Users', href: '/admin/users', desc: 'Assign roles and university access' },
              { label: 'Manage Posts', href: '/admin/posts', desc: 'Publish bulletins and news' },
              { label: 'Manage Directorates', href: '/admin/directorates', desc: 'Update directorate information' },
            ].map(item => (
              <a key={item.href} href={item.href}
                className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-brand-200 hover:bg-brand-50 transition-all">
                <div>
                  <div className="text-sm font-medium text-gray-900">{item.label}</div>
                  <div className="text-xs text-gray-400">{item.desc}</div>
                </div>
                <span className="text-gray-300">→</span>
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
