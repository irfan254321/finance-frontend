"use client"
import React from "react"
import { motion } from "framer-motion"

interface Card {
  quote: string
  name: string
  title: string
}

interface Props {
  items: Card[]
  direction?: "left" | "right"
  speed?: "slow" | "normal" | "fast"
}

export function InfiniteMovingCards({
  items,
  direction = "right",
  speed = "normal",
}: Props) {
  const speedMap = {
    slow: 50,
    normal: 30,
    fast: 15,
  }

  return (
    <div className="relative w-full h-[22rem] overflow-hidden flex items-center justify-center rounded-3xl bg-gradient-to-b from-[#1a2029]/60 via-[#12171d]/80 to-[#0a0e12]/90 border border-[#FFD700]/15 backdrop-blur-2xl shadow-[0_0_40px_rgba(255,215,0,0.08)]">
      {/* ✨ subtle gold glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#FFD700]/5 to-transparent rounded-3xl" />
      <motion.div
        animate={{
          x: direction === "right" ? ["0%", "-50%"] : ["-50%", "0%"],
        }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: speedMap[speed],
        }}
        className="flex gap-8 px-8"
      >
        {[...items, ...items].map((card, i) => (
          <div
            key={i}
            className="w-[360px] h-[180px] p-6 bg-white/[0.06] border border-white/[0.15] rounded-2xl text-gray-100 backdrop-blur-xl shadow-[0_4px_25px_rgba(0,0,0,0.3)] hover:border-[#FFD700]/40 hover:shadow-[0_0_25px_rgba(255,215,0,0.2)] transition-all duration-300"
          >
            <p className="text-[15px] leading-relaxed italic mb-4 text-gray-300">
              “{card.quote}”
            </p>
            <p className="text-[#FFD700] font-semibold text-sm">
              {card.name}
            </p>
            <p className="text-gray-400 text-xs">{card.title}</p>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
