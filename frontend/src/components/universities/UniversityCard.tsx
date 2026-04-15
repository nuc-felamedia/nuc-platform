'use client'
// src/components/universities/UniversityCard.tsx
import Link from 'next/link'
import { MapPin, Calendar, ExternalLink } from 'lucide-react'
import { University } from '@/types'
import { AccreditationBadge, UniversityTypeBadge } from '@/components/ui'
import { getUniversityInitials, cn } from '@/lib/utils'

export default function UniversityCard({ university }: { university: University }) {
  const { name, slug, type, state, yearEstablished, totalPrograms, accreditationSummary, vcName } = university
  const initials = getUniversityInitials(name)
  const total = (accreditationSummary?.full || 0) + (accreditationSummary?.interim || 0) + (accreditationSummary?.denied || 0) + (accreditationSummary?.pending || 0)

  return (
    <Link href={`/universities/${slug}`} className="group block bg-white rounded-2xl border border-gray-100 hover:border-brand-200 hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-brand-500 to-brand-400" />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-brand-600 flex items-center justify-center text-white font-display font-bold text-sm shrink-0 group-hover:scale-105 transition-transform">
            {initials}
          </div>
          <UniversityTypeBadge type={type} />
        </div>

        <h3 className="font-display font-bold text-gray-900 text-base leading-tight mb-2 group-hover:text-brand-700 transition-colors line-clamp-2">
          {name}
        </h3>

        <div className="flex flex-col gap-1 text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <MapPin size={11} className="text-gray-400" />
            {state} State
          </span>
          {yearEstablished && (
            <span className="flex items-center gap-1">
              <Calendar size={11} className="text-gray-400" />
              Est. {yearEstablished}
            </span>
          )}
        </div>

        {accreditationSummary && total > 0 && (
          <div className="mb-3">
            <div className="flex h-1.5 rounded-full overflow-hidden gap-px mb-1">
              <div className="bg-green-400 rounded-l-full" style={{ flex: accreditationSummary.full }} />
              <div className="bg-yellow-400" style={{ flex: accreditationSummary.interim }} />
              <div className="bg-red-400 rounded-r-full" style={{ flex: accreditationSummary.denied }} />
            </div>
            <div className="flex gap-2 text-xs text-gray-400">
              <span>{accreditationSummary.full} full</span>
              {accreditationSummary.interim > 0 && <span>{accreditationSummary.interim} interim</span>}
              {accreditationSummary.denied > 0 && <span>{accreditationSummary.denied} denied</span>}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-400">{totalPrograms || 0} programs</span>
          <span className="text-xs text-brand-600 group-hover:translate-x-0.5 transition-transform">
            View details →
          </span>
        </div>
      </div>
    </Link>
  )
}
