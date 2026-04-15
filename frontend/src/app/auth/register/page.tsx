'use client'
// src/app/auth/register/page.tsx
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/lib/store'
import { Button, Input } from '@/components/ui'
import { authApi } from '@/lib/api'

const schema = z.object({
  firstName: z.string().min(2, 'First name required'),
  lastName: z.string().min(2, 'Last name required'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})
type FormData = z.infer<typeof schema>

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const { setUser, setToken } = useAuthStore()
  const router = useRouter()

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const res = await authApi.register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      })
      setUser(res.data.data.user)
      setToken(res.data.data.accessToken)
      toast.success('Account created successfully!')
      router.push('/dashboard')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center">
              <span className="text-white font-bold font-display">N</span>
            </div>
            <span className="font-display font-bold text-xl text-gray-900">NUC Platform</span>
          </Link>
          <p className="mt-4 text-gray-500 text-sm">Create your free account</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input id="firstName" label="First name" placeholder="Emeka" {...register('firstName')} error={errors.firstName?.message} />
              <Input id="lastName" label="Last name" placeholder="Okafor" {...register('lastName')} error={errors.lastName?.message} />
            </div>
            <Input id="email" label="Email address" type="email" placeholder="you@example.com" {...register('email')} error={errors.email?.message} />
            <Input id="password" label="Password" type="password" placeholder="Min. 8 characters" {...register('password')} error={errors.password?.message} />
            <Input id="confirmPassword" label="Confirm password" type="password" placeholder="Repeat password" {...register('confirmPassword')} error={errors.confirmPassword?.message} />

            <Button type="submit" className="w-full mt-2" size="lg" loading={loading}>
              Create account
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-brand-600 font-medium hover:text-brand-700">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
