'use client'
// frontend/src/app/profile/setup/page.tsx
// Staff members fill their own profile after signing up

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PublicLayout from '@/components/layout/PublicLayout'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/store'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://nuc-platform-production.up.railway.app'

export default function StaffProfileSetupPage() {
  const router = useRouter()
  const { user } = useAuthStore()

  const [directorates, setDirectorates]   = useState<any[]>([])
  const [selectedDir, setSelectedDir]     = useState('')
  const [divisions, setDivisions]         = useState<any[]>([])
  const [selectedDiv, setSelectedDiv]     = useState('')
  const [title, setTitle]                 = useState('')
  const [phone, setPhone]                 = useState('')
  const [bio, setBio]                     = useState('')
  const [photoUrl, setPhotoUrl]           = useState('')
  const [linkedin, setLinkedin]           = useState('')
  const [isPublic, setIsPublic]           = useState(true)
  const [saving, setSaving]               = useState(false)
  const [saved, setSaved]                 = useState(false)
  const [error, setError]                 = useState('')
  const [loading, setLoading]             = useState(true)

  useEffect(() => {
    // Load directorates with divisions
    api.get('/directorates').then(res => {
      const dirs = res.data?.data || []
      setDirectorates(dirs)
    }).catch(() => {}).finally(() => setLoading(false))

    // Load existing profile if any
    api.get('/staff/profile').then(res => {
      const staff = res.data?.data
      if (staff) {
        setTitle(staff.title || '')
        setPhone(staff.phone || '')
        setBio(staff.bio || '')
        setPhotoUrl(staff.photoUrl || '')
        setLinkedin(staff.linkedin || '')
        setIsPublic(staff.isPublic !== false)
        setSelectedDiv(staff.divisionId || '')
        setSelectedDir(staff.division?.directorateId || '')
      }
    }).catch(() => {})
  }, [])

  useEffect(() => {
    if (selectedDir) {
      const dir = directorates.find(d => d.id === selectedDir)
      setDivisions(dir?.divisions || [])
      setSelectedDiv('')
    }
  }, [selectedDir, directorates])

  async function handleSave() {
    if (!selectedDiv) { setError('Please select your division'); return }
    setSaving(true)
    setError('')
    try {
      await api.post('/staff/profile', {
        divisionId: selectedDiv,
        title, phone, bio, photoUrl, linkedin, isPublic,
      })
      setSaved(true)
      setTimeout(() => router.push('/directorates'), 1500)
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  if (!user) return (
    <PublicLayout>
      <div style={{ maxWidth: 480, margin: '80px auto', textAlign: 'center', padding: '0 20px' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', marginBottom: 8 }}>Sign in required</h2>
        <p style={{ color: '#6b7280', marginBottom: 20 }}>You need to be signed in as NUC staff to set up your profile.</p>
        <Link href="/auth/login" style={{ background: '#1d4ed8', color: '#fff', padding: '10px 24px', borderRadius: 10, textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
          Sign in
        </Link>
      </div>
    </PublicLayout>
  )

  return (
    <PublicLayout>
      <div style={{ maxWidth: 620, margin: '0 auto', padding: '48px 20px 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#eff6ff', color: '#1d4ed8', fontSize: 12, fontWeight: 600,
            padding: '4px 12px', borderRadius: 20, marginBottom: 12,
          }}>
            NUC Staff Portal
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#111827', margin: '0 0 8px' }}>
            Set up your staff profile
          </h1>
          <p style={{ fontSize: 14, color: '#6b7280', margin: 0 }}>
            Fill in your details — your profile will appear automatically on the public directorates page.
          </p>
        </div>

        {/* Form card */}
        <div style={{
          background: '#fff', border: '1px solid #f1f5f9',
          borderRadius: 20, padding: 28,
          boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        }}>

          {/* Name display — from account */}
          <div style={{ marginBottom: 20, padding: '12px 16px', background: '#f9fafb', borderRadius: 12 }}>
            <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 3 }}>Your name (from account)</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>
              {user.firstName} {user.lastName}
            </div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>{user.email}</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* Directorate */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                Directorate <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                value={selectedDir}
                onChange={e => setSelectedDir(e.target.value)}
                style={{
                  width: '100%', padding: '11px 14px', border: '1.5px solid #e5e7eb',
                  borderRadius: 10, fontSize: 14, color: '#111827', background: '#fff',
                  outline: 'none', boxSizing: 'border-box',
                }}
              >
                <option value="">Select your directorate...</option>
                {directorates.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            {/* Division */}
            {selectedDir && (
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                  Division <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  value={selectedDiv}
                  onChange={e => setSelectedDiv(e.target.value)}
                  style={{
                    width: '100%', padding: '11px 14px', border: '1.5px solid #e5e7eb',
                    borderRadius: 10, fontSize: 14, color: '#111827', background: '#fff',
                    outline: 'none', boxSizing: 'border-box',
                  }}
                >
                  <option value="">Select your division...</option>
                  {divisions.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Job title */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                Job title
              </label>
              <input
                type="text"
                placeholder="e.g. Deputy Director, Accreditation"
                value={title}
                onChange={e => setTitle(e.target.value)}
                style={{
                  width: '100%', padding: '11px 14px', border: '1.5px solid #e5e7eb',
                  borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Phone */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                Phone number
              </label>
              <input
                type="tel"
                placeholder="e.g. +234 803 000 0000"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                style={{
                  width: '100%', padding: '11px 14px', border: '1.5px solid #e5e7eb',
                  borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Bio */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                Short bio
              </label>
              <textarea
                placeholder="Brief description of your role and background..."
                value={bio}
                onChange={e => setBio(e.target.value)}
                rows={3}
                style={{
                  width: '100%', padding: '11px 14px', border: '1.5px solid #e5e7eb',
                  borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box',
                  resize: 'vertical', fontFamily: 'inherit',
                }}
              />
            </div>

            {/* Photo URL */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                Photo URL
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={photoUrl}
                onChange={e => setPhotoUrl(e.target.value)}
                style={{
                  width: '100%', padding: '11px 14px', border: '1.5px solid #e5e7eb',
                  borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>

            {/* LinkedIn */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                LinkedIn profile URL
              </label>
              <input
                type="url"
                placeholder="https://linkedin.com/in/..."
                value={linkedin}
                onChange={e => setLinkedin(e.target.value)}
                style={{
                  width: '100%', padding: '11px 14px', border: '1.5px solid #e5e7eb',
                  borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Visibility toggle */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 16px', background: '#f9fafb', borderRadius: 12,
            }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Show profile publicly</div>
                <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>
                  Your profile appears on the NUC directorates page
                </div>
              </div>
              <div
                onClick={() => setIsPublic(!isPublic)}
                style={{
                  width: 44, height: 24, borderRadius: 12, cursor: 'pointer',
                  background: isPublic ? '#1d4ed8' : '#d1d5db',
                  position: 'relative', transition: 'background .2s', flexShrink: 0,
                }}
              >
                <div style={{
                  width: 18, height: 18, borderRadius: '50%', background: '#fff',
                  position: 'absolute', top: 3,
                  left: isPublic ? 23 : 3,
                  transition: 'left .2s',
                }} />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#dc2626' }}>
                {error}
              </div>
            )}

            {/* Success */}
            {saved && (
              <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#166534' }}>
                ✅ Profile saved! Redirecting to directorates page...
              </div>
            )}

            {/* Save button */}
            <button
              onClick={handleSave}
              disabled={saving || !selectedDiv}
              style={{
                width: '100%', padding: 14, borderRadius: 12, border: 'none',
                background: !selectedDiv || saving ? '#93c5fd' : '#1d4ed8',
                color: '#fff', fontSize: 15, fontWeight: 700,
                cursor: !selectedDiv || saving ? 'not-allowed' : 'pointer',
              }}
            >
              {saving ? 'Saving...' : 'Save profile'}
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link href="/directorates" style={{ fontSize: 13, color: '#9ca3af', textDecoration: 'none' }}>
            View directorates page →
          </Link>
        </div>
      </div>
    </PublicLayout>
  )
}
