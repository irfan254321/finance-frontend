"use client"

import { useAuth } from "@/context/AuthContext"
import NavbarLogout from "@/components/navbarLogout"
import NavbarLogin from "@/components/navbarLogin"
import NavbarAdmin from "@/components/navbarAdmin"

export default function NavbarSwitcher() {
  const { user, loading } = useAuth()
  console.log("🔍 NavbarSwitcher:", { user, loading })
  
  if (loading) return null
  if (!user) return <NavbarLogout />
  if (user.role === "admin") return <NavbarAdmin />
  return <NavbarLogin />
}
