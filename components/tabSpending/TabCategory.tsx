"use client"

import { motion } from "framer-motion"
import { Button, CircularProgress } from "@mui/material"
import CustomTextField from "@/components/ui/CustomTextField"
import TabWrapper from "@/components/tabWrapper"

export default function TabCategory({
  categoryName,
  setCategoryName,
  handleSubmitCategory,
  loading,
  categories = [],
}: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <TabWrapper>
        {/* ============================== */}
        {/* FORM INPUT KATEGORI */}
        {/* ============================== */}
        <form
          onSubmit={handleSubmitCategory}
          className="flex flex-col gap-6 mb-10"
        >
          <CustomTextField
            label="Nama Kategori Baru"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
          />

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              bgcolor: "#FFD700",
              color: "#12171d",
              fontWeight: "bold",
              py: 1.6,
              borderRadius: "10px",
              fontSize: "1.05rem",
              "&:hover": { bgcolor: "#FFE55C" },
            }}
          >
            {loading ? (
              <CircularProgress size={22} sx={{ color: "#12171d" }} />
            ) : (
              "Simpan Kategori"
            )}
          </Button>
        </form>

        {/* ============================== */}
        {/* TITLE */}
        {/* ============================== */}
        <p className="text-[#FFD700] font-semibold mb-6 text-xl tracking-wide">
          Daftar Kategori
        </p>

        {/* ============================== */}
        {/* LIST CATEGORY CARDS */}
        {/* ============================== */}
        {categories.length === 0 ? (
          <p className="text-gray-400 italic">Belum ada kategori.</p>
        ) : (
          <div
            className="
              grid 
              grid-cols-1 
              sm:grid-cols-2 
              lg:grid-cols-3 
              gap-5
            "
          >
            {categories.map((c: any) => {
              const firstLetter = (c.name_category || "?")
                .toString()
                .trim()
                .charAt(0)
                .toUpperCase()

              return (
                <motion.div
                  key={c.id}
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ duration: 0.25 }}
                  className="
                    relative
                    group
                    bg-white/5 
                    border border-[#FFD700]/20 
                    rounded-2xl 
                    p-5 
                    min-h-[110px]
                    backdrop-blur-xl
                    shadow-[0_0_20px_rgba(0,0,0,0.25)]
                    hover:border-[#FFD700]/40
                    hover:shadow-[0_0_30px_rgba(255,215,0,0.20)]
                    transition-all 
                    duration-200
                    flex gap-4 items-center
                  "
                >
                  {/* ✨ SHINE EFFECT */}
                  <div
                    className="
                      pointer-events-none
                      absolute inset-y-0 -left-1/2
                      w-1/2
                      bg-gradient-to-r from-transparent via-white/40 to-transparent
                      opacity-0
                      group-hover:opacity-70
                      transform
                      -translate-x-full
                      group-hover:translate-x-full
                      transition-all
                      duration-700
                      ease-out
                    "
                  />

                  {/* ICON HURUF DEPAN */}
                  <div
                    className="
                      flex items-center justify-center
                      h-12 w-12
                      rounded-full
                      bg-[#FFD700]/20
                      border border-[#FFD700]/50
                      text-[#FFD700]
                      font-bold text-lg
                      flex-shrink-0
                      shadow-[0_0_10px_rgba(255,215,0,0.3)]
                    "
                  >
                    {firstLetter}
                  </div>

                  {/* NAMA CATEGORY */}
                  <div className="flex flex-col">
                    <span className="text-gray-200 font-semibold text-base leading-tight">
                      {c.name_category}
                    </span>

                    <span className="text-[#FFD700]/70 text-sm">
                      ID: {c.id}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </TabWrapper>
    </motion.div>
  )
}
