"use client"

import { createContext, useState, useContext, useEffect } from "react"
import axiosInstance from "@/lib/axiosInstance"

const AuthContext = createContext<any>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // 🧠 Fetch user saat awal load (auto-login)
  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await axiosInstance.get("/me") // 🔐 otomatis kirim cookie
        setUser(res.data)
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    checkUser()
  }, [])

  // 🔑 Login (dipanggil setelah submit login)
  const login = async () => {
    try {
      const res = await axiosInstance.get("/me")
      setUser(res.data)
    } catch (err) {
      console.error("Login fetch user gagal:", err)
      setUser(null)
    }
  }

  // 🚪 Logout
  const logout = async () => {
    try {
      await axiosInstance.post("/logout")
    } catch {}
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
