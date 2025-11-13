"use client"

import { useAuth } from "@/context/AuthContext"
import NavbarLogin from "@/components/navbarLogin"
import NavbarAdmin from "@/components/navbarAdmin"

export default function NavbarSwitcher() {
  const { user, loading } = useAuth()

  // 🌀 Masih loading → jangan render apapun
  if (loading) return null

  // ⛔ Kalau belum login / user masih null → jangan render navbar
  if (!user) return null

  // ✅ Sudah login → pilih sesuai role
  if (user.role === "admin") return <NavbarAdmin />
  return <NavbarLogin />
}
