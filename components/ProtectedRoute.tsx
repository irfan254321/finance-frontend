"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // 🔍 cek dari cookies atau localStorage
    const token = Cookies.get("token") || localStorage.getItem("token")

    console.log("✅ Token terdeteksi:", token)

    if (!token) {
      // kalau kosong, redirect ke login
      router.replace("/login")
    } else {
      // kalau ada token, lanjutkan render
      setIsChecking(false)
    }
  }, [router])

  if (isChecking) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400 text-lg">
        Checking session...
      </div>
    )
  }

  return <>{children}</>
}
