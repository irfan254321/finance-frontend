// ❌ TIDAK ADA "use client" DI SINI
import "./globals.css"
import { ReactNode } from "react"
import { AuthProvider } from "@/context/AuthContext"
import NavbarSwitcher from "@/components/navbarSwitcher" // ✅ client component

export const metadata = {
  title: "RS Bhayangkara M Hasan Palembang",
  icons: { icon: "/rs-bhayangkara-logo-v2.ico" },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/rs-bhayangkara-logo-v2.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="bg-[#1a2732] text-white min-h-screen">
        <AuthProvider>
          {/* ✅ Client component ditaruh di dalam */}
          <NavbarSwitcher />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  )
}
