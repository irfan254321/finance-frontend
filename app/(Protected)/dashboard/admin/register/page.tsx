"use client"

import { useState } from "react"
import axiosInstance from "@/lib/axiosInstance"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { motion } from "framer-motion"

export default function RegisterPage() {
  const router = useRouter()
  const [nameUsers, setNameUsers] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleRegister = async (e: any) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (password !== confirmPassword) {
      setError("❌ Konfirmasi password tidak cocok")
      return
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password)) {
      setError("⚠️ Password minimal 8 karakter dan wajib mengandung huruf besar, kecil, angka, dan simbol")
      return
    }

    try {
      await axiosInstance.post("/register", {
        name_users: nameUsers,
        username,
        password,
      })
      setSuccess("✅ Registrasi berhasil! Silakan login.")
      setTimeout(() => router.push("/login"), 2000)
    } catch (err: any) {
      setError(err.response?.data?.message || "Registrasi gagal")
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-[#0C1220] via-[#182236] to-[#0C1220] overflow-hidden">
      {/* ✨ Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,215,0,0.18),transparent_70%)] blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.08),transparent_70%)] blur-2xl" />

      {/* 💫 Form Card */}
      <motion.form
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        onSubmit={handleRegister}
        className="relative z-10 w-[420px] p-10 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.45)]"
      >
        {/* 🔱 Title */}
        <h2 className="text-[2.8rem] font-extrabold text-center mb-8 tracking-wide bg-gradient-to-r from-[#FFD700] via-[#F6E27F] to-[#C9A800] text-transparent bg-clip-text drop-shadow-[0_4px_10px_rgba(255,215,0,0.25)]">
          ✨ Register
        </h2>

        {/* Full Name */}
        <div className="mb-5">
          <label className="block mb-2 text-gray-200 font-medium text-[1.05rem]">Full Name</label>
          <input
            value={nameUsers}
            onChange={(e) => setNameUsers(e.target.value)}
            required
            className="w-full px-5 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/70 transition-all duration-300 text-[1rem]"
            placeholder="Enter your full name"
          />
        </div>

        {/* Username */}
        <div className="mb-5">
          <label className="block mb-2 text-gray-200 font-medium text-[1.05rem]">Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-5 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/70 transition-all duration-300 text-[1rem]"
            placeholder="Choose a username"
          />
        </div>

        {/* Password */}
        <div className="relative mb-5">
          <label className="block mb-2 text-gray-200 font-medium text-[1.05rem]">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-5 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/70 transition-all duration-300 text-[1rem]"
            placeholder="Enter password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-[50px] text-gray-400 hover:text-[#FFD700] transition"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="relative mb-8">
          <label className="block mb-2 text-gray-200 font-medium text-[1.05rem]">Confirm Password</label>
          <input
            type={showConfirm ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-5 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/70 transition-all duration-300 text-[1rem]"
            placeholder="Re-enter password"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-4 top-[50px] text-gray-400 hover:text-[#FFD700] transition"
          >
            {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Alerts */}
        {error && <p className="text-red-400 text-sm text-center mb-2">{error}</p>}
        {success && <p className="text-green-400 text-sm text-center mb-2">{success}</p>}

        {/* Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          type="submit"
          className="w-full py-3.5 font-semibold rounded-xl bg-gradient-to-r from-[#FFD700] via-[#F6E27F] to-[#C9A800] text-[#1C1C1C] shadow-[0_0_35px_rgba(255,215,0,0.35)] hover:shadow-[0_0_50px_rgba(255,215,0,0.55)] transition-all duration-300 text-[1.2rem]"
        >
          Sign Up
        </motion.button>
      </motion.form>
    </div>
  )
}
