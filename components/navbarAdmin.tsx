"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Avatar, IconButton, Menu, MenuItem, Divider } from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  ExpandMore,
  ExpandLess,
  ChevronRight,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";

export default function NavbarAdmin() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [openSub, setOpenSub] = useState<string | null>(null);

  // State untuk tahun
  const [years, setYears] = useState<number[]>([]);

  useEffect(() => {
    axiosInstance
      .get("/api/year")
      .then((res) => {
        // Asumsi res.data = [{ id: 1, year: 2024 }, ...]
        const list = res.data.map((item: any) => item.year);
        setYears(list);
      })
      .catch((err) => console.error("Gagal ambil tahun:", err));
  }, []);

  const toggleMobile = () => setMobileOpen(!mobileOpen);
  const toggleMenu = (menu: string) =>
    setOpenMenu(openMenu === menu ? null : menu);
  const toggleSub = (key: string) => setOpenSub(openSub === key ? null : key);

  const handleMenuOpen = (e: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const navButtons = [
    { label: "Register", route: "/dashboard/admin/register" },
  ];

  const financeItems = [
    { label: "💰 Income", route: "/dashboard/income" },
    { label: "💸 Spending", route: "/dashboard/spending" },
    { label: "⚖️ Mixture", route: "/dashboard/mixture" },
  ];

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
    {
      label: "📅 Year",
      routes: [{ name: "➕ Input Year", path: "/dashboard/admin/year" }],
    },
    {
      label: "👤 User",
      routes: [
        { name: "🛠️ Edit User", path: "/dashboard/profile" },
        { name: "🚪 Logout", path: logout },
      ],
    },
  ];

  return (
    <nav className="sticky top-0  w-full z-[9999] min-h-28 text-[#EBD77A] font-serif bg-gradient-to-br from-[#1a2732]/97 via-[#2C3E50]/95 to-[#1a2732]/97 backdrop-blur-lg border-b border-[#EBD77A]/15 shadow-[0_2px_25px_rgba(0,0,0,0.4)]">
      <div className="flex justify-between items-center px-6 md:px-16 h-20">
        {/* LOGO */}
        <div className="flex flex-row items-center w-5/12">
          <div className="mt-9">
            <Link href="/dashboard">
              <img
                src="/logo-rs.png"
                alt="Logo RS"
                className="drop-shadow-[0_0_12px_rgba(255,215,0,0.4)]
                 cursor-pointer 
                 w-12 h-12 md:w-20 md:h-20"
              />
            </Link>
          </div>
          <div className="ml-5 text-2xl font-bold mt-9">
            <h1 className="hidden md:block text-2xl font-bold leading-tight text-[#EBD77A]">
              RUMAH SAKIT BHAYANGKARA M HASAN PALEMBANG
            </h1>
          </div>
        </div>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center space-x-36 text-2xl relative mt-9 mr-28">
          {/* FINANCE */}
          <div className="relative">
            <button
              onClick={() => toggleMenu("finance")}
              className={`relative group px-2 font-semibold cursor-pointer select-none transition-all ease-out ${
                openMenu === "finance"
                  ? "text-[#FFD970] drop-shadow-[0_0_6px_rgba(255,217,112,0.4)]"
                  : "text-[#EBD77A]"
              }`}
            >
              Finance
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
                        className="flex justify-between items-center w-full text-left px-3 py-2 text-[#EDE3B5] font-medium rounded-lg hover:bg-white/5 hover:text-[#FFD970]"
                      >
                        {item.label}
                        <ChevronRight
                          className={`transition-transform ${
                            openSub === item.label
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
                            className="absolute top-0 left-full ml-3 min-w-[130px] bg-gradient-to-br from-[#1a2732]/98 via-[#2C3E50]/96 to-[#1a2732]/98 border border-[#EBD77A]/25 rounded-xl p-2 space-y-1"
                          >
                            {years.map((year) => (
                              <Link
                                key={year}
                                href={`${item.route}/${year}`}
                                onClick={() => {
                                  setOpenMenu(null);
                                  setOpenSub(null);
                                }}
                                className="block w-full text-left px-3 py-1.5 text-xl text-[#F6F1D3] hover:text-[#FFD970] hover:bg-white/10 rounded-md"
                              >
                                📆 {year}
                              </Link>
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

          {/* MANAGE */}
          <div className="relative">
            <button
              onClick={() => toggleMenu("manage")}
              className={`relative group px-2 font-semibold cursor-pointer ${
                openMenu === "manage"
                  ? "text-[#FFD970] drop-shadow-[0_0_6px_rgba(255,217,112,0.4)]"
                  : "text-[#EBD77A]"
              }`}
            >
              Manage
            </button>

            <AnimatePresence>
              {openMenu === "manage" && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="absolute left-0 mt-3 min-w-[240px] bg-gradient-to-br from-[#1a2732]/98 via-[#2C3E50]/96 to-[#1a2732]/98 border border-[#EBD77A]/25 rounded-xl p-3 space-y-1"
                >
                  {manageItems.map((section) => (
                    <div key={section.label} className="relative">
                      <button
                        onClick={() => toggleSub(section.label)}
                        className="flex justify-between items-center w-full px-3 py-2 text-[#EDE3B5] hover:bg-white/5 hover:text-[#FFD970] rounded-lg"
                      >
                        {section.label}
                        <ChevronRight
                          className={`transition-transform ${
                            openSub === section.label
                              ? "rotate-90 text-[#FFD970]"
                              : "text-[#EBD77A]/70"
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {openSub === section.label && (
                          <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-0 left-full ml-3 min-w-[180px] bg-gradient-to-br from-[#1a2732]/98 via-[#2C3E50]/96 to-[#1a2732]/98 border border-[#EBD77A]/25 rounded-xl p-2 space-y-1"
                          >
                            {section.routes.map((r) =>
                              typeof r.path === "string" ? (
                                <Link
                                  key={r.name}
                                  href={r.path}
                                  onClick={() => {
                                    setOpenMenu(null);
                                    setOpenSub(null);
                                  }}
                                  className="block w-full px-3 py-1.5 text-xl text-[#F6F1D3] hover:text-[#FFD970] hover:bg-white/10 rounded-md"
                                >
                                  {r.name}
                                </Link>
                              ) : (
                                <button
                                  key={r.name}
                                  onClick={() => {
                                    r.path(); // ← jalankan fungsi logout()
                                    setOpenMenu(null);
                                    setOpenSub(null);
                                  }}
                                  className="block w-full text-left px-3 py-1.5 text-xl text-[#F6F1D3] hover:text-[#FFD970] hover:bg-white/10 rounded-md"
                                >
                                  {r.name}
                                </button>
                              )
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* STATIC BUTTONS */}
          {navButtons.map((btn) => (
            <Link
              key={btn.label}
              href={btn.route}
              className="relative group font-semibold text-[#EBD77A] hover:text-[#FFD970]"
            >
              {btn.label}
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#FFD970] rounded-full transition-all duration-300 ease-out group-hover:w-full"></span>
            </Link>
          ))}
        </div>
      </div>

      {/* MOBILE PANEL */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-20 right-0 w-[80%] h-[calc(100vh-80px)] bg-gradient-to-b from-[#1a2732]/97 via-[#2C3E50]/96 to-[#1a2732]/97 border-l border-[#EBD77A]/15 p-6 flex flex-col gap-4 text-[#EBD77A] overflow-y-auto"
          >
            {/* === MOBILE ITEMS === */}
            {[
              { title: "Finance", subKey: "finance" },
              { title: "Manage", subKey: "manage" },
              {
                title: "Register",
                action: () => router.push("/dashboard/admin/register"),
              },
            ].map((item) => (
              <div key={item.title}>
                <button
                  onClick={() =>
                    item.subKey
                      ? toggleMenu(item.subKey)
                      : item.action && item.action()
                  }
                  className="flex justify-between items-center w-full text-left text-lg font-semibold hover:text-[#FFD970]"
                >
                  {item.title}
                  {item.subKey &&
                    (openMenu === item.subKey ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    ))}
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
                          <span className="font-semibold text-[#FFD970]">
                            {f.label}
                          </span>
                          <div className="ml-4 mt-1 space-y-1">
                            {years.map((y) => (
                              <button
                                key={y}
                                onClick={() => {
                                  router.push(`${f.route}/${y}`);
                                  setMobileOpen(false);
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
                          <span className="font-semibold text-[#FFD970]">
                            {m.label}
                          </span>
                          <div className="ml-4 mt-1 space-y-1">
                            {m.routes.map((r) => (
                              <button
                                key={r.path}
                                onClick={() => {
                                  router.push(r.path);
                                  setMobileOpen(false);
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
  );
}
