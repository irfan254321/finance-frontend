"use client"
import { DropdownMenu, DropdownMenu as DropdownMenuPrimitive } from "radix-ui"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Avatar, Menu, MenuItem, IconButton, CircularProgress } from "@mui/material"
import { useAuth } from "@/context/AuthContext"

export default function NavbarLogin() {
  const router = useRouter()
  const { user, logout, loading } = useAuth()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleMenuOpen = (e: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget)
  const handleMenuClose = () => setAnchorEl(null)

  // 🌀 Saat masih fetch /me → tampil spinner tipis aja
  if (loading)
    return (
      <div className="fixed top-0 left-0 w-full h-24 bg-[#2C3E50] flex justify-center items-center text-white">
        <CircularProgress size={30} sx={{ color: "#FFD700" }} />
      </div>
    )

  // 🚪 Kalau user belum login (null)
  if (!user)
    return (
      <nav
        className="fixed top-0 left-0 w-full z-[99999]
                   bg-gradient-to-r from-[#6B3F69] via-[#8E588A] to-[#6B3F69]
                   shadow-[0_4px_20px_rgba(0,0,0,0.25)] border-b border-[#F4E1C1]/30
                   backdrop-blur-sm"
      >
        <div className="flex justify-center items-center h-24 space-x-16 text-[#F4E1C1] font-serif font-bold text-[1.8rem] tracking-wide">
          <button onClick={() => router.push("/")} className="hover:text-[#FFD700] hover:scale-110 transition-all">
            Home
          </button>
          <button onClick={() => router.push("/login")} className="hover:text-[#FFD700] hover:scale-110 transition-all">
            Login
          </button>
        </div>
      </nav>
    )

  // ✅ Kalau user sudah login
  return (
    <nav className="fixed top-0 left-0 w-full z-[99999] bg-gradient-to-r from-[#2C3E50] via-[#3B4B5E] to-[#2C3E50] shadow-xl backdrop-blur-md border-b border-white/10">
      <div className="flex justify-center items-center h-28 space-x-20 font-serif font-bold text-[2rem] text-white tracking-wide">

        <button onClick={() => router.push("/dashboard")} className="hover:text-[#FFD700] hover:scale-110 transition-all">
          Dashboard
        </button>

        {/* 💰 FINANCE */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className="hover:text-[#FFD700] hover:scale-110 transition-all">Finance</DropdownMenu.Trigger>
          <DropdownMenuPrimitive.Portal>
            <DropdownMenu.Content
              sideOffset={14}
              className="z-[99999] bg-gradient-to-br from-[#fefefe]/95 via-[#f5f6fa]/95 to-[#e8ebef]/95 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.25)] border border-white/30 rounded-3xl py-8 px-10 space-y-6 font-serif text-3xl text-[#2C3E50] animate-fade-in-menu"
            >
              {["income", "spending", "mixture"].map((type) => (
                <DropdownMenu.Sub key={type}>
                  <DropdownMenu.SubTrigger className="flex justify-between items-center font-semibold cursor-pointer hover:text-[#FFD700] hover:translate-x-1 transition-all duration-300">
                    {type.charAt(0).toUpperCase() + type.slice(1)} <span className="ml-3 text-[#FFD700]">▸</span>
                  </DropdownMenu.SubTrigger>

                  <DropdownMenuPrimitive.Portal>
                    <DropdownMenu.SubContent
                      className="bg-gradient-to-br from-white via-gray-50 to-gray-100 shadow-2xl border border-white/40 rounded-2xl py-5 px-8 space-y-3 mt-3 text-2xl z-[99999] backdrop-blur-xl animate-fade-in-menu"
                    >
                      {[2024, 2025, 2026].map((y) => (
                        <DropdownMenu.Item key={y}>
                          <button
                            onClick={() => router.push(`/dashboard/${type}/${y}`)}
                            className="flex items-center gap-3 w-full text-left text-gray-700 hover:text-[#2C3E50] font-medium hover:bg-[#FFD700]/10 px-4 py-2 rounded-xl transition-all duration-200"
                          >
                            📅 {y}
                          </button>
                        </DropdownMenu.Item>
                      ))}
                    </DropdownMenu.SubContent>
                  </DropdownMenuPrimitive.Portal>
                </DropdownMenu.Sub>
              ))}
            </DropdownMenu.Content>
          </DropdownMenuPrimitive.Portal>
        </DropdownMenu.Root>

        {/* 👤 Profil */}
        <div className="flex items-center gap-4 absolute right-10 top-7">
          <p className="text-xl font-serif">
            <span className="text-[#FFD700]">{user.name_users}</span> ({user.role})
          </p>
          <IconButton onClick={handleMenuOpen}>
            <Avatar
              alt={user.name_users}
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name_users}`}
              sx={{ width: 60, height: 60, border: "2px solid #FFD700" }}
            />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={() => router.push("/dashboard/profile")}>📁 Profil Saya</MenuItem>
            <MenuItem onClick={logout}>🚪 Logout</MenuItem>
          </Menu>
        </div>
      </div>
    </nav>
  )
}
