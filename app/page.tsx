"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

export default function HomePage() {
  const { user, loading } = useAuth() // 🔹 ini loading untuk session
  const router = useRouter()
  const [stage, setStage] = useState<"logo" | "text" | "button">("logo")
  const [isButtonLoading, setIsButtonLoading] = useState(false) // 🔹 ganti nama state lokal

  // Transisi antar tahap animasi
  useEffect(() => {
    const timer1 = setTimeout(() => setStage("text"), 2000)
    const timer2 = setTimeout(() => setStage("button"), 3700)
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  // Auto-redirect kalau sudah login
  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard")
    }
  }, [loading, user, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white text-xl">
        Checking session...
      </div>
    )
  }

  const handleClick = () => {
    setIsButtonLoading(true)
    setTimeout(() => {
      router.push("/login")
    }, 2000)
  }

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0b0f16] to-[#121826] overflow-hidden">
      {/* 🌟 LOGO */}
      <motion.div
        key="logo"
        className="z-20 flex flex-col items-center text-center"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
      >
        <motion.img
          src="/logo-rs.png"
          alt="Logo RS Bhayangkara"
          className="w-48 h-48 object-contain drop-shadow-[0_0_30px_rgba(255,215,0,0.45)]"
          animate={{
            scale: [1, 1.05, 1],
            filter: [
              "drop-shadow(0 0 15px rgba(255,215,0,0.3))",
              "drop-shadow(0 0 25px rgba(255,215,0,0.6))",
              "drop-shadow(0 0 15px rgba(255,215,0,0.3))",
            ],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.h2
          className="text-[#FFD700] text-2xl md:text-3xl font-serif mt-4 tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          RS Bhayangkara M. Hasan Palembang
        </motion.h2>
      </motion.div>

      {/* 🌟 TEXT */}
      <AnimatePresence>
        {stage !== "logo" && (
          <motion.div
            key="text"
            className="z-20 mt-10 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <h1 className="text-white font-serif font-extrabold text-4xl md:text-5xl tracking-wide leading-tight drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
              PELAYANAN TERBAIK.
              <br /> KESEHATAN ANDA PRIORITAS KAMI.
            </h1>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🌟 BUTTON */}
      <AnimatePresence>
        {stage === "button" && (
          <motion.button
            key="button"
            disabled={isButtonLoading}
            className={`z-20 mt-10 px-8 py-4 font-serif text-lg md:text-xl font-semibold rounded-xl shadow-[0_0_20px_rgba(255,215,0,0.4)] transition-all duration-300 flex items-center justify-center gap-3 ${
              isButtonLoading
                ? "bg-[#FFD700]/80 text-[#1a2732] cursor-not-allowed"
                : "bg-[#FFD700] text-[#1a2732] hover:bg-[#ffde47] hover:scale-105"
            }`}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            onClick={handleClick}
          >
            {isButtonLoading ? (
              <>
                <motion.div
                  className="w-6 h-6 border-2 border-[#1a2732] border-t-transparent rounded-full animate-spin"
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                />
                <span className="tracking-wide">MEMUAT SISTEM...</span>
              </>
            ) : (
              "MASUK KE SISTEM INFORMASI RS"
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* ✨ BACKGROUND GLOW */}
      <div className="absolute -z-10 inset-0 bg-gradient-radial from-[#FFD700]/10 via-transparent to-transparent opacity-30 blur-3xl"></div>
    </div>
  )
}