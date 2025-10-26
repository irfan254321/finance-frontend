"use client"

import { ReactNode, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import FooterLogin from "@/components/footer"

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  // 🕐 Sambil cek token / session
  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-white text-2xl">
        Checking session...
      </div>
    )

  // 🚫 Kalau belum login
  if (!user) {
    router.push("/login")
    return null
  }

  // 🚫 Kalau bukan admin
  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/dashboard") // tendang balik ke dashboard biasa
    }
  }, [user, router])

  if (user?.role !== "admin") return null

  // ✅ Kalau admin → render halaman admin
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1a2732] via-[#2C3E50] to-[#1a2732] text-white">
      <main className="flex-grow pt-28 px-6">{children}</main>
    </div>
  )
}
