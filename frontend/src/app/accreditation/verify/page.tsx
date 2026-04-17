'use client'
// src/app/accreditation/verify/page.tsx
import { useState, useEffect, useRef } from 'react'
import { CheckCircle2, XCircle, Clock, AlertCircle, Search } from 'lucide-react'
import PublicLayout from '@/components/layout/PublicLayout'
import { Button, Card } from '@/components/ui'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://nuc-platform-production.up.railway.app'

function AutocompleteInput({
  label, placeholder, value, onChange, suggestions, onSelect, loading
}: {
  label: string
  placeholder: string
  value: string
  onChange: (val: string) => void
  suggestions: { id: string; label: string; sub?: string }[]
  onSelect: (item: { id: string; label: string; sub?: string }) => void
  loading?: boolean
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={e => { onChange(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          style={{
            width: '100%', padding: '11px 40px 11px 14px',
            border: '1.5px solid #e5e7eb', borderRadius: 10,
            fontSize: 14, color: '#111827', outline: 'none',
            boxSizing: 'border-box', background: '#fff',
            transition: 'border-color .15s',
          }}
          onMouseOver={e => (e.currentTarget.style.borderColor = '#93c5fd')}
          onMouseOut={e => (e.currentTarget.style.borderColor = open ? '#3b82f6' : '#e5e7eb')}
        />
        {loading ? (
          <div style={{
            position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
            width: 16, height: 16, border: '2px solid #e5e7eb', borderTopColor: '#3b82f6',
            borderRadius: '50%', animation: 'spin .8s linear infinite',
          }} />
        ) : (
          <Search size={16} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
        )}
      </div>

      {open && suggestions.length > 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
          background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10,
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)', marginTop: 4,
          maxHeight: 280, overflowY: 'auto',
        }}>
          {suggestions.map((s, i) => (
            <div
              key={s.id}
              onMouseDown={() => { onSelect(s); setOpen(false) }}
              style={{
                padding: '10px 14px', cursor: 'pointer',
                borderBottom: i < suggestions.length - 1 ? '1px solid #f9fafb' : 'none',
                transition: 'background .1s',
              }}
              onMouseOver={e => (e.currentTarget.style.background = '#eff6ff')}
              onMouseOut={e => (e.currentTarget.style.background = '#fff')}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{s.label}</div>
              {s.sub && <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{s.sub}</div>}
            </div>
          ))}
        </div>
      )}

      {open && value.length > 1 && suggestions.length === 0 && !loading && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
          background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10,
          padding: '12px 14px', marginTop: 4, fontSize: 13, color: '#9ca3af',
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
        }}>
          No results found for "{value}"
        </div>
      )}
    </div>
  )
}

const STATUS_CONFIG: Record<string, { icon: any; title: string; desc: string; bg: string; border: string; iconColor: string }> = {
  FULL:    { icon: CheckCircle2, title: 'Fully Accredited',       desc: 'This program holds full NUC accreditation and is approved for study.', bg: '#f0fdf4', border: '#86efac', iconColor: '#22c55e' },
  INTERIM: { icon: Clock,        title: 'Interim Accreditation',  desc: 'This program has interim accreditation and is currently under NUC review.', bg: '#fefce8', border: '#fde047', iconColor: '#eab308' },
  DENIED:  { icon: XCircle,      title: 'Accreditation Denied',   desc: 'This program does not currently hold NUC accreditation.', bg: '#fef2f2', border: '#fca5a5', iconColor: '#ef4444' },
  PENDING: { icon: AlertCircle,  title: 'Pending Assessment',     desc: 'This program has not yet been assessed by NUC.', bg: '#f9fafb', border: '#e5e7eb', iconColor: '#9ca3af' },
}

