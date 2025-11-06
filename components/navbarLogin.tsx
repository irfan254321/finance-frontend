"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, IconButton, Divider, Menu, MenuItem } from "@mui/material"
import { Menu as MenuIcon, Close as CloseIcon, ExpandMore, ExpandLess, ChevronRight } from "@mui/icons-material"
import { motion, AnimatePresence } from "framer-motion"
import axiosInstance from "@/lib/axiosInstance"
import { useAuth } from "@/context/AuthContext"

export default function NavbarLogin() {
  const router = useRouter()
  const { user, loading } = useAuth()

  // === STATES ===
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileSub, setMobileSub] = useState<string | null>(null) // khusus mobile
  const [desktopMenu, setDesktopMenu] = useState<string | null>(null) // "finance" | "manage" | null
  const [desktopSub, setDesktopSub] = useState<string | null>(null) // label item di dalam dropdown
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const toggleMobile = () => setMobileOpen((p) => !p)
  const toggleMobileSub = (key: string) => setMobileSub((p) => (p === key ? null : key))

  const toggleDesktopMenu = (key: string) => {
    // kalo klik menu yg sama → tutup
    if (desktopMenu === key) {
      setDesktopMenu(null)
      setDesktopSub(null)
    } else {
      setDesktopMenu(key)
      setDesktopSub(null)
    }
  }

  const toggleDesktopSub = (key: string) => {
    setDesktopSub((p) => (p === key ? null : key))
  }

  const handleMenuOpen = (e: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget)
  const handleMenuClose = () => setAnchorEl(null)

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

  if (loading)
    return (
      <div className="fixed top-0 left-0 w-full h-20 flex justify-center items-center bg-[#1a2732]/90 backdrop-blur-md text-[#FFD970] font-serif">
        Loading...
      </div>
    )

  return (
    <nav className="fixed top-0 left-0 w-full z-[9999] text-[#EBD77A] font-serif bg-gradient-to-br from-[#1a2732]/97 via-[#2C3E50]/95 to-[#1a2732]/97 backdrop-blur-lg border-b border-[#EBD77A]/15 shadow-[0_2px_25px_rgba(0,0,0,0.4)] select-none">
      <div className="flex justify-between items-center px-6 md:px-16 h-20">
        {/* === LOGO === */}
        <div
          onClick={() => router.push(user ? "/dashboard" : "/")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <img src="/rs-bhayangkara-logo-v2.ico" className="w-9 h-9" alt="logo" />
          <h1 className="relative text-xl font-bold text-[#EBD77A] hover:text-[#FFD970] transition-all group-hover:drop-shadow-[0_0_6px_rgba(235,215,122,0.3)]">
            RS BHAYANGKARA
            <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#FFD970] rounded-full transition-all duration-300 ease-out group-hover:w-full"></span>
          </h1>
        </div>

        {/* === DESKTOP MENU === */}
        <div className="hidden md:flex items-center space-x-10 text-[15px] relative">
          {user ? (
            <>
              {/* Dashboard biasa */}
              <NavButton
                label="Dashboard"
                onClick={() => {
                  router.push("/dashboard")
                  setDesktopMenu(null)
                  setDesktopSub(null)
                }}
              />

              {/* ===== FINANCE (CLICK) ===== */}
              <div className="relative">
                <button
                  onClick={() => toggleDesktopMenu("finance")}
                  className={`px-2 font-semibold transition-all flex items-center gap-1 ${
                    desktopMenu === "finance"
                      ? "text-[#FFD970] drop-shadow-[0_0_6px_rgba(255,217,112,0.4)]"
                      : "text-[#EBD77A]"
                  }`}
                >
                  Finance
                  <span
                    className={`transition-transform ${
                      desktopMenu === "finance" ? "rotate-180" : ""
                    }`}
                  >
                    <ExpandMore fontSize="small" />
                  </span>
                </button>

                <AnimatePresence>
                  {desktopMenu === "finance" && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.22 }}
                      className="absolute left-0 mt-3 min-w-[240px] bg-gradient-to-br from-[#1a2732]/98 via-[#2C3E50]/96 to-[#1a2732]/98 border border-[#EBD77A]/25 rounded-xl shadow-[0_8px_25px_rgba(235,215,122,0.15)] p-3 space-y-1 z-[9999]"
                    >
                      {financeItems.map((item) => (
                        <div key={item.label} className="relative">
                          <button
                            onClick={() => toggleDesktopSub(item.label)}
                            className="flex justify-between items-center w-full text-left px-3 py-2 text-[#EDE3B5] font-medium rounded-lg hover:bg-white/5 hover:text-[#FFD970] transition-all"
                          >
                            {item.label}
                            <ExpandMore
                              fontSize="small"
                              className={`transition-transform ${
                                desktopSub === item.label ? "rotate-90 text-[#FFD970]" : ""
                              }`}
                            />
                          </button>

                          {/* submenu tahun */}
                          <AnimatePresence>
                            {desktopSub === item.label && (
                              <motion.div
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                transition={{ duration: 0.18 }}
                                className="absolute top-0 left-full ml-3 min-w-[130px] bg-gradient-to-br from-[#1a2732]/98 via-[#2C3E50]/96 to-[#1a2732]/98 border border-[#EBD77A]/25 rounded-xl shadow-[0_6px_20px_rgba(235,215,122,0.15)] p-2 space-y-1"
                              >
                                {[2024, 2025, 2026].map((year) => (
                                  <button
                                    key={year}
                                    onClick={() => {
                                      router.push(`${item.route}/${year}`)
                                      setDesktopMenu(null)
                                      setDesktopSub(null)
                                    }}
                                    className="block w-full text-left px-3 py-1.5 text-sm text-[#F6F1D3] hover:text-[#FFD970] hover:bg-white/10 rounded-md transition-all"
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

              {/* ===== MANAGE (CLICK) ===== */}
              <div className="relative">
                <button
                  onClick={() => toggleDesktopMenu("manage")}
                  className={`px-2 font-semibold transition-all flex items-center gap-1 ${
                    desktopMenu === "manage"
                      ? "text-[#FFD970] drop-shadow-[0_0_6px_rgba(255,217,112,0.4)]"
                      : "text-[#EBD77A]"
                  }`}
                >
                  Manage
                  <span
                    className={`transition-transform ${
                      desktopMenu === "manage" ? "rotate-180" : ""
                    }`}
                  >
                    <ExpandMore fontSize="small" />
                  </span>
                </button>

                <AnimatePresence>
                  {desktopMenu === "manage" && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.22 }}
                      className="absolute left-0 mt-3 min-w-[240px] bg-gradient-to-br from-[#1a2732]/98 via-[#2C3E50]/96 to-[#1a2732]/98 border border-[#EBD77A]/25 rounded-xl shadow-[0_8px_25px_rgba(235,215,122,0.15)] p-3 space-y-1 z-[9999]"
                    >
                      {manageItems.map((section) => (
                        <div key={section.label} className="relative">
                          <button
                            onClick={() => toggleDesktopSub(section.label)}
                            className="flex justify-between items-center w-full text-left px-3 py-2 text-[#EDE3B5] font-medium rounded-lg hover:bg-white/5 hover:text-[#FFD970] transition-all"
                          >
                            {section.label}
                            <ExpandMore
                              fontSize="small"
                              className={`transition-transform ${
                                desktopSub === section.label ? "rotate-90 text-[#FFD970]" : ""
                              }`}
                            />
                          </button>

                          <AnimatePresence>
                            {desktopSub === section.label && (
                              <motion.div
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                transition={{ duration: 0.18 }}
                                className="absolute top-0 left-full ml-3 min-w-[160px] bg-gradient-to-br from-[#1a2732]/98 via-[#2C3E50]/96 to-[#1a2732]/98 border border-[#EBD77A]/25 rounded-xl shadow-[0_6px_20px_rgba(235,215,122,0.15)] p-2 space-y-1"
                              >
                                {section.routes.map((r) => (
                                  <button
                                    key={r.path}
                                    onClick={() => {
                                      router.push(r.path)
                                      setDesktopMenu(null)
                                      setDesktopSub(null)
                                    }}
                                    className="block w-full text-left px-3 py-1.5 text-sm text-[#F6F1D3] hover:text-[#FFD970] hover:bg-white/10 rounded-md transition-all"
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

              {/* PROFILE */}
              <Profile
                user={user}
                router={router}
                anchorEl={anchorEl}
                handleMenuOpen={handleMenuOpen}
                handleMenuClose={handleMenuClose}
              />
            </>
          ) : (
            <>
              <NavButton
                label="Home"
                onClick={() => {
                  router.push("/")
                  setDesktopMenu(null)
                  setDesktopSub(null)
                }}
              />
              <NavButton
                label="Login"
                onClick={() => {
                  router.push("/login")
                  setDesktopMenu(null)
                  setDesktopSub(null)
                }}
              />
            </>
          )}
        </div>

        {/* === MOBILE MENU BUTTON === */}
        <div className="md:hidden flex items-center">
          <IconButton onClick={toggleMobile} className="text-[#EBD77A] cursor-pointer">
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </div>
      </div>

      {/* === MOBILE PANEL === */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 70, damping: 20 }}
            className="fixed top-20 right-0 w-[80%] h-[calc(100vh-80px)] bg-gradient-to-b from-[#1a2732]/97 via-[#2C3E50]/96 to-[#1a2732]/97 border-l border-[#EBD77A]/15 p-6 flex flex-col gap-4 text-[#EBD77A] md:hidden z-[9999] overflow-y-auto"
          >
            {user ? (
              <>
                <MobileItem
                  label="Dashboard"
                  onClick={() => {
                    router.push("/dashboard")
                    setMobileOpen(false)
                  }}
                />

                <SubMobileMenu
                  title="Finance"
                  open={mobileSub === "finance"}
                  toggle={() => toggleMobileSub("finance")}
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
                            className="block text-left text-[#F4E1C1] hover:text-[#FFD970]"
                          >
                            📆 {y}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </SubMobileMenu>

                <SubMobileMenu
                  title="Manage"
                  open={mobileSub === "manage"}
                  toggle={() => toggleMobileSub("manage")}
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
                            className="block text-left text-[#F4E1C1] hover:text-[#FFD970]"
                          >
                            {r.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </SubMobileMenu>

                <Divider className="!border-[#EBD77A]/20 my-4" />

                <MobileItem
                  label="Profile"
                  onClick={() => {
                    router.push("/dashboard/profile")
                    setMobileOpen(false)
                  }}
                />
                <MobileItem
                  label="Logout"
                  onClick={async () => {
                    await axiosInstance.post("/logout")
                    localStorage.clear()
                    sessionStorage.clear()
                    document.cookie = "token=; Max-Age=0; path=/;"
                    window.location.assign("/login")
                  }}
                />
              </>
            ) : (
              <>
                <MobileItem
                  label="Home"
                  onClick={() => {
                    router.push("/")
                    setMobileOpen(false)
                  }}
                />
                <MobileItem
                  label="Login"
                  onClick={() => {
                    router.push("/login")
                    setMobileOpen(false)
                  }}
                />
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

/* ---------- COMPONENTS ---------- */

function NavButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="relative group font-semibold text-[#EBD77A] hover:text-[#FFD970] cursor-pointer select-none transition-all ease-out"
    >
      {label}
      <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#FFD970] rounded-full transition-all duration-300 ease-out group-hover:w-full"></span>
    </button>
  )
}

function MobileItem({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-left text-lg text-[#EBD77A] font-medium hover:text-[#FFD970] transition-all ease-out"
    >
      {label}
    </button>
  )
}

function SubMobileMenu({ title, open, toggle, children }: any) {
  return (
    <div>
      <button
        onClick={toggle}
        className="flex justify-between items-center w-full text-left text-lg font-medium text-[#EBD77A] hover:text-[#FFD970] transition-all ease-out"
      >
        {title}
        {open ? <ExpandLess /> : <ExpandMore />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="ml-4 mt-2 text-sm text-[#FFD970]"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Profile({ user, router, anchorEl, handleMenuOpen, handleMenuClose }: any) {
  return (
    <div className="flex items-center gap-4 border border-[#EBD77A]/30 rounded-full px-5 py-2 bg-[#1a2732]/70 shadow-[0_0_25px_rgba(235,215,122,0.15)]">
      <div className="flex flex-col items-end leading-tight select-none">
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
        <MenuItem
          onClick={async () => {
            await axiosInstance.post("/logout")
            localStorage.clear()
            sessionStorage.clear()
            document.cookie = "token=; Max-Age=0; path=/;"
            window.location.assign("/login")
          }}
        >
          🚪 Logout
        </MenuItem>
      </Menu>
    </div>
  )
}
