"use client"

import { useState } from "react"
import axiosInstance from "@/lib/axiosInstance"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"

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
      setError("Password confirmation does not match")
      return
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password)) {
      setError(
        "Password must contain at least 8 characters, including uppercase, lowercase, number, and symbol."
      )
      return
    }

    try {
      const res = await axiosInstance.post("/register", {
        name_users: nameUsers,
        username: username,
        password: password
      })

      setSuccess("✅ Registrasi berhasil! Silakan login.")
    } catch (err: any) {
      setError(
        err.response?.data?.message || // tangkap "Username already exists"
        err.response?.data?.error ||   // tangkap "All fields are required" atau lainnya
        "Registrasi gagal"
      )
    }
  }

  return (
    <div className="flex justify-center items-center h-[80vh] text-gray-600">
      <form
        onSubmit={handleRegister}
        className="bg-white shadow-2xl rounded-2xl p-10 w-[420px] space-y-6 border border-gray-200"
      >
        <h2 className="text-2xl font-bold text-center text-[#2C3E50]">
          Register
        </h2>

        <div>
          <label className="block mb-2 text-gray-600">Full Name</label>
          <input
            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 ring-[#2C3E50] "
            value={nameUsers}
            onChange={(e) => setNameUsers(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-gray-600">Username</label>
          <input
            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 ring-[#2C3E50]"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        {/* Password Field */}
        <div className="relative">
          <label className="block mb-2 text-gray-600">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 ring-[#2C3E50]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 translate-y-1/2 -mt-[2px] text-gray-500 hover:text-gray-700 transition-transform duration-150 ease-in-out cursor-pointer"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Confirm Password Field */}
        <div className="relative mt-4">
          <label className="block mb-2 text-gray-600">Confirm Password</label>
          <input
            type={showConfirm ? "text" : "password"}
            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 ring-[#2C3E50]"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-1/2 translate-y-1/2 -mt-[2px] text-gray-500 hover:text-gray-700 transition-transform duration-150 ease-in-out cursor-pointer"
          >
            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {password && (
          <p
            className={`text-sm mt-1 ${/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password)
              ? "text-green-600"
              : "text-red-500"
              }`}
          >
            {/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password)
              ? "✅ Strong password"
              : "⚠️ Must include uppercase, lowercase, number, and symbol"
            }
          </p>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}

        <button
          type="submit"
          className="w-full py-2 bg-[#2C3E50] text-white rounded-lg hover:bg-[#34495E] transition cursor-pointer"
        >
          Sign Up
        </button>
      </form>
    </div>
  )
}
