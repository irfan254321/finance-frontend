"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, IconButton, Menu, MenuItem, Divider } from "@mui/material"
import { Menu as MenuIcon, Close as CloseIcon, ExpandMore, ExpandLess, ChevronRight } from "@mui/icons-material"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/context/AuthContext"

export default function NavbarAdmin() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [openSub, setOpenSub] = useState<string | null>(null)

  const toggleMobile = () => setMobileOpen(!mobileOpen)
  const toggleMenu = (menu: string) => setOpenMenu(openMenu === menu ? null : menu)
  const toggleSub = (key: string) => setOpenSub(openSub === key ? null : key)
  const handleMenuOpen = (e: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget)
  const handleMenuClose = () => setAnchorEl(null)

  const navButtons = [
    { label: "Dashboard", route: "/dashboard" },
    { label: "Register", route: "/dashboard/admin/register" },
    { label: "Contents", route: "/dashboard/admin/slide" },
  ]

  const financeItems = [
    { label: "💰 Income", route: "/dashboard/income" },
    { label: "💸 Spending", route: "/dashboard/spending" },
    { label: "⚖️ Mixture", route: "/dashboard/mixture" },
  ]

  const manageItems = [
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
  ]

  return (
    <nav className="fixed top-0 left-0 w-full z-[9999] text-[#EBD77A] font-serif bg-gradient-to-br from-[#1a2732]/97 via-[#2C3E50]/95 to-[#1a2732]/97 backdrop-blur-lg border-b border-[#EBD77A]/15 shadow-[0_2px_25px_rgba(0,0,0,0.4)]">
      <div className="flex justify-between items-center px-6 md:px-16 h-20">
        {/* ===== LOGO ===== */}
        <h1
          onClick={() => router.push("/dashboard")}
          className="relative text-xl font-bold cursor-pointer select-none hover:text-[#FFD970] transition-all duration-200 tracking-wide group"
        >
          RS BHAYANGKARA
          <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#FFD970] rounded-full transition-all duration-300 ease-out group-hover:w-full"></span>
        </h1>

        {/* ===== DESKTOP MENU ===== */}
        <div className="hidden md:flex items-center space-x-10 text-[15px] relative">
          {/* ===== FINANCE ===== */}
          <div className="relative">
            <button
              onClick={() => toggleMenu("finance")}
              className={`relative group px-2 font-semibold cursor-pointer select-none transition-all ease-out ${openMenu === "finance"
                ? "text-[#FFD970] drop-shadow-[0_0_6px_rgba(255,217,112,0.4)]"
                : "text-[#EBD77A]"
                }`}
            >
              Finance
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#FFD970] rounded-full transition-all duration-300 ease-out group-hover:w-full"></span>
            </button>

            <AnimatePresence>
              {openMenu === "finance" && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="absolute left-0 mt-3 min-w-[240px] bg-gradient-to-br from-[#1a2732]/98 via-[#2C3E50]/96 to-[#1a2732]/98 border border-[#EBD77A]/25 rounded-xl shadow-[0_8px_25px_rgba(235,215,122,0.15)] p-3 space-y-1"
                >
                  {financeItems.map((item) => (
                    <div key={item.label} className="relative group">
                      <button
                        onClick={() => toggleSub(item.label)}
                        className="flex justify-between items-center w-full text-left px-3 py-2 text-[#EDE3B5] font-medium rounded-lg cursor-pointer select-none hover:bg-white/5 hover:text-[#FFD970] transition-all duration-200 ease-out"
                      >
                        {item.label}
                        <ChevronRight
                          className={`transition-transform ${openSub === item.label
                            ? "rotate-90 text-[#FFD970]"
                            : "text-[#EBD77A]/70"
                            }`}
                          fontSize="small"
                        />
                      </button>

                      <AnimatePresence>
                        {openSub === item.label && (
                          <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-0 left-full ml-3 min-w-[130px] bg-gradient-to-br from-[#1a2732]/98 via-[#2C3E50]/96 to-[#1a2732]/98 border border-[#EBD77A]/25 rounded-xl shadow-[0_6px_20px_rgba(235,215,122,0.15)] p-2 space-y-1"
                          >
                            {[2024, 2025, 2026].map((year) => (
                              <button
                                key={year}
                                onClick={() => {
                                  router.push(`${item.route}/${year}`)
                                  setOpenMenu(null)
                                  setOpenSub(null)
                                }}
                                className="block w-full text-left px-3 py-1.5 text-sm text-[#F6F1D3] cursor-pointer select-none hover:text-[#FFD970] hover:bg-white/10 rounded-md transition-all ease-out"
                              >
                                📆 {year}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ===== MANAGE ===== */}
          <div className="relative">
            <button
              onClick={() => toggleMenu("manage")}
              className={`relative group px-2 font-semibold cursor-pointer select-none transition-all ease-out ${openMenu === "manage"
                ? "text-[#FFD970] drop-shadow-[0_0_6px_rgba(255,217,112,0.4)]"
                : "text-[#EBD77A]"
                }`}
            >
              Manage
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#FFD970] rounded-full transition-all duration-300 ease-out group-hover:w-full"></span>
            </button>

            <AnimatePresence>
              {openMenu === "manage" && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="absolute left-0 mt-3 min-w-[240px] bg-gradient-to-br from-[#1a2732]/98 via-[#2C3E50]/96 to-[#1a2732]/98 border border-[#EBD77A]/25 rounded-xl shadow-[0_8px_25px_rgba(235,215,122,0.15)] p-3 space-y-1"
                >
                  {manageItems.map((section) => (
                    <div key={section.label} className="relative group">
                      <button
                        onClick={() => toggleSub(section.label)}
                        className="flex justify-between items-center w-full text-left px-3 py-2 text-[#EDE3B5] font-medium rounded-lg cursor-pointer select-none hover:bg-white/5 hover:text-[#FFD970] transition-all duration-200 ease-out"
                      >
                        {section.label}
                        <ChevronRight
                          className={`transition-transform ${openSub === section.label
                            ? "rotate-90 text-[#FFD970]"
                            : "text-[#EBD77A]/70"
                            }`}
                          fontSize="small"
                        />
                      </button>

                      <AnimatePresence>
                        {openSub === section.label && (
                          <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-0 left-full ml-3 min-w-[160px] bg-gradient-to-br from-[#1a2732]/98 via-[#2C3E50]/96 to-[#1a2732]/98 border border-[#EBD77A]/25 rounded-xl shadow-[0_6px_20px_rgba(235,215,122,0.15)] p-2 space-y-1"
                          >
                            {section.routes.map((r) => (
                              <button
                                key={r.path}
                                onClick={() => {
                                  router.push(r.path)
                                  setOpenMenu(null)
                                  setOpenSub(null)
                                }}
                                className="block w-full text-left px-3 py-1.5 text-sm text-[#F6F1D3] cursor-pointer select-none hover:text-[#FFD970] hover:bg-white/10 rounded-md transition-all ease-out"
                              >
                                {r.name}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ===== STATIC BUTTONS ===== */}
          {navButtons.map((btn) => (
            <button
              key={btn.label}
              onClick={() => {
                router.push(btn.route)
                setOpenMenu(null)
                setOpenSub(null)
              }}
              className="relative group font-semibold text-[#EBD77A] hover:text-[#FFD970] cursor-pointer select-none drop-shadow-[0_0_6px_rgba(235,215,122,0.25)] transition-all ease-out"
            >
              {btn.label}
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#FFD970] rounded-full transition-all duration-300 ease-out group-hover:w-full"></span>
            </button>
          ))}
        </div>

        {/* ===== USER AVATAR ===== */}
        {user && (
          <div className="hidden md:flex items-center gap-4 border border-[#EBD77A]/30 rounded-full px-5 py-2 bg-[#1a2732]/70 shadow-[0_0_25px_rgba(235,215,122,0.15)] select-none">
            <div className="flex flex-col items-end leading-tight">
              <span className="text-[#FFD970] font-semibold">{user.name_users}</span>
              <span className="text-[#F4E1C1] text-[13px]">{user.role.toUpperCase()}</span>
            </div>
            <IconButton onClick={handleMenuOpen} className="!p-0 cursor-pointer">
              <Avatar
                alt={user.name_users}
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name_users}`}
                sx={{
                  width: 44,
                  height: 44,
                  border: "2px solid #EBD77A",
                  backgroundColor: "#2C3E50",
                }}
              />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  borderRadius: "16px",
                  background: "rgba(25,30,40,0.95)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(235,215,122,0.3)",
                  color: "white",
                },
              }}
            >
              <MenuItem onClick={() => router.push("/dashboard/profile")}>📁 Profile</MenuItem>
              <Divider />
              <MenuItem onClick={logout}>🚪 Logout</MenuItem>
            </Menu>
          </div>
        )}
        
        {/* ===== MOBILE BURGER ===== */}
        <div className="md:hidden">
          <IconButton onClick={toggleMobile} className="text-[#EBD77A]">
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </div>
      </div>

      {/* ===== MOBILE PANEL ===== */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-20 right-0 w-[80%] h-[calc(100vh-80px)] bg-gradient-to-b from-[#1a2732]/97 via-[#2C3E50]/96 to-[#1a2732]/97 border-l border-[#EBD77A]/15 p-6 flex flex-col gap-4 text-[#EBD77A] md:hidden z-[9999] overflow-y-auto"
          >
            {[
              { title: "Dashboard", action: () => router.push("/dashboard") },
              { title: "Finance", subKey: "finance" },
              { title: "Manage", subKey: "manage" },
              { title: "Register", action: () => router.push("/dashboard/admin/register") },
              { title: "Contents", action: () => router.push("/dashboard/admin/slide") },
            ].map((item) => (
              <div key={item.title}>
                <button
                  onClick={() =>
                    item.subKey ? toggleMenu(item.subKey) : item.action && item.action()
                  }
                  className="flex justify-between items-center w-full text-left text-lg font-semibold hover:text-[#FFD970]"
                >
                  {item.title}
                  {item.subKey &&
                    (openMenu === item.subKey ? <ExpandLess /> : <ExpandMore />)}
                </button>

                {/* === Submenus Mobile === */}
                <AnimatePresence>
                  {openMenu === "finance" && item.subKey === "finance" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="ml-4 mt-2 space-y-3 text-sm"
                    >
                      {financeItems.map((f) => (
                        <div key={f.label}>
                          <span className="font-semibold text-[#FFD970]">{f.label}</span>
                          <div className="ml-4 mt-1 space-y-1">
                            {[2024, 2025, 2026].map((y) => (
                              <button
                                key={y}
                                onClick={() => {
                                  router.push(`${f.route}/${y}`)
                                  setMobileOpen(false)
                                }}
                                className="block text-left hover:text-[#FFD970] text-[#F4E1C1]"
                              >
                                📆 {y}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {openMenu === "manage" && item.subKey === "manage" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="ml-4 mt-2 space-y-3 text-sm"
                    >
                      {manageItems.map((m) => (
                        <div key={m.label}>
                          <span className="font-semibold text-[#FFD970]">{m.label}</span>
                          <div className="ml-4 mt-1 space-y-1">
                            {m.routes.map((r) => (
                              <button
                                key={r.path}
                                onClick={() => {
                                  router.push(r.path)
                                  setMobileOpen(false)
                                }}
                                className="block text-left hover:text-[#FFD970] text-[#F4E1C1]"
                              >
                                {r.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            <Divider className="!border-[#EBD77A]/20 my-4" />

            {user && (
              <>
                <button
                  onClick={() => router.push("/dashboard/profile")}
                  className="text-left text-lg hover:text-[#FFD970]"
                >
                  📁 Profile
                </button>
                <button
                  onClick={logout}
                  className="text-left text-lg hover:text-[#FFD970]"
                >
                  🚪 Logout
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
