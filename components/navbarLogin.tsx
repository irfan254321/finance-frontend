"use client"

import { useState } from "react"
import Link from "next/link"
import { Avatar, IconButton, Divider, Menu, MenuItem } from "@mui/material"
import { Menu as MenuIcon, Close as CloseIcon, ExpandMore, ExpandLess } from "@mui/icons-material"
import { motion, AnimatePresence } from "framer-motion"
import axiosInstance from "@/lib/axiosInstance"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"

export default function NavbarLogin() {
  const router = useRouter()
  const { user, loading } = useAuth()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileSub, setMobileSub] = useState<string | null>(null)
  const [desktopMenu, setDesktopMenu] = useState<string | null>(null)
  const [desktopSub, setDesktopSub] = useState<string | null>(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const toggleMobile = () => setMobileOpen((p) => !p)
  const toggleMobileSub = (key: string) => setMobileSub((p) => (p === key ? null : key))

  const toggleDesktopMenu = (key: string) => {
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
        <Link
          href={user ? "/dashboard" : "/"}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <img src="/rs-bhayangkara-logo-v2.ico" className="w-9 h-9" alt="logo" />
          <h1 className="relative text-xl font-bold text-[#EBD77A] hover:text-[#FFD970] transition-all group-hover:drop-shadow-[0_0_6px_rgba(235,215,122,0.3)]">
            RS BHAYANGKARA
            <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#FFD970] rounded-full transition-all duration-300 ease-out group-hover:w-full"></span>
          </h1>
        </Link>

        {/* === DESKTOP MENU === */}
        <div className="hidden md:flex items-center space-x-10 text-[15px] relative">

          {/* Logged IN */}
          {user ? (
            <>
              {/* Dashboard */}
              <LinkButton label="Dashboard" href="/dashboard" />

              {/* === FINANCE MENU === */}
              <DesktopDropdown
                menuKey="finance"
                desktopMenu={desktopMenu}
                toggleDesktopMenu={toggleDesktopMenu}
                desktopSub={desktopSub}
                toggleDesktopSub={toggleDesktopSub}
                items={financeItems}
              />

              {/* === MANAGE MENU === */}
              <DesktopDropdown
                menuKey="manage"
                desktopMenu={desktopMenu}
                toggleDesktopMenu={toggleDesktopMenu}
                desktopSub={desktopSub}
                toggleDesktopSub={toggleDesktopSub}
                items={manageItems}
                isManage
              />

              {/* PROFILE */}
              <ProfileDropdown
                user={user}
                anchorEl={anchorEl}
                handleMenuOpen={handleMenuOpen}
                handleMenuClose={handleMenuClose}
                router={router}
              />
            </>
          ) : (
            <>
              <LinkButton label="Home" href="/" />
              <LinkButton label="Login" href="/login" />
            </>
          )}
        </div>

        {/* === MOBILE ICON === */}
        <div className="md:hidden">
          <IconButton onClick={toggleMobile} className="text-[#EBD77A] cursor-pointer">
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </div>
      </div>

      {/* === MOBILE MENU === */}
      <AnimatePresence>
        {mobileOpen && (
          <MobileMenu
            user={user}
            toggleMobileSub={toggleMobileSub}
            mobileSub={mobileSub}
            financeItems={financeItems}
            manageItems={manageItems}
            setMobileOpen={setMobileOpen}
          />
        )}
      </AnimatePresence>
    </nav>
  )
}

/* ------------------
    COMPONENTS
--------------------*/

function LinkButton({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      className="relative group font-semibold text-[#EBD77A] hover:text-[#FFD970] transition-all cursor-pointer"
    >
      {label}
      <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#FFD970] rounded-full transition-all duration-300 ease-out group-hover:w-full"></span>
    </Link>
  )
}

