"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils" // kalau belum punya utils cn, nanti gue kasih juga

interface Tab {
  title: string
  value: string
  content: React.ReactNode
}

interface TabsProps {
  tabs: Tab[]
}

export function Tabs({ tabs }: TabsProps) {
  const [active, setActive] = React.useState(tabs[0].value)

  return (
    <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center justify-center text-[#ECECEC]">
      {/* ====== TAB BUTTONS ====== */}
      <div className="relative flex flex-wrap justify-center items-center gap-4 mb-10">
        {tabs.map((tab) => {
          const isActive = active === tab.value
          return (
            <motion.button
              key={tab.value}
              onClick={() => setActive(tab.value)}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "relative px-6 py-3 text-lg font-semibold rounded-full transition-all",
                "border border-[#FFD700]/40 hover:border-[#FFD700]/80",
                isActive
                  ? "bg-gradient-to-r from-[#FFD700]/20 to-[#FFD700]/10 text-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,0.2)]"
                  : "text-gray-300 hover:text-[#FFD700]"
              )}
            >
              {tab.title}
              {isActive && (
                <motion.div
                  layoutId="active-tab"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FFD700]/30 to-[#FFD700]/10 blur-md"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
            </motion.button>
          )
        })}
      </div>

      {/* ====== TAB CONTENT ====== */}
      <div className="relative w-full min-h-[30rem] md:min-h-[35rem]">
        <AnimatePresence mode="wait">
          {tabs.map(
            (tab) =>
              active === tab.value && (
                <motion.div
                  key={tab.value}
                  initial={{ opacity: 0, y: 30, rotateX: 20 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  exit={{ opacity: 0, y: -30, rotateX: -15 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full rounded-3xl bg-gradient-to-br from-[#1a2230]/80 via-[#1d2532]/80 to-[#12171d]/80 border border-[#FFD700]/20 shadow-[0_0_25px_rgba(255,215,0,0.1)] p-8 overflow-y-auto backdrop-blur-xl"
                >
                  {tab.content}
                </motion.div>
              )
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
