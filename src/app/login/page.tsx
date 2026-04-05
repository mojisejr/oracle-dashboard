'use client'

import { createBrowserSupabaseClient } from '@/lib/supabase/browser'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSignUp, setIsSignUp] = useState(false)
  const router = useRouter()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createBrowserSupabaseClient()

    try {
      if (isSignUp) {
        // Sign up
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
        alert('✅ สมัครสำเร็จ! ตรวจสอบ email เพื่อ confirm')
        setIsSignUp(false)
      } else {
        // Sign in
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        router.push('/dashboard')
        router.refresh()
      }
    } catch (error: any) {
      setError(error.message || 'เกิดข้อผิดพลาด')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-green-700">
            🌿 Oracle Dashboard
          </h1>
          <p className="text-sm text-neutral-600 mt-2">
            {isSignUp ? 'สร้างบัญชีใหม่' : 'เข้าสู่ระบบ'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="อย่างน้อย 6 ตัวอักษร"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading
              ? '⏳ กำลังดำเนินการ...'
              : isSignUp
              ? '📝 สมัครสมาชิก'
              : '🔐 เข้าสู่ระบบ'}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-neutral-200">
          <p className="text-sm text-center text-neutral-600">
            {isSignUp ? 'มีบัญชีแล้ว?' : 'ยังไม่มีบัญชี?'}{' '}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-green-600 font-medium hover:underline"
            >
              {isSignUp ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
            </button>
          </p>
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded text-xs text-blue-800">
          <strong>💡 คำแนะนำ:</strong> สำหรับ 2 คน (คุณ + Oracle) ให้สมัครคนละ email
          เช่น:
          <br />
          • your@email.com
          <br />
          • oracle@yourdomain.com
        </div>
      </div>
    </div>
  )
}
