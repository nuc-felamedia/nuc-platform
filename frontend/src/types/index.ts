// src/types/index.ts

export type UniversityType = 'FEDERAL' | 'STATE' | 'PRIVATE' | 'TRANSNATIONAL' | 'DISTANCE_LEARNING' | 'AFFILIATED'
export type AccreditationStatus = 'FULL' | 'INTERIM' | 'DENIED' | 'PENDING' | 'NOT_YET_ACCREDITED'
export type DegreeType = 'BSC' | 'BA' | 'BENG' | 'BTECH' | 'LLB' | 'MBBS' | 'BPHARM' | 'MSC' | 'MA' | 'MBA' | 'MENG' | 'LLM' | 'PHD' | 'HND' | 'OND' | 'OTHER'
export type UserRole = 'PUBLIC' | 'SUBSCRIBER' | 'UNIVERSITY_ADMIN' | 'NUC_STAFF' | 'SUPER_ADMIN'
export type PostType = 'NEWS' | 'BULLETIN' | 'PRESS_RELEASE' | 'CIRCULAR' | 'ANNOUNCEMENT'
export type DocumentCategory = 'GUIDELINE' | 'REPORT' | 'STATISTICAL_DIGEST' | 'POLICY' | 'CIRCULAR' | 'OTHER'

export interface University {
  id: string
  name: string
  slug: string
  abbreviation?: string
  type: UniversityType
  state: string
  city?: string
  address?: string
  website?: string
  email?: string
  phone?: string
  logoUrl?: string
  description?: string
  vision?: string
  mission?: string
  yearEstablished?: number
  vcName?: string
  campusSize?: string
  studentPop?: string
  nucApprovalYear?: number
  totalPrograms?: number
  accreditationSummary?: {
    full: number
    interim: number
    denied: number
    pending: number
  }
  programs?: Program[]
  createdAt: string
  updatedAt: string
}

export interface Faculty {
  id: string
  name: string
  slug: string
}

export interface Program {
  id: string
  name: string
  slug: string
  universityId: string
  university?: Pick<University, 'id' | 'name' | 'slug' | 'state' | 'type'>
  facultyId?: string
  faculty?: Faculty
  degreeType: DegreeType
  duration?: number
  description?: string
  accreditations?: Accreditation[]
  createdAt: string
}

export interface Accreditation {
  id: string
  programId: string
  program?: Program
  status: AccreditationStatus
  year: number
  expiryDate?: string
  notes?: string
  visitDate?: string
  isCurrent: boolean
  createdAt: string
}

export interface Directorate {
  id: string
  name: string
  slug: string
  description?: string
  mandate?: string
  directorName?: string
  directorTitle?: string
  directorEmail?: string
  directorPhotoUrl?: string
  order: number
  divisions?: Division[]
}

export interface Division {
  id: string
  name: string
  slug: string
  directorateId: string
  description?: string
  headName?: string
  headTitle?: string
  headEmail?: string
  order: number
  staff?: Staff[]
}

export interface Staff {
  id: string
  name: string
  title?: string
  email?: string
  phone?: string
  photoUrl?: string
  divisionId: string
}

export interface Post {
  id: string
  title: string
  slug: string
  excerpt?: string
  content: string
  type: PostType
  status: string
  featuredImage?: string
  authorName?: string
  publishedAt?: string
  tags: string[]
  viewCount: number
  createdAt: string
}

export interface Document {
  id: string
  title: string
  slug: string
  description?: string
  category: DocumentCategory
  fileUrl: string
  fileName: string
  fileSize?: number
  year?: number
  downloadCount: number
  createdAt: string
}

export interface PlatformStats {
  totalUniversities: number
  federalCount: number
  stateCount: number
  privateCount: number
  transnationalCount: number
  totalPrograms: number
  accreditedPrograms: number
  interimPrograms: number
  deniedPrograms: number
  accreditationRate: number
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  isVerified: boolean
  lastLogin?: string
  subscription?: Subscription
}

export interface Subscription {
  id: string
  plan: string
  status: string
  endDate?: string
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface PaginatedResponse<T> {
  success: boolean
  message: string
  data: T[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface SearchResults {
  universities: Pick<University, 'id' | 'name' | 'slug' | 'type' | 'state' | 'abbreviation'>[]
  programs: (Pick<Program, 'id' | 'name' | 'degreeType'> & { university: Pick<University, 'name' | 'slug'>; faculty?: Faculty; accreditations: Pick<Accreditation, 'status'>[] })[]
  posts: Pick<Post, 'id' | 'title' | 'slug' | 'type' | 'publishedAt'>[]
  directorates: Pick<Directorate, 'id' | 'name' | 'slug' | 'directorName'>[]
  query: string
}
