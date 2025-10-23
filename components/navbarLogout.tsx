"use client"

import { useRouter } from "next/navigation"

export default function NavbarLogout() {
  const router = useRouter()

  return (
    <nav
      className="fixed top-0 left-0 w-full z-[99999]
                 bg-gradient-to-r from-[#6B3F69] via-[#8E588A] to-[#6B3F69]
                 shadow-[0_4px_20px_rgba(0,0,0,0.25)] border-b border-[#F4E1C1]/30
                 backdrop-blur-sm"
    >
      <div className="flex justify-center items-center h-24 space-x-16
                      text-[#F4E1C1] font-serif font-bold text-[1.8rem] tracking-wide">
        {/* 🏠 HOME */}
        <button
          onClick={() => router.push("/")}
          className="transition-all duration-300 hover:text-[#FFD700] hover:scale-110"
        >
          Home
        </button>

        {/* 🔑 LOGIN */}
        <button
          onClick={() => router.push("/login")}
          className="transition-all duration-300 hover:text-[#FFD700] hover:scale-110"
        >
          Login
        </button>
      </div>
    </nav>
  )
}
