"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"

export default function TransitionOverlay() {
    const [show, setShow] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        setShow(true)
        const timer = setTimeout(() => setShow(false), 2000)
        return () => clearTimeout(timer)
    }, [pathname])

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center 
                     bg-gradient-to-b from-[#2b0000]/80 via-[#400000]/85 to-[#1a0000]/90
                     backdrop-blur-[12px] text-white"
                    initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                    animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
                    exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                    transition={{ duration: 0.6 }}
                >
                    {/* LOGO BERNAFAS */}
                    <motion.img
                        src="/logo-rs.png"
                        alt="Logo RS Bhayangkara"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{
                            scale: [1, 1.05, 1],
                            opacity: 1,
                            filter: [
                                "drop-shadow(0 0 15px rgba(255,215,0,0.4))",
                                "drop-shadow(0 0 30px rgba(255,215,0,0.7))",
                                "drop-shadow(0 0 15px rgba(255,215,0,0.4))",
                            ],
                        }}
                        transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
                        className="w-24 h-24 md:w-32 md:h-32"
                    />

                    <motion.h1
                        className="mt-6 text-lg md:text-xl font-semibold text-[#FFD700] tracking-wide font-serif drop-shadow-[0_2px_8px_rgba(255,215,0,0.5)]"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                    >
                        RS BHAYANGKARA M. HASAN PALEMBANG
                    </motion.h1>

                    <motion.div
                        className="mt-4 h-[2px] w-24 bg-gradient-to-r from-[#FFD700] to-[#B8860B] rounded-full"
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: "6rem", opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    )
}
