"use client"

import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function PageWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const [show, setShow] = useState(false)

    useEffect(() => {
        setShow(false)
        const t = setTimeout(() => setShow(true), 2000) // sinkron 2s overlay
        return () => clearTimeout(t)
    }, [pathname])

    return (
        <AnimatePresence mode="wait">
            {show && (
                <motion.div
                    key={pathname}
                    initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -20, filter: "blur(6px)" }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="min-h-screen"
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    )
}
