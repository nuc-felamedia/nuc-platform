'use client'
// src/components/search/SearchBar.tsx
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, Loader2 } from 'lucide-react'
import { searchApi } from '@/lib/api'
import { SearchResults } from '@/types'
import { debounce, cn, getAccreditationColor } from '@/lib/utils'
import Link from 'next/link'

export default function SearchBar({ placeholder = 'Search universities, programs...', large = false }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResults | null>(null)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const doSearch = useCallback(
    debounce(async (q: string) => {
      if (q.length < 2) { setResults(null); setOpen(false); return }
      setLoading(true)
      try {
        const { data } = await searchApi.search(q)
        setResults(data.data)
        setOpen(true)
      } catch {}
      finally { setLoading(false) }
    }, 300),
    []
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    doSearch(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      setOpen(false)
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const clear = () => { setQuery(''); setResults(null); setOpen(false) }

  const hasResults = results && (
    results.universities.length > 0 ||
    results.programs.length > 0 ||
    results.posts.length > 0 ||
    results.directorates.length > 0
  )

  return (
    <div ref={ref} className="relative w-full">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={query}
            onChange={handleChange}
            placeholder={placeholder}
            className={cn(
              'w-full pl-12 pr-10 border border-gray-200 bg-white text-gray-900 placeholder-gray-400',
              'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all',
              large ? 'py-4 text-base rounded-2xl shadow-md' : 'py-2.5 text-sm rounded-xl'
            )}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {loading && <Loader2 size={16} className="animate-spin text-brand-500" />}
            {query && !loading && (
              <button type="button" onClick={clear} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </form>

      {open && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden max-h-[480px] overflow-y-auto">
          {!hasResults ? (
            <div className="px-5 py-6 text-center text-sm text-gray-500">
              No results for "<strong>{query}</strong>"
            </div>
          ) : (
            <>
              {results!.universities.length > 0 && (
                <div>
                  <div className="px-4 pt-3 pb-1 text-xs font-bold text-gray-400 uppercase tracking-widest">Universities</div>
                  {results!.universities.map((u) => (
                    <Link
                      key={u.id}
                      href={`/universities/${u.slug}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-brand-50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-xs shrink-0">
                        {u.abbreviation?.slice(0, 2) || u.name.slice(0, 2)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-800">{u.name}</div>
                        <div className="text-xs text-gray-400">{u.state} · {u.type.charAt(0) + u.type.slice(1).toLowerCase()}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {results!.programs.length > 0 && (
                <div className="border-t border-gray-100">
                  <div className="px-4 pt-3 pb-1 text-xs font-bold text-gray-400 uppercase tracking-widest">Programs</div>
                  {results!.programs.map((p) => {
                    const acc = p.accreditations[0]
                    const c = acc ? getAccreditationColor(acc.status) : null
                    return (
                      <Link
                        key={p.id}
                        href={`/universities/${p.university.slug}`}
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-between px-4 py-3 hover:bg-brand-50 transition-colors"
                      >
                        <div>
                          <div className="text-sm font-semibold text-gray-800">{p.name}</div>
                          <div className="text-xs text-gray-400">{p.degreeType} · {p.university.name}</div>
                        </div>
                        {c && (
                          <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', c.bg, c.text)}>
                            {acc?.status}
                          </span>
                        )}
                      </Link>
                    )
                  })}
                </div>
              )}

              {results!.posts.length > 0 && (
                <div className="border-t border-gray-100">
                  <div className="px-4 pt-3 pb-1 text-xs font-bold text-gray-400 uppercase tracking-widest">News & Bulletins</div>
                  {results!.posts.map((p) => (
                    <Link
                      key={p.id}
                      href={`/bulletins/${p.slug}`}
                      onClick={() => setOpen(false)}
                      className="block px-4 py-3 hover:bg-brand-50 transition-colors"
                    >
                      <div className="text-sm font-semibold text-gray-800 line-clamp-1">{p.title}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{p.type}</div>
                    </Link>
                  ))}
                </div>
              )}

              <div className="border-t border-gray-100 px-4 py-3">
                <Link
                  href={`/search?q=${encodeURIComponent(query)}`}
                  onClick={() => setOpen(false)}
                  className="text-sm text-brand-600 font-medium hover:text-brand-700"
                >
                  See all results for "{query}" →
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
