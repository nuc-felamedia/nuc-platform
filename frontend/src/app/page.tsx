import Link from 'next/link'
import { ArrowRight, Search, CheckCircle, BookOpen, Building2, Globe, FileText, Users, ChevronRight } from 'lucide-react'
import PublicLayout from '@/components/layout/PublicLayout'
import SearchBar from '@/components/search/SearchBar'
import { statsApi, universitiesApi, postsApi } from '@/lib/api'

async function getHomeData() {
  try {
    const [statsRes, unisRes, postsRes] = await Promise.all([
      statsApi.get(),
      universitiesApi.getAll({ limit: 6 }),
      postsApi.getAll({ limit: 4, status: 'PUBLISHED' }),
    ])
    return {
      stats: statsRes.data.data,
      universities: unisRes.data.data,
      posts: postsRes.data.data,
    }
  } catch {
    return { stats: null, universities: [], posts: [] }
  }
}

export default async function HomePage() {
  const { stats, universities, posts } = await getHomeData()

  return (
    <PublicLayout>

      {/* ── HERO ── */}
      <section className="bg-brand-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-brand-700 border border-brand-600 rounded-full px-4 py-1.5 text-xs font-semibold text-brand-200 mb-6 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
              Federal Republic of Nigeria
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4 text-white">
              National Universities Commission
            </h1>
            <p className="text-brand-200 text-lg sm:text-xl leading-relaxed mb-3 max-w-2xl">
              The regulatory body for university education in Nigeria. Ensuring quality, promoting excellence, and protecting the integrity of Nigerian degrees.
            </p>
            <p className="text-brand-300 text-sm mb-8">
              Executive Secretary: Prof. Abdullahi Yusufu Ribadu, FCVSN
            </p>
            <div className="max-w-2xl">
              <SearchBar placeholder="Search universities, programs, accreditation status..." large />
            </div>
            <div className="flex flex-wrap gap-3 mt-5">
              {['Computer Science', 'Medicine & Surgery', 'Law', 'Engineering', 'Pharmacy'].map((term) => (
                <Link key={term} href={`/search?q=${encodeURIComponent(term)}`}
                  className="px-3 py-1.5 bg-brand-700 hover:bg-brand-600 text-brand-200 hover:text-white rounded-full text-xs font-medium transition-colors border border-brand-600">
                  {term}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── LIVE STATS BAR ── */}
      <section className="bg-brand-900 text-white border-b border-brand-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-brand-700">
            {[
              { label: 'Total universities', value: stats?.totalUniversities || 241 },
              { label: 'Federal universities', value: stats?.federalCount || 74 },
              { label: 'State universities', value: stats?.stateCount || 67 },
              { label: 'Private universities', value: stats?.privateCount || 100 },
            ].map(({ label, value }) => (
              <div key={label} className="px-4 sm:px-8 py-5 text-center">
                <div className="font-display text-2xl sm:text-3xl font-bold text-white">{value.toLocaleString()}</div>
                <div className="text-xs text-brand-300 mt-1 font-medium uppercase tracking-wide">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOR WHOM ── */}
      <section className="bg-gray-50 border-b border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">I am looking for information as a...</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: Users, label: 'Student or parent', desc: 'Verify accreditation, find approved programs', href: '/accreditation/verify', color: 'bg-blue-50 border-blue-100 hover:border-blue-300 text-blue-700' },
              { icon: Building2, label: 'University', desc: 'Submit data, check status, manage programs', href: '/auth/login', color: 'bg-green-50 border-green-100 hover:border-green-300 text-green-700' },
              { icon: Globe, label: 'Embassy or institution', desc: 'Verify Nigerian degrees and credentials', href: '/accreditation', color: 'bg-purple-50 border-purple-100 hover:border-purple-300 text-purple-700' },
              { icon: FileText, label: 'Researcher or journalist', desc: 'Access data, statistics, API', href: '/documents', color: 'bg-amber-50 border-amber-100 hover:border-amber-300 text-amber-700' },
            ].map(({ icon: Icon, label, desc, href, color }) => (
              <Link key={label} href={href}
                className={`group flex flex-col gap-3 p-5 rounded-2xl border bg-white transition-all hover:shadow-sm ${color.split(' ').filter(c => c.startsWith('hover') || c.startsWith('border')).join(' ')} border`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color.split(' ').filter(c => c.startsWith('bg')).join(' ')}`}>
                  <Icon size={18} className={color.split(' ').find(c => c.startsWith('text-')) || 'text-gray-600'} />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm mb-0.5">{label}</div>
                  <div className="text-xs text-gray-500 leading-relaxed">{desc}</div>
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-brand-600 mt-auto">
                  Get started <ChevronRight size={12} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── ACCREDITATION CHECKER FEATURE ── */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-block text-xs font-bold text-brand-700 bg-brand-50 px-3 py-1 rounded-full uppercase tracking-widest mb-4">
                Most used feature
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Verify a program's accreditation in seconds
              </h2>
              <p className="text-gray-500 leading-relaxed mb-6">
                Students, parents, embassies and employers use this tool to instantly confirm whether a Nigerian university program carries full NUC accreditation.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  'Select the university',
                  'Select the program',
                  'Get instant accreditation status',
                ].map((step, i) => (
                  <div key={step} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </div>
                    <span className="text-sm text-gray-700 font-medium">{step}</span>
                  </div>
                ))}
              </div>
              <Link href="/accreditation/verify"
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-xl font-semibold text-sm hover:bg-brand-700 transition-colors">
                Verify accreditation now <ArrowRight size={16} />
              </Link>
            </div>
            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6">
              <div className="space-y-3">
                {[
                  { uni: 'University of Lagos', prog: 'Computer Science', status: 'FULL', year: 2023 },
                  { uni: 'University of Ibadan', prog: 'Medicine & Surgery', status: 'FULL', year: 2024 },
                  { uni: 'Ahmadu Bello University', prog: 'Law', status: 'FULL', year: 2023 },
                  { uni: 'University of Nigeria', prog: 'Pharmacy', status: 'FULL', year: 2023 },
                  { uni: 'Obafemi Awolowo University', prog: 'Engineering', status: 'INTERIM', year: 2022 },
                ].map((item) => (
                  <div key={item.prog} className="bg-white rounded-xl border border-gray-100 p-3.5 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-semibold text-gray-900 text-sm truncate">{item.prog}</div>
                      <div className="text-xs text-gray-400 truncate">{item.uni}</div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-gray-400">{item.year}</span>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${item.status === 'FULL' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'FULL' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                        {item.status === 'FULL' ? 'Accredited' : 'Interim'}
                      </span>
                    </div>
                  </div>
                ))}
                <Link href="/accreditation"
                  className="block text-center text-xs text-brand-600 font-medium hover:text-brand-700 pt-1">
                  View all accreditation records →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── QUICK LINKS ── */}
      <section className="py-12 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-xl font-bold text-gray-900 mb-6">Key services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'University directory', desc: 'Browse all 241 NUC-approved universities by type, state and accreditation status.', href: '/universities', icon: Building2, tag: '241 universities' },
              { title: 'Accreditation results', desc: 'Full searchable database of undergraduate and postgraduate accreditation records.', href: '/accreditation', icon: CheckCircle, tag: 'Searchable database' },
              { title: 'Directorates', desc: 'Explore NUC departments, divisions, directors and staff across all directorates.', href: '/directorates', icon: Users, tag: '15+ directorates' },
              { title: 'Bulletins & circulars', desc: 'Official NUC announcements, press releases and circulars for universities.', href: '/bulletins', icon: FileText, tag: 'Latest news' },
              { title: 'Guidelines & documents', desc: 'Download official NUC guidelines, statistical digests and policy documents.', href: '/documents', icon: BookOpen, tag: 'Free downloads' },
              { title: 'Part-time programmes', desc: 'Guidelines and accreditation status for all approved part-time programmes.', href: '/accreditation?type=parttime', icon: Globe, tag: 'Federal, State & Private' },
            ].map(({ title, desc, href, icon: Icon, tag }) => (
              <Link key={title} href={href}
                className="group bg-white rounded-2xl border border-gray-100 p-5 hover:border-brand-200 hover:shadow-sm transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center group-hover:bg-brand-100 transition-colors">
                    <Icon size={18} className="text-brand-600" />
                  </div>
                  <span className="text-xs text-gray-400 font-medium bg-gray-50 px-2 py-1 rounded-full">{tag}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1.5 group-hover:text-brand-700 transition-colors">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                <div className="flex items-center gap-1 text-xs text-brand-600 font-medium mt-3">
                  Learn more <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── ACCREDITATION OVERVIEW ── */}
      {stats && (
        <section className="py-12 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-gray-900">Accreditation overview</h2>
              <Link href="/accreditation" className="text-sm text-brand-600 font-medium hover:text-brand-700">
                Full results →
              </Link>
            </div>
            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-3 text-sm">
                <span className="font-semibold text-gray-700">
                  {stats.accreditationRate}% of all programs are fully accredited
                </span>
                <span className="text-gray-400">{(stats.totalPrograms || 0).toLocaleString()} programs assessed</span>
              </div>
              <div className="flex h-4 rounded-full overflow-hidden gap-0.5 mb-4">
                <div className="bg-green-500 transition-all rounded-l-full" style={{ flex: stats.accreditedPrograms }} />
                <div className="bg-yellow-400" style={{ flex: stats.interimPrograms }} />
                <div className="bg-red-400 rounded-r-full" style={{ flex: stats.deniedPrograms }} />
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                {[
                  { label: 'Full accreditation', value: stats.accreditedPrograms, color: 'text-green-700', bg: 'bg-green-50', dot: 'bg-green-500' },
                  { label: 'Interim', value: stats.interimPrograms, color: 'text-yellow-700', bg: 'bg-yellow-50', dot: 'bg-yellow-400' },
                  { label: 'Denied', value: stats.deniedPrograms, color: 'text-red-700', bg: 'bg-red-50', dot: 'bg-red-400' },
                ].map(({ label, value, color, bg, dot }) => (
                  <div key={label} className={`${bg} rounded-xl p-4`}>
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <span className={`w-2 h-2 rounded-full ${dot}`} />
                      <span className={`font-display text-2xl font-bold ${color}`}>{(value || 0).toLocaleString()}</span>
                    </div>
                    <div className={`text-xs font-medium ${color} opacity-80`}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── LATEST NEWS ── */}
      {posts.length > 0 && (
        <section className="py-12 bg-gray-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-gray-900">Latest from NUC</h2>
              <Link href="/bulletins" className="text-sm text-brand-600 font-medium hover:text-brand-700 flex items-center gap-1">
                All bulletins <ArrowRight size={13} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {posts.map((post: any, i: number) => {
                const typeColors: Record<string, string> = {
                  NEWS: 'bg-blue-100 text-blue-700',
                  BULLETIN: 'bg-green-100 text-green-700',
                  PRESS_RELEASE: 'bg-purple-100 text-purple-700',
                  CIRCULAR: 'bg-orange-100 text-orange-700',
                  ANNOUNCEMENT: 'bg-teal-100 text-teal-700',
                }
                return (
                  <Link key={post.id} href={`/bulletins/${post.slug}`}
                    className={`group bg-white rounded-2xl border border-gray-100 hover:border-brand-200 hover:shadow-sm transition-all overflow-hidden flex flex-col ${i === 0 ? 'sm:col-span-2' : ''}`}>
                    {i === 0 && (
                      <div className="h-3 bg-gradient-to-r from-brand-600 to-brand-400" />
                    )}
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${typeColors[post.type] || 'bg-gray-100 text-gray-600'}`}>
                          {post.type}
                        </span>
                        {post.publishedAt && (
                          <span className="text-xs text-gray-400">
                            {new Date(post.publishedAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        )}
                      </div>
                      <h3 className={`font-semibold text-gray-900 group-hover:text-brand-700 transition-colors leading-tight mb-2 ${i === 0 ? 'text-base' : 'text-sm line-clamp-2'}`}>
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed flex-1">{post.excerpt}</p>
                      )}
                      <div className="flex items-center gap-1 text-xs text-brand-600 font-medium mt-3">
                        Read more <ArrowRight size={11} />
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── ABOUT NUC ── */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="text-xs font-bold text-brand-700 bg-brand-50 px-3 py-1 rounded-full uppercase tracking-widest mb-4 inline-block">
                About NUC
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Nigeria's foremost higher education regulatory body
              </h2>
              <p className="text-gray-500 leading-relaxed mb-4">
                The National Universities Commission (NUC) was established in 1962 to advise the Federal Government on the funding needs of universities and ensure quality university education in Nigeria.
              </p>
              <p className="text-gray-500 leading-relaxed mb-6">
                Today, NUC regulates 241 approved universities across Nigeria, ensuring they meet minimum academic standards and protecting the value of Nigerian degrees globally.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { label: 'Year established', value: '1962' },
                  { label: 'Universities regulated', value: '241' },
                  { label: 'Programs accredited', value: '3,800+' },
                  { label: 'Annual inspections', value: '500+' },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="font-display text-xl font-bold text-brand-700">{value}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{label}</div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/about"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white rounded-xl font-semibold text-sm hover:bg-brand-700 transition-colors">
                  About NUC <ArrowRight size={14} />
                </Link>
                <Link href="/directorates"
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors">
                  Our directorates
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-brand-800 rounded-2xl p-6 text-white">
                <div className="text-brand-300 text-xs font-bold uppercase tracking-widest mb-2">Vision</div>
                <p className="text-white font-medium leading-relaxed">
                  "To be a dynamic regulatory agency acting as a catalyst for positive change and innovation for the delivery of quality university education in Nigeria."
                </p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="text-brand-700 text-xs font-bold uppercase tracking-widest mb-2">Mission</div>
                <p className="text-gray-700 leading-relaxed">
                  To regulate and maintain quality assurance in university education in Nigeria through accreditation, funding advisory, capacity building, and policy development.
                </p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="text-brand-700 text-xs font-bold uppercase tracking-widest mb-2">Executive Secretary</div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-sm shrink-0">AR</div>
                  <div>
                    <div className="font-semibold text-gray-900">Prof. Abdullahi Yusufu Ribadu</div>
                    <div className="text-sm text-gray-500">FCVSN — Executive Secretary, NUC</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="bg-brand-700 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div>
            <h2 className="font-display text-xl font-bold text-white mb-1">Need API access or bulk data?</h2>
            <p className="text-brand-200 text-sm">Embassies, institutions and researchers can access NUC data programmatically.</p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link href="/auth/register"
              className="px-5 py-2.5 bg-white text-brand-700 rounded-xl font-semibold text-sm hover:bg-brand-50 transition-colors">
              Create account
            </Link>
            <Link href="/auth/login"
              className="px-5 py-2.5 border border-brand-500 text-white rounded-xl font-semibold text-sm hover:bg-brand-600 transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      </section>

    </PublicLayout>
  )
}
