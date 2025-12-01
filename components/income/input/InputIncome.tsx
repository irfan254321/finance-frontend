"use client"

import { motion } from "framer-motion"
import { Button, CircularProgress, MenuItem } from "@mui/material"
import CustomTextField from "@/components/ui/CustomTextField"
import TabWrapper from "@/components/tabWrapper"

export default function TabIncome({
  form,
  handleChange,
  handleSubmitIncome,
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
        {/* HEADER TITLE */}
        <h2 className="text-[#FFD700] text-2xl font-bold mb-8 tracking-wide text-center">
          Input Data Pemasukan
        </h2>

        {/* FORM WRAPPER */}
        <div
          className="
            bg-white/5 
            border border-[#FFD700]/20 
            rounded-3xl 
            shadow-[0_0_30px_rgba(0,0,0,0.35)] 
            backdrop-blur-xl
            p-10
            w-full
            max-w-3xl 
            mx-auto
          "
        >
          <form onSubmit={handleSubmitIncome} className="flex flex-col gap-8">

            {/* NAMA INCOME */}
            <CustomTextField
              label="Nama Pemasukan"
              name="name_income"
              value={form.name_income}
              onChange={handleChange}
              required
            />

            {/* JUMLAH (RUPIAH) */}
            <CustomTextField
              label="Jumlah (Rp)"
              name="amount_income"
              value={
                form.amount_income
                  ? "Rp " + new Intl.NumberFormat("id-ID").format(Number(form.amount_income))
                  : ""
              }
              onChange={(e) => {
                const raw = e.target.value.replace(/[^0-9]/g, "")
                handleChange({
                  target: { name: "amount_income", value: raw },
                } as any)
              }}
            />

            {/* KATEGORI */}
            <CustomTextField
              select
              label="Kategori"
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              required
            >
              {categories.map((cat: any) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name_category}
                </MenuItem>
              ))}
            </CustomTextField>

            {/* TANGGAL */}
            <CustomTextField
              label="Tanggal"
              name="date_income"
              type="date"
              value={form.date_income}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />

            {/* SUBMIT BUTTON */}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={loading}
                variant="contained"
                fullWidth
                sx={{
                  bgcolor: "#FFD700",
                  color: "#12171d",
                  fontWeight: "bold",
                  py: 1.6,
                  fontSize: "1.1rem",
                  borderRadius: "10px",
                  boxShadow: "0 0 20px rgba(255,215,0,0.4)",
                  "&:hover": {
                    bgcolor: "#FFE55C",
                    boxShadow: "0 0 40px rgba(255,215,0,0.6)",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "#12171d" }} />
                ) : (
                  "Simpan Data Income"
                )}
              </Button>
            </div>
          </form>
        </div>
      </TabWrapper>
    </motion.div>
  );
}
