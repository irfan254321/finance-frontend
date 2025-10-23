"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import axiosInstance from "@/lib/axiosInstance"
import { useAuth } from "@/context/AuthContext"
import { CircularProgress, Alert } from "@mui/material"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const { user } = useAuth()
  const [form, setForm] = useState({ username: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (user) router.push("/dashboard")
  }, [user, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await axiosInstance.post("/login", form)

      // ✅ Cookie sudah otomatis tersimpan (karena withCredentials:true)
      await login() // biar AuthContext fetch data user dari /me

      // 🚀 Redirect ke dashboard
      router.push("/dashboard")
    } catch (err: any) {
      console.error("Login error:", err)
      setError(err.response?.data?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a2732] via-[#2C3E50] to-[#1a2732] text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-[400px] space-y-6 border border-white/20"
      >
        <h2 className="text-3xl font-bold text-center text-[#FFD700] mb-4">
          🔐 Login Finance
        </h2>

        <div>
          <label className="block text-sm text-gray-300 mb-2">Username</label>
          <input
            name="username"
            type="text"
            value={form.username}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-gray-800/60 border border-gray-600 text-white focus:ring-2 focus:ring-[#FFD700]"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-2">Password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-gray-800/60 border border-gray-600 text-white focus:ring-2 focus:ring-[#FFD700]"
          />
        </div>

        {error && (
          <Alert severity="error" className="text-sm">
            {error}
          </Alert>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#FFD700] text-[#2C3E50] font-semibold py-2 rounded-lg hover:bg-[#f8d21b] transition-all"
        >
          {loading ? <CircularProgress size={22} color="inherit" /> : "Login"}
        </button>
      </form>
    </div>
  )
}
