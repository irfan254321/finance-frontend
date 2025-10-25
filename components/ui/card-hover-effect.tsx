"use client"

import React from "react"
import { motion } from "framer-motion"

interface Item {
  title: string
  description: string
  link: string
}

interface Props {
  items: Item[]
}

export function HoverEffect({ items }: Props) {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      {items.map((item, i) => (
        <motion.a
          href={item.link}
          key={i}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="relative p-8 rounded-2xl border border-white/20 bg-white/5 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:border-[#FFD700]/40 hover:shadow-[0_0_25px_rgba(255,215,0,0.2)] transition"
        >
          <h3 className="text-xl font-semibold text-[#FFD700] mb-2">{item.title}</h3>
          <p className="text-gray-200 text-sm">{item.description}</p>
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-20 rounded-2xl pointer-events-none" />
        </motion.a>
      ))}
    </div>
  )
}
