"use client"

import { motion } from "framer-motion"
import { Button, CircularProgress } from "@mui/material"
import CustomTextField from "@/components/ui/CustomTextField"

// 🧩 Tab Input Kategori
// Menangani input kategori pemasukan
export default function TabCategory({ categoryName, setCategoryName, handleSubmitCategory, loading, categories }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white/10 backdrop-blur-2xl border border-[#FFD700]/20 rounded-3xl p-10 shadow-[0_0_25px_rgba(255,215,0,0.08)]"
    >
      {/* Form Tambah Kategori */}
      <form onSubmit={handleSubmitCategory} className="flex flex-col gap-8 mb-8">
        <CustomTextField
          label="Nama Kategori Baru"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          required
        />

        <Button
          type="submit"
          disabled={loading}
          sx={{
            bgcolor: "#FFD700",
            color: "#12171d",
            fontWeight: "bold",
            py: 1.6,
            fontSize: "1.1rem",
            borderRadius: "10px",
            boxShadow: "0 0 20px rgba(255,215,0,0.4)",
            "&:hover": { bgcolor: "#FFE55C", boxShadow: "0 0 40px rgba(255,215,0,0.6)" },
          }}
        >
          {loading ? <CircularProgress size={24} sx={{ color: "#12171d" }} /> : "Simpan Kategori"}
        </Button>
      </form>

      {/* Daftar Kategori */}
      <p className="text-[#FFD700] font-semibold mb-3 text-xl">Daftar Kategori:</p>
      <ul className="space-y-2 text-gray-200 text-base">
        {categories.map((c: any) => (
          <li key={c.id}>• {c.name_category}</li>
        ))}
      </ul>
    </motion.div>
  )
}
