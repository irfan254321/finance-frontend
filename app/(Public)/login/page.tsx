"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axiosInstance from "@/lib/axiosInstance"
import { useAuth } from "@/context/AuthContext"
import { CircularProgress, Alert } from "@mui/material"
import { motion, AnimatePresence } from "framer-motion"

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await axiosInstance.post("/login", form)
      await login()

      // ✨ Efek verifikasi loading sebelum redirect
      setLoading(false)
      setVerifying(true)

      setTimeout(() => {
        router.push("/dashboard")
      }, 2000) // 2 detik sebelum masuk dashboard
    } catch (err: any) {
      console.error("Login error:", err)
      setError(err.response?.data?.message || "Login gagal, periksa kembali data Anda.")
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0b0f16] via-[#1a2732] to-[#0b0f16] text-white px-4 overflow-hidden">
      {/* 🏥 LOGO HEADER */}
      <motion.img
        src="/logo-rs.png"
        alt="Logo RS Bhayangkara"
        initial={{ opacity: 0, scale: 0.7, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="w-28 h-28 mb-6 drop-shadow-[0_0_20px_rgba(255,215,0,0.4)]"
      />

      {/* 🔐 FORM LOGIN */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="bg-white/10 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-full max-w-[400px] space-y-6 border border-white/20 relative z-10"
      >
        <h2 className="text-3xl font-bold text-center text-[#FFD700] mb-4">
          🔐 Login Sistem Informasi
        </h2>

        <div>
          <label className="block text-sm text-gray-300 mb-2">Username</label>
          <input
            name="username"
            type="text"
            value={form.username}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-gray-800/60 border border-gray-600 text-white focus:ring-2 focus:ring-[#FFD700] focus:outline-none"
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
            className="w-full px-4 py-2 rounded-lg bg-gray-800/60 border border-gray-600 text-white focus:ring-2 focus:ring-[#FFD700] focus:outline-none"
          />
        </div>

        {error && (
          <Alert severity="error" className="text-sm">
            {error}
          </Alert>
        )}

        {/* 🟡 BUTTON LOGIN */}
        <button
          type="submit"
          disabled={loading || verifying}
          className={`w-full py-3 rounded-lg font-semibold text-lg transition-all ${
            verifying
              ? "bg-[#FFD700]/70 text-[#2C3E50] cursor-wait"
              : "bg-[#FFD700] text-[#2C3E50] hover:bg-[#f8d21b]"
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-3">
              <CircularProgress size={22} sx={{ color: "#2C3E50" }} />
              <span>Memverifikasi...</span>
            </div>
          ) : verifying ? (
            <div className="flex items-center justify-center gap-3">
              <motion.div
                className="w-5 h-5 border-2 border-[#2C3E50] border-t-transparent rounded-full animate-spin"
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
              />
              <span>Menyambungkan ke Sistem...</span>
            </div>
          ) : (
            "MASUK"
          )}
        </button>
      </motion.form>

      {/* 🔙 KEMBALI KE HOME */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="mt-6 text-center z-10"
      >
        <p className="text-gray-300 text-sm">
          Belum ingin login?{" "}
          <button
            onClick={() => router.push("/")}
            className="text-[#FFD700] font-semibold hover:underline hover:text-yellow-400 transition-all cursor-pointer"
          >
            Kembali ke Halaman Utama
          </button>
        </p>
      </motion.div>

      {/* 🌌 Overlay loading cinematic */}
      <AnimatePresence>
        {verifying && (
          <motion.div
            key="overlay"
            className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-[#FFD700] font-serif text-2xl backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="w-14 h-14 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin mb-6"
              transition={{ repeat: Infinity, duration: 1 }}
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="text-center text-[#FFD700]"
            >
              Memproses data pengguna...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
