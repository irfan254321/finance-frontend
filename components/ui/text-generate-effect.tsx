"use client"

import React, { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

interface Props {
  words?: string
  className?: string
}

export const TextGenerateEffect: React.FC<Props> = ({ words = "", className }) => {
  const cleanWords =
    typeof words === "string" ? words.replace(/undefined/g, "").trim() : ""

  const [displayed, setDisplayed] = useState("")
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const isRunning = useRef(false)

  useEffect(() => {
    if (!cleanWords || isRunning.current) return
    isRunning.current = true // ✅ mencegah efek dijalankan 2x di Strict Mode

    let i = 0
    intervalRef.current = setInterval(() => {
      i++
      setDisplayed(cleanWords.slice(0, i)) // ✅ langsung ambil substring → urut, gak loncat
      if (i >= cleanWords.length) {
        clearInterval(intervalRef.current!)
      }
    }, 25)

    return () => {
      clearInterval(intervalRef.current!)
      isRunning.current = false
    }
  }, [cleanWords])

  return (
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className={`text-center text-[#FFD700] font-medium text-lg md:text-xl leading-relaxed ${
        className || ""
      }`}
    >
      {displayed}
    </motion.p>
  )
}
