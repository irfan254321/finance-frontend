"use client"

import { useState } from "react"
import axiosInstance from "@/lib/axiosInstance"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()
  const [nameUsers, setNameUsers] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("user") // default user
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleRegister = async (e: any) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      const res = await axiosInstance.post("/register", {
        name_users: nameUsers,
        username,
        password,
        role,
      })

      setSuccess("✅ Registrasi berhasil! Silakan login.")
      setTimeout(() => router.push("/login"), 1500)
    } catch (err: any) {
      setError(err.response?.data?.error || "Registrasi gagal")
    }
  }

  return (
    <div className="flex justify-center items-center h-[80vh]">
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
            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 ring-[#2C3E50]"
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

        <div>
          <label className="block mb-2 text-gray-600">Password</label>
          <input
            type="password"
            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 ring-[#2C3E50]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-gray-600">Role</label>
          <select
            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 ring-[#2C3E50]"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">User</option>
          </select>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}

        <button
          type="submit"
          className="w-full py-2 bg-[#2C3E50] text-white rounded-lg hover:bg-[#34495E] transition"
        >
          Sign Up
        </button>

        <p className="text-sm text-center text-gray-600">
          Sudah punya akun?{" "}
          <span
            className="text-[#2C3E50] hover:underline cursor-pointer"
            onClick={() => router.push("/login")}
          >
            Login di sini
          </span>
        </p>
      </form>
    </div>
  )
}