function DesktopDropdown({
  menuKey,
  desktopMenu,
  toggleDesktopMenu,
  desktopSub,
  toggleDesktopSub,
  items,
  isManage = false,
}: any) {
  return (
    <div className="relative">
      <button
        onClick={() => toggleDesktopMenu(menuKey)}
        className={`px-2 font-semibold transition-all flex items-center gap-1 ${desktopMenu === menuKey
            ? "text-[#FFD970] drop-shadow-[0_0_6px_rgba(255,217,112,0.4)]"
            : "text-[#EBD77A]"
          }`}
      >
        {isManage ? "Manage" : "Finance"}
        <ExpandMore className={`${desktopMenu === menuKey ? "rotate-180" : ""} transition-transform`} />
      </button>

      <AnimatePresence>
        {desktopMenu === menuKey && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="absolute left-0 mt-3 min-w-[240px] bg-[#1a2732]/95 border border-[#EBD77A]/25 rounded-xl shadow-lg p-3 space-y-1 z-[9999]"
          >
            {items.map((item: any) => (
              <DropdownSection
                key={item.label}
                item={item}
                desktopSub={desktopSub}
                toggleDesktopSub={toggleDesktopSub}
                isManage={isManage}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function DropdownSection({ item, desktopSub, toggleDesktopSub, isManage }: any) {
  return (
    <div className="relative">
      <button
        onClick={() => toggleDesktopSub(item.label)}
        className="flex justify-between items-center w-full text-left px-3 py-2 text-[#F4E1C1] hover:bg-white/5 hover:text-[#FFD970] rounded-lg"
      >
        {item.label}
        <ExpandMore
          className={`${desktopSub === item.label ? "rotate-270 text-[#FFD970]" : ""} transition-transform`}
        />
      </button>

      <AnimatePresence>
        {desktopSub === item.label && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.18 }}
            className="absolute top-0 left-full ml-3 min-w-[150px] bg-[#1a2732]/95 border border-[#EBD77A]/25 rounded-xl shadow-md p-2 space-y-1"
          >
            {isManage
              ? item.routes.map((r: any) => (
                <Link
                  key={r.path}
                  href={r.path}
                  className="block w-full px-3 py-1.5 text-sm text-[#F6F1D3] hover:bg-white/10 hover:text-[#FFD970] rounded-md"
                >
                  {r.name}
                </Link>
              ))
              : [2024, 2025, 2026].map((year: number) => (
                <Link
                  key={year}
                  href={`${item.route}/${year}`}
                  className="block w-full px-3 py-1.5 text-sm text-[#F6F1D3] hover:bg-white/10 hover:text-[#FFD970] rounded-md"
                >
                  📆 {year}
                </Link>
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ProfileDropdown({ user, anchorEl, handleMenuOpen, handleMenuClose, router }: any) {
  return (
    <div className="flex items-center gap-4 border border-[#EBD77A]/30 rounded-full px-5 py-2 bg-[#1a2732]/70 shadow-lg">
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

function MobileMenu({
  user,
  mobileSub,
  toggleMobileSub,
  financeItems,
  manageItems,
  setMobileOpen,
}: any) {
  return (
    <motion.div
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ type: "spring", stiffness: 65, damping: 18 }}
      className="fixed top-20 right-0 w-[80%] h-[calc(100vh-80px)] bg-[#1a2732]/97 border-l border-[#EBD77A]/15 p-6 flex flex-col gap-4 text-[#EBD77A] overflow-y-auto md:hidden"
    >
      {user ? (
        <>
          <LinkMobile href="/dashboard" setMobileOpen={setMobileOpen}>
            Dashboard
          </LinkMobile>

          <MobileDropdown
            title="Finance"
            open={mobileSub === "finance"}
            toggle={() => toggleMobileSub("finance")}
          >
            {financeItems.map((f: any) => (
              <div key={f.label}>
                <span className="font-semibold text-[#FFD970]">{f.label}</span>
                <div className="ml-4 mt-1 space-y-1">
                  {[2024, 2025, 2026].map((y) => (
                    <LinkMobile
                      key={y}
                      href={`${f.route}/${y}`}
                      setMobileOpen={setMobileOpen}
                    >
                      📆 {y}
                    </LinkMobile>
                  ))}
                </div>
              </div>
            ))}
          </MobileDropdown>

          <MobileDropdown
            title="Manage"
            open={mobileSub === "manage"}
            toggle={() => toggleMobileSub("manage")}
          >
            {manageItems.map((m: any) => (
              <div key={m.label}>
                <span className="font-semibold text-[#FFD970]">{m.label}</span>
                <div className="ml-4 mt-1 space-y-1">
                  {m.routes.map((r: any) => (
                    <LinkMobile
                      key={r.path}
                      href={r.path}
                      setMobileOpen={setMobileOpen}
                    >
                      {r.name}
                    </LinkMobile>
                  ))}
                </div>
              </div>
            ))}
          </MobileDropdown>

          <Divider className="!border-[#EBD77A]/20 my-4" />

          <LinkMobile href="/dashboard/profile" setMobileOpen={setMobileOpen}>
            Profile
          </LinkMobile>
          <button
            onClick={async () => {
              await axiosInstance.post("/logout")
              localStorage.clear()
              sessionStorage.clear()
              document.cookie = "token=; Max-Age=0; path=/;"
              window.location.assign("/login")
            }}
            className="text-left text-lg text-[#EBD77A] hover:text-[#FFD970]"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <LinkMobile href="/" setMobileOpen={setMobileOpen}>
            Home
          </LinkMobile>
          <LinkMobile href="/login" setMobileOpen={setMobileOpen}>
            Login
          </LinkMobile>
        </>
      )}
    </motion.div>
  )
}

function MobileDropdown({ title, open, toggle, children }: any) {
  return (
    <div>
      <button
        onClick={toggle}
        className="flex justify-between items-center w-full text-left text-lg font-medium text-[#EBD77A] hover:text-[#FFD970]"
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

function LinkMobile({ href, setMobileOpen, children }: any) {
  return (
    <Link
      href={href}
      onClick={() => setMobileOpen(false)}
      className="block text-left text-lg text-[#F4E1C1] hover:text-[#FFD970]"
    >
      {children}
    </Link>
  )
}
