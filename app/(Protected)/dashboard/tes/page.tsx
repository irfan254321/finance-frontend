"use client"
import React from "react"

export default function HeroPage() {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full flex justify-between items-center px-10 py-6 bg-black/40 backdrop-blur-sm text-white z-20">
        <div className="flex items-center gap-2">
          <div className="font-extrabold text-xl tracking-widest">▲ JOURNEY</div>
          <span className="text-sm text-gray-300">STRATEGIC WEALTH</span>
        </div>
        <div className="flex gap-8 text-sm font-medium">
          <a href="#" className="hover:text-yellow-400">ABOUT</a>
          <a href="#" className="hover:text-yellow-400">SERVICES</a>
          <a href="#" className="hover:text-yellow-400">FIND AN ADVISOR</a>
          <a href="#" className="hover:text-yellow-400">INSIGHTS</a>
          <a href="#" className="hover:text-yellow-400">CONTACT</a>
        </div>
        <div className="flex gap-5 text-sm">
          <button className="hover:text-yellow-400">CLIENT LOGIN</button>
          <button className="hover:text-yellow-400">FOR ADVISORS</button>
        </div>
      </nav>

      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="/images/road.jpg" // ganti dengan path gambar kamu
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Hero Text */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 text-center text-white px-6">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-wide">
          YOUR MONEY. YOUR LIFE. <br /> YOUR JOURNEY.
        </h1>

        <button className="mt-8 px-6 py-3 bg-white text-black font-semibold rounded-md shadow hover:bg-gray-200 transition">
          START YOUR PATH
        </button>
      </div>
    </div>
  )
}
