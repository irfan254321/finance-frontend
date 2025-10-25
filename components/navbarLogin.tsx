"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, Menu, MenuItem, CircularProgress } from "@mui/material"
import { useAuth } from "@/context/AuthContext"
import { motion, AnimatePresence } from "framer-motion"
import axiosInstance from "@/lib/axiosInstance"
import { Menu as MenuIcon, X as CloseIcon } from "lucide-react"

export default function NavbarLogin() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const toggleMenu = () => setMobileOpen(!mobileOpen)
  const handleMenuOpen = (e: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget)
  const handleMenuClose = () => setAnchorEl(null)

  if (loading)
    return (
      <div className="fixed top-0 left-0 w-full h-20 flex justify-center items-center bg-[#0b0f16]/70 backdrop-blur-md text-white">
        <CircularProgress size={26} sx={{ color: "#FFD700" }} />
      </div>
    )

  return (
    <motion.nav
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 w-full z-[99999] backdrop-blur-xl border-b border-white/10 bg-[#0a0f18]/60"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center text-white/90 font-[Inter]">
        {/* 🏥 Logo */}
        <motion.div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.push(user ? "/dashboard" : "/")}
          whileHover={{ scale: 1.05 }}
        >
          <img src="/rs-bhayangkara-logo-v2.ico" className="w-8 h-8" alt="logo" />
          <h1 className="text-lg font-semibold tracking-wide text-[#FFD700]">
            RS Bhayangkara
          </h1>
        </motion.div>

        {/* ✨ Desktop Menu */}
        <div className="hidden md:flex items-center gap-10 text-[0.95rem] font-medium">
          {user ? (
            <>
              <NavButton label="Dashboard" onClick={() => router.push("/dashboard")} />
              <DropdownMenu title="Finance" items={["income", "spending", "mixture"]} router={router} />
              <DropdownMenu
                title="Manage"
                items={[
                  "input/income",
                  "input/spending",
                  "edit/income",
                  "edit/spending",
                ]}
                router={router}
              />
              <Profile user={user} router={router} handleMenuOpen={handleMenuOpen} anchorEl={anchorEl} handleMenuClose={handleMenuClose} />
            </>
          ) : (
            <>
              <NavButton label="Home" onClick={() => router.push("/")} />
              <NavButton label="Login" onClick={() => router.push("/login")} />
            </>
          )}
        </div>

        {/* 📱 Mobile Toggle */}
        <button
          onClick={toggleMenu}
          className="md:hidden flex items-center justify-center p-2 rounded-md hover:bg-white/10 transition-all"
        >
          {mobileOpen ? <CloseIcon size={26} /> : <MenuIcon size={26} />}
        </button>
      </div>

      {/* 📱 Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-[#0a0f18]/95 backdrop-blur-xl border-t border-white/10 flex flex-col items-center space-y-5 p-6 text-white/90"
          >
            {user ? (
              <>
                <MobileButton label="Dashboard" onClick={() => router.push("/dashboard")} />
                <MobileButton label="Finance" onClick={() => router.push("/dashboard/income/2025")} />
                <MobileButton label="Manage" onClick={() => router.push("/dashboard/input/income")} />
                <MobileButton
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
                <MobileButton label="Home" onClick={() => router.push("/")} />
                <MobileButton label="Login" onClick={() => router.push("/login")} />
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

/* ----------------------------- Sub Components ----------------------------- */

function NavButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="relative px-1 text-white/80 hover:text-[#FFD700] after:content-[''] after:absolute after:w-0 hover:after:w-full after:h-[2px] after:bg-[#FFD700] after:bottom-[-4px] after:left-0 after:transition-all after:duration-300"
    >
      {label}
    </motion.button>
  )
}

function DropdownMenu({
  title,
  items,
  router,
}: {
  title: string
  items: string[]
  router: any
}) {
  return (
    <div className="group relative">
      <button className="text-white/80 hover:text-[#FFD700] transition-all">
        {title}
      </button>
      <div className="absolute hidden group-hover:flex flex-col top-full left-0 bg-[#0b0f16]/90 backdrop-blur-xl border border-[#FFD700]/20 rounded-xl shadow-lg mt-2 min-w-[160px] p-3 space-y-2">
        {items.map((item) => (
          <button
            key={item}
            onClick={() => router.push(`/dashboard/${item}`)}
            className="text-left text-sm text-white/80 hover:text-[#FFD700] hover:translate-x-1 transition-all"
          >
            {item.replace("/", " ").toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  )
}

function MobileButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-base w-full text-center text-white/80 hover:text-[#FFD700] transition-all"
    >
      {label}
    </button>
  )
}

function Profile({ user, router, handleMenuOpen, anchorEl, handleMenuClose }: any) {
  return (
    <div className="flex items-center gap-3 ml-4">
      <p className="text-sm text-gray-300 hidden lg:block">
        <span className="text-[#FFD700] font-medium">{user.name_users}</span>{" "}
        <span className="text-white/60">({user.role})</span>
      </p>
      <button onClick={handleMenuOpen}>
        <Avatar
          alt={user.name_users}
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name_users}`}
          sx={{
            width: 40,
            height: 40,
            border: "2px solid #FFD700",
            boxShadow: "0 0 12px rgba(255,215,0,0.4)",
          }}
        />
      </button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            bgcolor: "#101820",
            color: "white",
            border: "1px solid rgba(255,215,0,0.2)",
            borderRadius: "12px",
            boxShadow: "0 4px 25px rgba(0,0,0,0.4)",
          },
        }}
      >
        <MenuItem onClick={() => router.push("/dashboard/profile")}>📁 Profil Saya</MenuItem>
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
