"use client"
import { DropdownMenu, DropdownMenu as DropdownMenuPrimitive } from "radix-ui"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { useEffect, useState } from "react"
import axiosInstance from "@/lib/axiosInstance"
import { Avatar, Menu, MenuItem, IconButton } from "@mui/material"

export default function NavbarLogin() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  // 🔐 Ambil data user dari token
  useEffect(() => {
  const token = Cookies.get("token")
  console.log("🔑 Token:", token) // cek apakah token ada

  if (!token) return
  axiosInstance
    .get("/me", { headers: { Authorization: `Bearer ${token}` } })
    .then((res) => {
      console.log("✅ User dari /me:", res.data)
      setUser(res.data) // <- kalau backend ngirim langsung object user
      // kalau backend kirim { user: {...} } ganti jadi setUser(res.data.user)
    })
    .catch((err) => {
      console.log("❌ Gagal fetch user:", err)
      Cookies.remove("token")
      router.push("/login")
    })
}, [router])


  const handleLogout = () => {
    Cookies.remove("token")
    router.push("/login")
  }

  const handleMenuOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget)
  }
  const handleMenuClose = () => setAnchorEl(null)

  return (
    <nav className="fixed top-0 left-0 w-full z-[99999] bg-gradient-to-r from-[#2C3E50] via-[#3B4B5E] to-[#2C3E50] shadow-xl backdrop-blur-md border-b border-white/10">
      <div className="flex justify-center items-center h-28 space-x-20 font-serif font-bold text-[2rem] text-white tracking-wide">

        {/* 🚪 DASHBOARD */}
        <button
          onClick={() => router.push("/dashboard")}
          className="transition-all duration-300 hover:text-[#FFD700] hover:scale-110"
        >
          Dashboard
        </button>

        {/* 💰 FINANCE */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className="transition-all duration-300 hover:text-[#FFD700] hover:scale-110">
            Finance
          </DropdownMenu.Trigger>

          <DropdownMenuPrimitive.Portal>
            <DropdownMenu.Content
              sideOffset={14}
              className="z-[99999] bg-gradient-to-br from-[#fefefe]/95 via-[#f5f6fa]/95 to-[#e8ebef]/95 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.25)] border border-white/30 rounded-3xl py-8 px-10 space-y-6 font-serif text-3xl text-[#2C3E50] animate-fade-in-menu"
            >
              {/* Income */}
              <DropdownMenu.Sub>
                <DropdownMenu.SubTrigger className="flex justify-between items-center font-semibold cursor-pointer hover:text-[#FFD700] hover:translate-x-1 transition-all duration-300">
                  Income <span className="ml-3 text-[#FFD700]">▸</span>
                </DropdownMenu.SubTrigger>

                <DropdownMenuPrimitive.Portal>
                  <DropdownMenu.SubContent
                    className="bg-gradient-to-br from-white via-gray-50 to-gray-100 shadow-2xl border border-white/40 rounded-2xl py-5 px-8 space-y-3 mt-3 text-2xl z-[99999] backdrop-blur-xl animate-fade-in-menu"
                  >
                    {[2024, 2025, 2026].map((y) => (
                      <DropdownMenu.Item key={y}>
                        <button
                          onClick={() => router.push(`/dashboard/income/${y}`)}
                          className="flex items-center gap-3 w-full text-left text-gray-700 hover:text-[#2C3E50] font-medium hover:bg-[#FFD700]/10 px-4 py-2 rounded-xl transition-all duration-200"
                        >
                          📅 {y}
                        </button>
                      </DropdownMenu.Item>
                    ))}
                  </DropdownMenu.SubContent>
                </DropdownMenuPrimitive.Portal>
              </DropdownMenu.Sub>

              {/* Spending */}
              <DropdownMenu.Sub>
                <DropdownMenu.SubTrigger className="flex justify-between items-center font-semibold cursor-pointer hover:text-[#FFD700] hover:translate-x-1 transition-all duration-300">
                  Spending <span className="ml-3 text-[#FFD700]">▸</span>
                </DropdownMenu.SubTrigger>

                <DropdownMenuPrimitive.Portal>
                  <DropdownMenu.SubContent
                    className="bg-gradient-to-br from-white via-gray-50 to-gray-100 shadow-2xl border border-white/40 rounded-2xl py-5 px-8 space-y-3 mt-3 text-2xl z-[99999] backdrop-blur-xl animate-fade-in-menu"
                  >
                    {[2024, 2025, 2026].map((y) => (
                      <DropdownMenu.Item key={y}>
                        <button
                          onClick={() => router.push(`/dashboard/spending/${y}`)}
                          className="flex items-center gap-3 w-full text-left text-gray-700 hover:text-[#2C3E50] font-medium hover:bg-[#FFD700]/10 px-4 py-2 rounded-xl transition-all duration-200"
                        >
                          💸 {y}
                        </button>
                      </DropdownMenu.Item>
                    ))}
                  </DropdownMenu.SubContent>
                </DropdownMenuPrimitive.Portal>
              </DropdownMenu.Sub>

              {/* Mixture */}
              <DropdownMenu.Sub>
                <DropdownMenu.SubTrigger className="flex justify-between items-center font-semibold cursor-pointer hover:text-[#FFD700] hover:translate-x-1 transition-all duration-300">
                  Mixture <span className="ml-3 text-[#FFD700]">▸</span>
                </DropdownMenu.SubTrigger>

                <DropdownMenuPrimitive.Portal>
                  <DropdownMenu.SubContent
                    className="bg-gradient-to-br from-white via-gray-50 to-gray-100 shadow-2xl border border-white/40 rounded-2xl py-5 px-8 space-y-3 mt-3 text-2xl z-[99999] backdrop-blur-xl animate-fade-in-menu"
                  >
                    {[2024, 2025, 2026].map((y) => (
                      <DropdownMenu.Item key={y}>
                        <button
                          onClick={() => router.push(`/dashboard/mixture/${y}`)}
                          className="flex items-center gap-3 w-full text-left text-gray-700 hover:text-[#2C3E50] font-medium hover:bg-[#FFD700]/10 px-4 py-2 rounded-xl transition-all duration-200"
                        >
                          ⚖️ {y}
                        </button>
                      </DropdownMenu.Item>
                    ))}
                  </DropdownMenu.SubContent>
                </DropdownMenuPrimitive.Portal>
              </DropdownMenu.Sub>
            </DropdownMenu.Content>
          </DropdownMenuPrimitive.Portal>
        </DropdownMenu.Root>

        {/* ⚙️ MANAGE */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className="transition-all duration-300 hover:text-[#FFD700] hover:scale-110">
            Manage
          </DropdownMenu.Trigger>

          <DropdownMenuPrimitive.Portal>
            <DropdownMenu.Content
              sideOffset={14}
              className="z-[99999] bg-gradient-to-br from-white/90 via-gray-50/90 to-gray-100/90 backdrop-blur-2xl border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.25)] rounded-3xl py-6 px-8 space-y-4 text-2xl font-serif text-[#2C3E50] animate-fade-in-menu"
            >
              {/* Input */}
              <DropdownMenu.Sub>
                <DropdownMenu.SubTrigger className="flex justify-between items-center font-semibold cursor-pointer hover:text-[#FFD700] hover:translate-x-1 transition-all duration-300">
                  ✏️ Input <span className="ml-3 text-[#FFD700]">▸</span>
                </DropdownMenu.SubTrigger>

                <DropdownMenuPrimitive.Portal>
                  <DropdownMenu.SubContent
                    className="bg-gradient-to-br from-white via-gray-50 to-gray-100 shadow-2xl border border-white/40 rounded-2xl py-5 px-8 space-y-3 mt-3 text-2xl z-[99999] backdrop-blur-xl animate-fade-in-menu"
                  >
                    <DropdownMenu.Item>
                      <button
                        onClick={() => router.push("/dashboard/input/income")}
                        className="w-full text-left hover:text-[#2C3E50] hover:bg-[#FFD700]/10 px-4 py-2 rounded-xl transition-all"
                      >
                        💰 Income
                      </button>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item>
                      <button
                        onClick={() => router.push("/dashboard/input/spending")}
                        className="w-full text-left hover:text-[#2C3E50] hover:bg-[#FFD700]/10 px-4 py-2 rounded-xl transition-all"
                      >
                        💸 Spending
                      </button>
                    </DropdownMenu.Item>
                  </DropdownMenu.SubContent>
                </DropdownMenuPrimitive.Portal>
              </DropdownMenu.Sub>

              {/* Edit */}
              <DropdownMenu.Sub>
                <DropdownMenu.SubTrigger className="flex justify-between items-center font-semibold cursor-pointer hover:text-[#FFD700] hover:translate-x-1 transition-all duration-300">
                  🛠️ Edit <span className="ml-3 text-[#FFD700]">▸</span>
                </DropdownMenu.SubTrigger>

                <DropdownMenuPrimitive.Portal>
                  <DropdownMenu.SubContent
                    className="bg-gradient-to-br from-white via-gray-50 to-gray-100 shadow-2xl border border-white/40 rounded-2xl py-5 px-8 space-y-3 mt-3 text-2xl z-[99999] backdrop-blur-xl animate-fade-in-menu"
                  >
                    <DropdownMenu.Item>
                      <button
                        onClick={() => router.push("/dashboard/edit/income")}
                        className="w-full text-left hover:text-[#2C3E50] hover:bg-[#FFD700]/10 px-4 py-2 rounded-xl transition-all"
                      >
                        💰 Income
                      </button>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item>
                      <button
                        onClick={() => router.push("/dashboard/edit/spending")}
                        className="w-full text-left hover:text-[#2C3E50] hover:bg-[#FFD700]/10 px-4 py-2 rounded-xl transition-all"
                      >
                        💸 Spending
                      </button>
                    </DropdownMenu.Item>
                  </DropdownMenu.SubContent>
                </DropdownMenuPrimitive.Portal>
              </DropdownMenu.Sub>
            </DropdownMenu.Content>
          </DropdownMenuPrimitive.Portal>
        </DropdownMenu.Root>

        {/* 👤 PROFIL USER (🆕 tambahan) */}
        {user && (
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
              <MenuItem onClick={handleLogout}>🚪 Logout</MenuItem>
            </Menu>
          </div>
        )}
      </div>
    </nav>
  )
}