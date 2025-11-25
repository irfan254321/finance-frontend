"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axiosInstance from "@/lib/axiosInstance"
import { useAuth } from "@/context/AuthContext"
import { CircularProgress, Alert } from "@mui/material"
import  InputForm  from "@/components/InputForm"

export default function LoginPage() {
  const router = useRouter()
  const { login, user } = useAuth()

  const [form, setForm] = useState({ username: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (user) router.push("/dashboard")
  }, [user, router])

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await axiosInstance.post("/login", form)
      await login()

      setLoading(false)
      setVerifying(true)

      setTimeout(() => {
        router.push("/dashboard")
      }, 1500)
    } catch (err: any) {
      setError(err.response?.data?.message || "Login gagal, periksa kembali data Anda.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b0f16] via-[#1a2732] to-[#0b0f16] text-white px-6">

      {/* WRAPPER SPLIT */}
      <div className="w-full max-w-7xl min-h-[900px] bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

        {/* KIRI – BRANDING */}
        <div className="hidden md:flex flex-col items-center justify-center px-10 py-16 text-center bg-white/5 border-r border-white/10">
          <img
            src="/logo-rs.png"
            alt="Logo"
            className="w-28 h-28 mb-6 drop-shadow-[0_0_15px_rgba(255,215,0,0.4)]"
          />
          <h1 className="text-3xl font-bold text-white leading-snug">
            Sistem Informasi<br />Keuangan RS Bhayangkara
          </h1>
        </div>

        {/* KANAN – FORM LOGIN */}
        <div className="p-10 md:p-14">
          <h2 className="text-7xl font-semibold text-[#FFD700] mb-8 mt-36 text-center uppercase">
            sistem informasi
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <InputForm
                label="Username"
                name="username"
                value={form.username}
                onChange={handleChange}
              />
            </div>

            <div>
               <InputForm
                label="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                
              />
            </div>

            {error && (
              <Alert severity="error" className="text-sm">
                {error}
              </Alert>
            )}

            <button
              type="submit"
              disabled={loading || verifying}
              className="w-full min-h-16 py-3 rounded-xl font-bold bg-[#FFD700] text-[#2C3E50]
                         hover:bg-[#f4ce1c] transition disabled:opacity-50"
            >
              {loading ? "Memverifikasi..." : verifying ? "Menyambungkan..." : "MASUK"}
            </button>
          </form>

          <p className="text-center text-gray-300 mt-6 text-2xl">
            Belum ingin login?
            <button
              onClick={() => router.push("/")}
              className="text-[#FFD700] ml-1 hover:underline"
            >
              Kembali ke Halaman Utama
            </button>
          </p>
        </div>

      </div>
    </div>
  )
}
