'use client'
// src/components/ui/index.tsx
// All reusable primitive UI components

import { cn } from '@/lib/utils'
import { AccreditationStatus, UniversityType } from '@/types'
import { getAccreditationColor, getAccreditationLabel, getUniversityTypeColor } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { forwardRef } from 'react'

// ── Badge ──────────────────────────────────────────────────────────────────

export function AccreditationBadge({ status }: { status: AccreditationStatus }) {
  const c = getAccreditationColor(status)
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border', c.bg, c.text, c.border)}>
      <span className={cn('w-1.5 h-1.5 rounded-full', c.dot)} />
      {getAccreditationLabel(status)}
    </span>
  )
}

export function UniversityTypeBadge({ type }: { type: UniversityType }) {
  const c = getUniversityTypeColor(type)
  const labels: Record<UniversityType, string> = {
    FEDERAL: 'Federal',
    STATE: 'State',
    PRIVATE: 'Private',
    TRANSNATIONAL: 'Transnational',
    DISTANCE_LEARNING: 'Distance',
    AFFILIATED: 'Affiliated',
  }
  return (
    <span className={cn('inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold', c.bg, c.text)}>
      {labels[type]}
    </span>
  )
}

// ── Button ─────────────────────────────────────────────────────────────────

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => {
    const variants = {
      primary: 'bg-brand-600 text-white hover:bg-brand-700 border-brand-600',
      secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 border-gray-200',
      outline: 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50',
      ghost: 'bg-transparent text-gray-600 hover:bg-gray-50 border-transparent',
      danger: 'bg-red-600 text-white hover:bg-red-700 border-red-600',
    }
    const sizes = {
      sm: 'px-3 py-1.5 text-xs rounded-lg',
      md: 'px-4 py-2 text-sm rounded-lg',
      lg: 'px-6 py-2.5 text-base rounded-xl',
    }
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium border transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed',
          variants[variant], sizes[size], className
        )}
        {...props}
      >
        {loading && <Loader2 size={14} className="animate-spin" />}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'

// ── Input ──────────────────────────────────────────────────────────────────

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }>(
  ({ className, label, error, id, ...props }, ref) => (
    <div className="w-full">
      {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>}
      <input
        ref={ref}
        id={id}
        className={cn(
          'w-full px-3.5 py-2.5 text-sm border rounded-lg bg-white text-gray-900 placeholder-gray-400 transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent',
          error ? 'border-red-300' : 'border-gray-200 hover:border-gray-300',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
)
Input.displayName = 'Input'

// ── Select ─────────────────────────────────────────────────────────────────

export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string }>(
  ({ className, label, id, children, ...props }, ref) => (
    <div className="w-full">
      {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>}
      <select
        ref={ref}
        id={id}
        className={cn(
          'w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent hover:border-gray-300',
          className
        )}
        {...props}
      >
        {children}
      </select>
    </div>
  )
)
Select.displayName = 'Select'

// ── Card ───────────────────────────────────────────────────────────────────

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('bg-white rounded-2xl border border-gray-100 shadow-sm', className)}>
      {children}
    </div>
  )
}

// ── Spinner ────────────────────────────────────────────────────────────────

export function Spinner({ size = 20 }: { size?: number }) {
  return <Loader2 size={size} className="animate-spin text-brand-600" />
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-64">
      <Spinner size={32} />
    </div>
  )
}

// ── Stat card ──────────────────────────────────────────────────────────────

export function StatCard({ label, value, sub, color = 'gray' }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{label}</p>
      <p className={cn('text-3xl font-bold font-display', `text-${color}-700`)}>{value.toLocaleString()}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}

// ── Empty state ────────────────────────────────────────────────────────────

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="text-center py-16">
      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl">🔍</span>
      </div>
      <h3 className="text-gray-800 font-semibold mb-1">{title}</h3>
      {description && <p className="text-gray-500 text-sm mb-4">{description}</p>}
      {action}
    </div>
  )
}

// ── Pagination ─────────────────────────────────────────────────────────────

export function Pagination({
  page, totalPages, onPage,
}: { page: number; totalPages: number; onPage: (p: number) => void }) {
  if (totalPages <= 1) return null
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
    if (totalPages <= 5) return i + 1
    if (page <= 3) return i + 1
    if (page >= totalPages - 2) return totalPages - 4 + i
    return page - 2 + i
  })

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      <button
        onClick={() => onPage(page - 1)}
        disabled={page === 1}
        className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
      >
        ← Prev
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPage(p)}
          className={cn(
            'w-9 h-9 text-sm rounded-lg border transition-colors',
            p === page ? 'bg-brand-600 text-white border-brand-600' : 'hover:bg-gray-50'
          )}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onPage(page + 1)}
        disabled={page === totalPages}
        className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
      >
        Next →
      </button>
    </div>
  )
}
