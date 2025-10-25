"use client"

import { DropdownMenu, DropdownMenu as DropdownMenuPrimitive } from "radix-ui"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Avatar, Menu, MenuItem, IconButton, Divider } from "@mui/material"
import { useAuth } from "@/context/AuthContext"

export default function NavbarAdmin() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleMenuOpen = (e: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget)
  const handleMenuClose = () => setAnchorEl(null)

  return (
    <nav className="fixed top-0 left-0 w-full z-[99999] bg-gradient-to-b from-[#0f141a]/90 via-[#1c2430]/85 to-[#12171d]/80 backdrop-blur-2xl border-b border-white/10 shadow-[0_4px_25px_rgba(0,0,0,0.3)]">
      <div className="flex justify-center items-center h-24 font-serif text-sm md:text-base text-gray-100 space-x-12 select-none">

        {/* DASHBOARD */}
        <button
          onClick={() => router.push("/dashboard")}
          className="relative group px-3 transition-all duration-300"
        >
          <span className="group-hover:text-[#FFD700]">Dashboard</span>
          <div className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#FFD700] rounded-full transition-all duration-300 group-hover:w-full"></div>
        </button>

        {/* FINANCE */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className="relative group px-3 transition-all duration-300">
            <span className="group-hover:text-[#FFD700]">Finance</span>
            <div className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#FFD700] rounded-full transition-all duration-300 group-hover:w-full"></div>
          </DropdownMenu.Trigger>

          <DropdownMenuPrimitive.Portal>
            <DropdownMenu.Content
              sideOffset={12}
              className="z-[99999] min-w-[200px] bg-gradient-to-br from-[#0f141a]/90 via-[#1c2430]/90 to-[#12171d]/90 border border-white/10 backdrop-blur-2xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-4 space-y-3 text-sm text-gray-100 animate-fade-in-menu"
            >
              {[
                { label: "Income", icon: "📅", route: "/dashboard/income" },
                { label: "Spending", icon: "💸", route: "/dashboard/spending" },
                { label: "Mixture", icon: "⚖️", route: "/dashboard/mixture" },
              ].map((item) => (
                <DropdownMenu.Sub key={item.label}>
                  <DropdownMenu.SubTrigger className="flex justify-between items-center w-full cursor-pointer hover:text-[#FFD700] transition-all duration-200">
                    {item.label}
                    <span className="text-[#FFD700] ml-1">▸</span>
                  </DropdownMenu.SubTrigger>
                  <DropdownMenuPrimitive.Portal>
                    <DropdownMenu.SubContent className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#1a1f27]/95 via-[#1f2630]/95 to-[#1a1f27]/95 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-3 space-y-2 mt-2 text-gray-100">
                      {[2024, 2025, 2026].map((y) => (
                        <DropdownMenu.Item key={y}>
                          <button
                            onClick={() => router.push(`${item.route}/${y}`)}
                            className="flex items-center gap-2 w-full text-left text-sm px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-200"
                          >
                            {item.icon} {y}
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

        {/* MANAGE */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className="relative group px-3 transition-all duration-300">
            <span className="group-hover:text-[#FFD700]">Manage</span>
            <div className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#FFD700] rounded-full transition-all duration-300 group-hover:w-full"></div>
          </DropdownMenu.Trigger>

          <DropdownMenuPrimitive.Portal>
            <DropdownMenu.Content
              sideOffset={12}
              className="z-[99999] min-w-[200px] bg-gradient-to-br from-[#0f141a]/90 via-[#1c2430]/90 to-[#12171d]/90 border border-white/10 backdrop-blur-2xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-4 space-y-3 text-sm text-gray-100 animate-fade-in-menu"
            >
              {[
                {
                  label: "✏️ Input",
                  routes: [
                    { name: "💰 Income", path: "/dashboard/input/income" },
                    { name: "💸 Spending", path: "/dashboard/input/spending" },
                  ],
                },
                {
                  label: "🛠️ Edit",
                  routes: [
                    { name: "💰 Income", path: "/dashboard/edit/income" },
                    { name: "💸 Spending", path: "/dashboard/edit/spending" },
                  ],
                },
              ].map((menu) => (
                <DropdownMenu.Sub key={menu.label}>
                  <DropdownMenu.SubTrigger className="flex justify-between items-center cursor-pointer hover:text-[#FFD700] transition-all duration-200">
                    {menu.label}
                    <span className="text-[#FFD700] ml-1">▸</span>
                  </DropdownMenu.SubTrigger>

                  <DropdownMenuPrimitive.Portal>
                    <DropdownMenu.SubContent className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#1a1f27]/95 via-[#1f2630]/95 to-[#1a1f27]/95 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-3 space-y-2 mt-2 text-gray-100">
                      {menu.routes.map((r) => (
                        <DropdownMenu.Item key={r.path}>
                          <button
                            onClick={() => router.push(r.path)}
                            className="w-full text-left text-sm px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-200"
                          >
                            {r.name}
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

        {/* 🧑‍💼 ADMIN PROFILE */}
        {user && (
          <div className="flex items-center gap-4 absolute right-10 top-5 bg-gradient-to-br from-[#0f141a]/95 via-[#1c2430]/90 to-[#12171d]/90 backdrop-blur-2xl border border-[#FFD700]/20 rounded-full pl-6 pr-4 py-2.5 shadow-[0_4px_25px_rgba(255,215,0,0.15)] hover:shadow-[0_4px_25px_rgba(255,215,0,0.25)] transition-all duration-300">

            {/* TEKS ADMIN */}
            <div className="flex flex-col items-end leading-tight select-none">
              <span className="text-[#FFD700] font-semibold text-[15px] tracking-wide drop-shadow-[0_1px_3px_rgba(255,215,0,0.3)]">
                {user.name_users}
              </span>
              <span className="text-gray-300 text-[13px] font-medium">
                {user.role.toUpperCase()}
              </span>
            </div>

            {/* AVATAR */}
            <IconButton onClick={handleMenuOpen} className="!p-0 hover:scale-105 transition-transform duration-300">
              <Avatar
                alt={user.name_users}
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name_users}`}
                sx={{
                  width: 52,
                  height: 52,
                  border: "2px solid #FFD700",
                  boxShadow: "0 0 15px rgba(255,215,0,0.3)",
                  backgroundColor: "#1a1f27",
                }}
              />
            </IconButton>

            {/* DROPDOWN MENU */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  borderRadius: "16px",
                  background: "rgba(18,23,29,0.9)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "white",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
                },
              }}
            >
              <MenuItem
                onClick={() => {
                  handleMenuClose()
                  router.push("/dashboard/profile")
                }}
              >
                📁 Profile
              </MenuItem>
              <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />
              <MenuItem
                onClick={() => {
                  handleMenuClose()
                  logout()
                }}
              >
                🚪 Logout
              </MenuItem>
            </Menu>
          </div>
        )}

        {/* REGISTER */}
        <button
          onClick={() => router.push("/dashboard/admin/register")}
          className="relative group px-3 transition-all duration-300"
        >
          <span className="group-hover:text-[#FFD700]">Register</span>
          <div className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#FFD700] rounded-full transition-all duration-300 group-hover:w-full"></div>
        </button>

        {/* CONTENTS */}
        <button
          onClick={() => router.push("/dashboard/admin/slide")}
          className="relative group px-3 transition-all duration-300"
        >
          <span className="group-hover:text-[#FFD700]">Contents</span>
          <div className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#FFD700] rounded-full transition-all duration-300 group-hover:w-full"></div>
        </button>
      </div>
    </nav>
  )
}