export default function VerifyPage() {
  const [uniQuery, setUniQuery] = useState('')
  const [selectedUni, setSelectedUni] = useState<{ id: string; label: string; slug: string } | null>(null)
  const [uniSuggestions, setUniSuggestions] = useState<any[]>([])
  const [uniLoading, setUniLoading] = useState(false)

  const [progQuery, setProgQuery] = useState('')
  const [selectedProg, setSelectedProg] = useState<{ id: string; label: string; sub?: string } | null>(null)
  const [progSuggestions, setProgSuggestions] = useState<any[]>([])
  const [progLoading, setProgLoading] = useState(false)

  const [result, setResult] = useState<any>(null)
  const [checking, setChecking] = useState(false)
  const [notFound, setNotFound] = useState(false)

  // Search universities as user types
  useEffect(() => {
    if (uniQuery.length < 2) { setUniSuggestions([]); return }
    setUniLoading(true)
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${API}/api/v1/universities?q=${encodeURIComponent(uniQuery)}&limit=8`)
        const data = await res.json()
        setUniSuggestions((data.data?.data || []).map((u: any) => ({
          id: u.id, label: u.name, sub: `${u.state} · ${u.type}`, slug: u.slug
        })))
      } catch { setUniSuggestions([]) }
      finally { setUniLoading(false) }
    }, 250)
    return () => clearTimeout(timer)
  }, [uniQuery])

  // Search programs as user types — filtered to selected university
  useEffect(() => {
    if (progQuery.length < 2) { setProgSuggestions([]); return }
    setProgLoading(true)
    const timer = setTimeout(async () => {
      try {
        const uniParam = selectedUni ? `&universityId=${selectedUni.id}` : ''
        const res = await fetch(`${API}/api/v1/accreditation?q=${encodeURIComponent(progQuery)}${uniParam}&limit=10`)
        const data = await res.json()
        const seen = new Set()
        const suggestions = (data.data?.data || [])
          .filter((r: any) => {
            const key = r.program?.id
            if (seen.has(key)) return false
            seen.add(key)
            return true
          })
          .map((r: any) => ({
            id: r.program?.id,
            label: r.program?.name,
            sub: `${r.program?.faculty?.name || ''} · ${r.program?.degreeType || ''} · ${r.status}`,
            programId: r.program?.id,
            status: r.status,
          }))
        setProgSuggestions(suggestions)
      } catch { setProgSuggestions([]) }
      finally { setProgLoading(false) }
    }, 250)
    return () => clearTimeout(timer)
  }, [progQuery, selectedUni])

  async function handleCheck() {
    if (!selectedProg) return
    setChecking(true)
    setResult(null)
    setNotFound(false)
    try {
      const res = await fetch(`${API}/api/v1/accreditation/history/${selectedProg.id}`)
      const data = await res.json()
      if (data.success) setResult(data.data)
      else setNotFound(true)
    } catch { setNotFound(true) }
    finally { setChecking(false) }
  }

  const currentAcc = result?.history?.find((h: any) => h.isCurrent) || result?.history?.[result.history.length - 1]
  const cfg = currentAcc ? STATUS_CONFIG[currentAcc.status] : null

  return (
    <PublicLayout>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '60px 20px 80px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, background: '#eff6ff',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
          }}>
            <Search size={28} color="#1d4ed8" />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111827', margin: '0 0 8px' }}>
            Verify Accreditation
          </h1>
          <p style={{ fontSize: 15, color: '#6b7280', margin: 0 }}>
            Start typing a university or program name — results appear instantly
          </p>
        </div>

        {/* Search card */}
        <div style={{
          background: '#fff', border: '1px solid #f1f5f9', borderRadius: 20,
          padding: '24px', marginBottom: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AutocompleteInput
              label="University"
              placeholder="Type university name e.g. University of Lagos..."
              value={uniQuery}
              onChange={v => { setUniQuery(v); setSelectedUni(null); setResult(null) }}
              suggestions={uniSuggestions}
              loading={uniLoading}
              onSelect={item => {
                setSelectedUni({ id: item.id, label: item.label, slug: (item as any).slug })
                setUniQuery(item.label)
                setUniSuggestions([])
              }}
            />

            <AutocompleteInput
              label="Program"
              placeholder={selectedUni ? `Type program name at ${selectedUni.label.split(',')[0]}...` : 'Type program name e.g. Computer Science...'}
              value={progQuery}
              onChange={v => { setProgQuery(v); setSelectedProg(null); setResult(null) }}
              suggestions={progSuggestions}
              loading={progLoading}
              onSelect={item => {
                setSelectedProg(item)
                setProgQuery(item.label)
                setProgSuggestions([])
              }}
            />

            <button
              onClick={handleCheck}
              disabled={!selectedProg || checking}
              style={{
                width: '100%', padding: '13px', borderRadius: 12, border: 'none',
                background: !selectedProg || checking ? '#93c5fd' : '#1d4ed8',
                color: '#fff', fontSize: 15, fontWeight: 700,
                cursor: !selectedProg || checking ? 'not-allowed' : 'pointer',
                transition: 'background .2s',
              }}
            >
              {checking ? 'Checking...' : 'Check accreditation status'}
            </button>
          </div>
        </div>

        {/* Hint */}
        {!result && !notFound && (
          <div style={{ textAlign: 'center', fontSize: 12, color: '#9ca3af' }}>
            Type at least 2 characters to see suggestions · Results come from NUC's official database
          </div>
        )}

        {/* Result */}
        {result && cfg && (() => {
          const Icon = cfg.icon
          const prog = result.program
          const uni = prog?.university
          return (
            <div style={{
              background: cfg.bg, border: `2px solid ${cfg.border}`,
              borderRadius: 20, padding: '32px 24px', textAlign: 'center',
            }}>
              <Icon size={52} color={cfg.iconColor} style={{ marginBottom: 12 }} />
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111827', margin: '0 0 8px' }}>
                {cfg.title}
              </h2>
              <p style={{ fontSize: 14, color: '#6b7280', margin: '0 0 24px' }}>{cfg.desc}</p>

              <div style={{
                background: '#fff', borderRadius: 14, border: '1px solid #e5e7eb',
                overflow: 'hidden', textAlign: 'left', marginBottom: 20,
              }}>
                {[
                  ['University', uni?.name],
                  ['Program', prog?.name],
                  ['Degree type', prog?.degreeType],
                  ['Faculty', prog?.faculty?.name || '—'],
                  ['Current status', currentAcc?.status],
                  ['Year assessed', currentAcc?.year],
                  ['Valid until', currentAcc?.expiryDate ? new Date(currentAcc.expiryDate).getFullYear() : '—'],
                  ['Total exercises', result.stats?.total],
                ].map(([label, value], i, arr) => (
                  <div key={String(label)} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '11px 16px',
                    borderBottom: i < arr.length - 1 ? '1px solid #f9fafb' : 'none',
                  }}>
                    <span style={{ fontSize: 13, color: '#6b7280' }}>{label}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{String(value || '—')}</span>
                  </div>
                ))}
              </div>

              <Link
                href={`/accreditation/program/${prog?.id}`}
                style={{
                  display: 'inline-block', padding: '11px 24px',
                  background: '#1d4ed8', color: '#fff', borderRadius: 10,
                  fontSize: 13, fontWeight: 700, textDecoration: 'none',
                }}
              >
                View full accreditation history →
              </Link>
            </div>
          )
        })()}

        {/* Not found */}
        {notFound && (
          <div style={{
            background: '#fef2f2', border: '1px solid #fca5a5',
            borderRadius: 20, padding: '32px 24px', textAlign: 'center',
          }}>
            <XCircle size={40} color="#ef4444" style={{ marginBottom: 12 }} />
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#991b1b', margin: '0 0 8px' }}>Program not found</h3>
            <p style={{ fontSize: 14, color: '#dc2626', margin: 0 }}>
              No accreditation record found. Try selecting from the suggestions dropdown.
            </p>
          </div>
        )}
      </div>
    </PublicLayout>
  )
}
