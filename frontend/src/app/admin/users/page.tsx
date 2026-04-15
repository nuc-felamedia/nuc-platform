'use client'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi, authApi } from '@/lib/api'
import { Button, Input, Select, PageLoader, EmptyState, Card } from '@/components/ui'
import { formatDateShort, cn } from '@/lib/utils'
import toast from 'react-hot-toast'

const ROLE_CONFIG: Record<string, { label: string; color: string; desc: string }> = {
  SUPER_ADMIN: { label: 'Super Admin', color: 'bg-red-100 text-red-700', desc: 'Full access to everything' },
  NUC_STAFF: { label: 'NUC Staff', color: 'bg-purple-100 text-purple-700', desc: 'Can manage all data and publish content' },
  UNIVERSITY_ADMIN: { label: 'University Admin', color: 'bg-blue-100 text-blue-700', desc: 'Can manage their university data only' },
  SUBSCRIBER: { label: 'Subscriber', color: 'bg-green-100 text-green-700', desc: 'Full data access, API keys, exports' },
  PUBLIC: { label: 'Public', color: 'bg-gray-100 text-gray-600', desc: 'Basic search and view only' },
}

export default function AdminUsersPage() {
  const queryClient = useQueryClient()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState('')
  const [newUser, setNewUser] = useState({
    firstName: '', lastName: '', email: '', password: '', role: 'PUBLIC',
  })

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => adminApi.getUsers(),
    select: (res) => res.data.data,
  })

  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) => adminApi.updateRole(id, role),
    onSuccess: () => {
      toast.success('Role updated successfully')
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
    onError: () => toast.error('Failed to update role'),
  })

  const toggleMutation = useMutation({
    mutationFn: (id: string) => adminApi.toggleActive(id),
    onSuccess: () => {
      toast.success('User status updated')
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
    onError: () => toast.error('Failed to update user'),
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => authApi.register(data),
    onSuccess: async (res) => {
      const userId = res.data.data.user.id
      if (newUser.role !== 'PUBLIC') {
        await adminApi.updateRole(userId, newUser.role)
      }
      toast.success('User created successfully')
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      setShowCreateForm(false)
      setNewUser({ firstName: '', lastName: '', email: '', password: '', role: 'PUBLIC' })
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to create user'),
  })

  const filtered = (users || []).filter((u: any) => {
    const matchSearch = !search || `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.toLowerCase())
    const matchRole = !filterRole || u.role === filterRole
    return matchSearch && matchRole
  })

  const setNew = (k: string, v: string) => setNewUser(f => ({ ...f, [k]: v }))

  if (isLoading) return <PageLoader />

  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Users & access control</h1>
          <p className="text-gray-500 text-sm mt-1">{users?.length || 0} registered users</p>
        </div>
        <Button size="md" onClick={() => setShowCreateForm(!showCreateForm)}>
          + Create user
        </Button>
      </div>

      {/* Role legend */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {Object.entries(ROLE_CONFIG).map(([role, { label, color, desc }]) => (
          <div key={role} className="bg-white rounded-xl border border-gray-100 p-3">
            <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', color)}>{label}</span>
            <p className="text-xs text-gray-400 mt-1.5 leading-tight">{desc}</p>
          </div>
        ))}
      </div>

      {/* Create user form */}
      {showCreateForm && (
        <Card className="p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Create new user</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <Input
              label="First name *"
              placeholder="Emeka"
              value={newUser.firstName}
              onChange={e => setNew('firstName', e.target.value)}
            />
            <Input
              label="Last name *"
              placeholder="Okafor"
              value={newUser.lastName}
              onChange={e => setNew('lastName', e.target.value)}
            />
            <Input
              label="Email address *"
              type="email"
              placeholder="user@example.com"
              value={newUser.email}
              onChange={e => setNew('email', e.target.value)}
            />
            <Input
              label="Password *"
              type="password"
              placeholder="Min. 8 characters"
              value={newUser.password}
              onChange={e => setNew('password', e.target.value)}
            />
            <div className="sm:col-span-2">
              <Select
                label="Access role *"
                value={newUser.role}
                onChange={e => setNew('role', e.target.value)}
              >
                {Object.entries(ROLE_CONFIG).map(([role, { label, desc }]) => (
                  <option key={role} value={role}>{label} — {desc}</option>
                ))}
              </Select>
            </div>
          </div>

          {/* Role preview */}
          <div className={cn('rounded-xl p-3 mb-4 text-sm', ROLE_CONFIG[newUser.role]?.color)}>
            <strong>{ROLE_CONFIG[newUser.role]?.label}:</strong> {ROLE_CONFIG[newUser.role]?.desc}
            <div className="mt-1 text-xs opacity-80">
              {newUser.role === 'SUPER_ADMIN' && 'Can do everything including delete data and manage all users.'}
              {newUser.role === 'NUC_STAFF' && 'Can add/edit universities, programs, accreditation records and publish bulletins.'}
              {newUser.role === 'UNIVERSITY_ADMIN' && 'Can view and update data for their assigned university only.'}
              {newUser.role === 'SUBSCRIBER' && 'Can access all public data, export CSV, use API keys and get email alerts.'}
              {newUser.role === 'PUBLIC' && 'Can search and view accreditation data. Cannot export or access API.'}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => createMutation.mutate(newUser)}
              loading={createMutation.isPending}
              disabled={!newUser.firstName || !newUser.lastName || !newUser.email || !newUser.password}
            >
              Create user
            </Button>
            <Button variant="outline" onClick={() => setShowCreateForm(false)}>Cancel</Button>
          </div>
        </Card>
      )}

      {/* Filters */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-48"
        />
        <Select value={filterRole} onChange={e => setFilterRole(e.target.value)} className="w-48">
          <option value="">All roles</option>
          {Object.entries(ROLE_CONFIG).map(([role, { label }]) => (
            <option key={role} value={role}>{label}</option>
          ))}
        </Select>
      </div>

      {/* Users table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState title="No users found" description="Try adjusting your search or filters" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">User</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Role</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Last login</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Joined</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user: any) => (
                  <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-xs shrink-0">
                          {user.firstName[0]}{user.lastName[0]}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                          <div className="text-xs text-gray-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <select
                        className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer"
                        value={user.role}
                        onChange={e => {
                          if (confirm(`Change ${user.firstName}'s role to ${ROLE_CONFIG[e.target.value]?.label}?`)) {
                            roleMutation.mutate({ id: user.id, role: e.target.value })
                          }
                        }}
                      >
                        {Object.entries(ROLE_CONFIG).map(([role, { label }]) => (
                          <option key={role} value={role}>{label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full',
                        user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-400 hidden md:table-cell">
                      {user.lastLogin ? formatDateShort(user.lastLogin) : 'Never'}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-400 hidden lg:table-cell">
                      {formatDateShort(user.createdAt)}
                    </td>
                    <td className="px-5 py-3.5">
                      <Button
                        variant={user.isActive ? 'danger' : 'secondary'}
                        size="sm"
                        onClick={() => {
                          if (confirm(`${user.isActive ? 'Deactivate' : 'Activate'} ${user.firstName}?`)) {
                            toggleMutation.mutate(user.id)
                          }
                        }}
                      >
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
