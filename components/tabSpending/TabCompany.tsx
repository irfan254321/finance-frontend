"use client"
import { motion } from "framer-motion"
import { Button, CircularProgress, Pagination } from "@mui/material"
import CustomTextField from "@/components/ui/CustomTextField"
import TabWrapper from "@/components/tabWrapper"

export default function TabCompany({
  companies,
  formCompany,
  setFormCompany,
  handleSubmitCompany,
  pagedCompanies,
  loading,
  search,
  setSearch,
  page,
  setPage,
  pageCount,
}: any) {
  // 🔍 Highlight helper (untuk search)
  const renderHighlightedName = (name: string, keyword: string) => {
    if (!keyword) return name

    const lowerName = name.toLowerCase()
    const lowerKey = keyword.toLowerCase()
    const index = lowerName.indexOf(lowerKey)

    if (index === -1) return name

    const before = name.slice(0, index)
    const match = name.slice(index, index + keyword.length)
    const after = name.slice(index + keyword.length)

    return (
      <>
        {before}
        <span className="text-[#FFD700] font-semibold">{match}</span>
        {after}
      </>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <TabWrapper>
        {/* FORM INPUT */}
        <form
          onSubmit={handleSubmitCompany}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          <CustomTextField
            label="Nama Perusahaan"
            value={formCompany}
            onChange={(e) => setFormCompany(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ bgcolor: "#FFD700", color: "#12171d" }}
          >
            {loading ? (
              <CircularProgress size={22} sx={{ color: "#12171d" }} />
            ) : (
              "Simpan"
            )}
          </Button>
        </form>

        {/* SEARCH */}
        <div className="flex justify-end mb-6">
          <CustomTextField
            size="small"
            placeholder="Cari perusahaan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* LIST PERUSAHAAN */}
        <p className="text-[#FFD700] font-semibold mb-4 text-xl">
          Daftar Perusahaan:
        </p>

        {pagedCompanies.length === 0 ? (
          <p className="text-gray-400 italic">Tidak ada perusahaan.</p>
        ) : (
          <div
            className="
              grid 
              grid-cols-1 
              sm:grid-cols-2 
              lg:grid-cols-3 
              gap-4
            "
          >
            {pagedCompanies.map((c: any) => {
              const firstLetter = (c.name_company || "?")
                .toString()
                .trim()
                .charAt(0)
                .toUpperCase()

              return (
                <motion.div
                  key={c.id}
                  whileHover={{ y: -3, scale: 1.02 }}
                  transition={{ duration: 0.25 }}
                  className="
                    relative
                    group
                    bg-white/5 
                    border border-[#FFD700]/20 
                    rounded-2xl 
                    p-4 
                    min-h-[96px]
                    backdrop-blur-xl
                    shadow-[0_0_20px_rgba(0,0,0,0.25)]
                    hover:border-[#FFD700]/40
                    hover:shadow-[0_0_25px_rgba(255,215,0,0.18)]
                    transition-all 
                    duration-200
                    flex gap-3 items-center
                  "
                >
                  {/* ✨ Shine effect */}
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
                      h-10 w-10
                      rounded-full
                      bg-[#FFD700]/20
                      border border-[#FFD700]/50
                      text-[#FFD700]
                      font-bold
                      flex-shrink-0
                      shadow-[0_0_10px_rgba(255,215,0,0.3)]
                    "
                  >
                    {firstLetter}
                  </div>

                  {/* TEKS */}
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-200 font-semibold text-sm sm:text-base leading-tight">
                      {renderHighlightedName(c.name_company, search)}
                    </span>

                    <span className="text-[#FFD700]/70 text-xs sm:text-sm">
                      ID: {c.id}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* PAGINATION */}
        <div className="flex justify-center mt-8">
          <Pagination
            count={pageCount}
            page={page}
            onChange={(_, v) => setPage(v)}
            sx={{
              "& .MuiPaginationItem-root": {
                color: "#FFD700",
              },
            }}
          />
        </div>
      </TabWrapper>
    </motion.div>
  )
}
