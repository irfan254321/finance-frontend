"use client"

import { useEffect, useState } from "react"
import axiosInstance from "@/lib/axiosInstance"
import { Button } from "@mui/material"
import { motion } from "framer-motion"

export default function HomePage() {
  const [news, setNews] = useState<any[]>([])
  const [slides, setSlides] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // berita
  useEffect(() => {
    axiosInstance.get(`/contents/berita?page=${page}&limit=3`).then((res) => {
      setNews(res.data.data)
      setTotalPages(res.data.totalPages)
    })
  }, [page])

  // slide
  useEffect(() => {
    axiosInstance.get(`/contents/slide`).then((res) => setSlides(res.data))
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f9f9fb] to-[#f3f4f7] pb-20">
      {/* 🖼️ SLIDER OTOMATIS */}
      <div className="relative w-full h-[500px] overflow-hidden">
        <div className="flex animate-slide" style={{ width: `${slides.length * 100}%` }}>
          {slides.map((s, i) => (
            <div
              key={i}
              className="w-full h-[500px] bg-cover bg-center flex-shrink-0"
              style={{ backgroundImage: `url(${s.image_url})` }}
            >
              <div className="bg-black/50 w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                {s.caption}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 📰 BERITA TERBARU */}
      <div className="max-w-6xl mx-auto mt-20 px-6">
        <h2 className="text-4xl font-bold mb-8 text-[#2C3E50] text-center">
          📰 Berita Terbaru
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          {news.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white shadow-lg rounded-3xl p-6 border border-gray-200 flex flex-col"
            >
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-48 object-cover rounded-2xl mb-4"
              />
              <h3 className="text-2xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600 text-lg flex-grow line-clamp-3">
                {item.content.slice(0, 120)}...
              </p>
              <Button
                variant="outlined"
                onClick={() => (window.location.href = `/news/${item.id}`)}
                sx={{
                  mt: 3,
                  borderColor: "#2C3E50",
                  color: "#2C3E50",
                  "&:hover": { backgroundColor: "#2C3E50", color: "white" },
                }}
              >
                Baca Selengkapnya
              </Button>
            </motion.div>
          ))}
        </div>

        {/* 📄 PAGINATION */}
        <div className="flex justify-center mt-10 space-x-4">
          <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
            ⬅️ Sebelumnya
          </Button>
          <span className="text-2xl font-semibold text-[#2C3E50]">
            Halaman {page} / {totalPages}
          </span>
          <Button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
            Selanjutnya ➡️
          </Button>
        </div>
      </div>

      {/* 🏥 INFO KHUSUS RS */}
      <div className="max-w-6xl mx-auto mt-24 grid md:grid-cols-3 gap-10 px-6">
        <div className="bg-white p-8 rounded-3xl shadow-lg border-t-4 border-[#FFD700]">
          <h3 className="text-2xl font-bold mb-4">🏥 Layanan Unggulan</h3>
          <p className="text-gray-600 text-lg">
            Kami menyediakan berbagai layanan medis terbaik untuk masyarakat dengan
            tenaga profesional dan fasilitas modern.
          </p>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-lg border-t-4 border-[#FFD700]">
          <h3 className="text-2xl font-bold mb-4">💉 Vaksinasi & Kesehatan</h3>
          <p className="text-gray-600 text-lg">
            RS Bhayangkara terus berkomitmen memberikan layanan vaksinasi dan
            pemeriksaan kesehatan berkala untuk semua umur.
          </p>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-lg border-t-4 border-[#FFD700]">
          <h3 className="text-2xl font-bold mb-4">📅 Jadwal & Informasi</h3>
          <p className="text-gray-600 text-lg">
            Dapatkan informasi terbaru tentang jadwal dokter, event, dan kegiatan
            kesehatan melalui website resmi kami.
          </p>
        </div>
      </div>
    </div>
  )
}
