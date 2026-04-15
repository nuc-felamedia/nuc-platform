// src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { AccreditationStatus, UniversityType } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date(date))
}

export function formatDateShort(date: string | Date) {
  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric', month: 'short', year: 'numeric',
  }).format(new Date(date))
}

export function getAccreditationColor(status: AccreditationStatus) {
  switch (status) {
    case 'FULL': return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200', dot: 'bg-green-500' }
    case 'INTERIM': return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200', dot: 'bg-yellow-500' }
    case 'DENIED': return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200', dot: 'bg-red-500' }
    case 'PENDING': return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200', dot: 'bg-gray-400' }
    default: return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200', dot: 'bg-gray-400' }
  }
}

export function getAccreditationLabel(status: AccreditationStatus) {
  switch (status) {
    case 'FULL': return 'Full accreditation'
    case 'INTERIM': return 'Interim'
    case 'DENIED': return 'Denied'
    case 'PENDING': return 'Pending'
    case 'NOT_YET_ACCREDITED': return 'Not yet accredited'
    default: return status
  }
}

export function getUniversityTypeColor(type: UniversityType) {
  switch (type) {
    case 'FEDERAL': return { bg: 'bg-blue-100', text: 'text-blue-800' }
    case 'STATE': return { bg: 'bg-purple-100', text: 'text-purple-800' }
    case 'PRIVATE': return { bg: 'bg-amber-100', text: 'text-amber-800' }
    case 'TRANSNATIONAL': return { bg: 'bg-teal-100', text: 'text-teal-800' }
    default: return { bg: 'bg-gray-100', text: 'text-gray-700' }
  }
}

export function getUniversityInitials(name: string) {
  return name.split(' ')
    .filter(w => w.length > 2)
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase()
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function debounce<T extends (...args: any[]) => any>(fn: T, delay: number) {
  let timer: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}
