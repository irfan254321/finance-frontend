"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      console.log("💥 Redirect ke /login dari ProtectedRoute")
      window.location.assign("/login") // paksa reload total
    }
  }, [loading, user])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white text-2xl">
        Checking session...
      </div>
    )
  }

  if (!user) return null
  return <>{children}</>
}
