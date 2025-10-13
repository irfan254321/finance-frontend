import { ReactNode } from "react"
import NavbarLogin from "@/components/navbarLogin"
import FooterLogin from "@/components/footerLogin"
import ProtectedRoute from "@/components/ProtectedRoute"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gradient-to-br from-[#1a2732] via-[#2C3E50] to-[#1a2732] text-white">
        
        {/* 🔹 Navbar tetap di atas */}
        <NavbarLogin />

        {/* 🔒 Proteksi Token */}
        <ProtectedRoute>
              {children}
        </ProtectedRoute>

        {/* 🔹 Footer selalu di bawah */}
        <FooterLogin />
      </body>
    </html>
  )
}
