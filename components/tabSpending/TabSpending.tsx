"use client"
import { motion } from "framer-motion"
import { Button, CircularProgress, MenuItem, Divider } from "@mui/material"
import CustomTextField from "@/components/ui/CustomTextField"
import { Autocomplete, TextField } from "@mui/material"
import { useState } from "react"
import axiosInstance from "@/lib/axiosInstance"
import TabWrapper from "@/components/tabWrapper"

export default function TabSpending({
  form,
  handleChange,
  handleSubmitSpending,
  categories,
  medicines,
  handleMedicineChange,
  addMedicine,
  removeMedicine,
  totalObat,
  loading,
}: any) {

  const isObat = String(form.category_id) === "9"
  const formatRupiah = (num: number) => new Intl.NumberFormat("id-ID").format(num)

  /* SEARCH COMPANY */
  const [companyOptions, setCompanyOptions] = useState<any[]>([])
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null)

  const handleCompanySearch = (keyword: string) => {
    if (searchTimeout) clearTimeout(searchTimeout)
    if (!keyword || keyword.length < 2) return
    setSearchTimeout(
      setTimeout(async () => {
        try {
          const res = await axiosInstance.get(`/api/CompanyMedicine?search=${keyword}`)
          setCompanyOptions(res.data)
        } catch {
          setCompanyOptions([])
        }
      }, 400)
    )
  }

  const handleRupiahInput = (e: any) => {
    let value = e.target.value

    // Hapus semua yang bukan angka
    value = value.replace(/[^0-9]/g, "")

    // Update langsung ke form  
    handleChange({
      target: {
        name: "amount_spending",
        value: value,
      },
    })
  }


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <TabWrapper>

        {/* =============================== */}
        {/*           TITLE                */}
        {/* =============================== */}
        <h2 className="text-[#FFD700] text-2xl font-bold mb-6 tracking-wide">
          Input Data Pengeluaran
        </h2>

        {/* =============================== */}
        {/*           FORM START           */}
        {/* =============================== */}
        <form
          onSubmit={handleSubmitSpending}
          className={`flex flex-col ${isObat ? "gap-10" : "gap-14"} pb-10`}
        >

          {/* =============================== */}
          {/*          FORM UTAMA            */}
          {/* =============================== */}
          <div className="grid grid-cols-1 gap-8">

            <CustomTextField
              label="Nama Pengeluaran"
              name="name_spending"
              value={form.name_spending}
              onChange={handleChange}
              required
            />

            <CustomTextField
              label="Jumlah (Rp)"
              name="amount_spending"
              value={
                isObat
                  ? `Rp ${formatRupiah(totalObat)}`
                  : form.amount_spending ? `Rp ${formatRupiah(Number(form.amount_spending))}` : ""
              }
              onChange={isObat ? undefined : handleRupiahInput}
              InputProps={{ readOnly: isObat }}
            />

            <CustomTextField
              select
              label="Kategori"
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              required
            >
              {categories.map((c: any) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name_category}
                </MenuItem>
              ))}
            </CustomTextField>

            <CustomTextField
              type="date"
              label="Tanggal"
              name="date_spending"
              value={form.date_spending}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />

          </div>

          {/* =============================== */}
          {/*             MODE OBAT           */}
          {/* =============================== */}
          {isObat && (
            <>
              <Divider sx={{ borderColor: "rgba(255,215,0,0.25)", my: 3 }} />

              <h3 className="text-[#FFD700] font-semibold text-lg mb-3">
                Detail Pembelian Obat
              </h3>

              {/* COMPANY SEARCH */}
              <Autocomplete
                freeSolo
                options={companyOptions}
                getOptionLabel={(option) =>
                  typeof option === "string" ? option : option.name_company
                }
                onInputChange={(_, v) => handleCompanySearch(v)}
                onChange={(_, newValue) => {
                  handleChange({
                    target: {
                      name: "company_id",
                      value: typeof newValue === "string" ? "" : newValue?.id || "",
                    },
                  })
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Nama Perusahaan (Supplier)"
                    placeholder="Ketik minimal 2 huruf..."
                    required
                    sx={{
                      "& .MuiInputLabel-root": { color: "#FFD700" },
                      "& .MuiOutlinedInput-root": {
                        color: "#ECECEC",
                        "& fieldset": { borderColor: "rgba(255,215,0,0.3)" },
                        "&:hover fieldset": { borderColor: "#FFD700" },
                      },
                    }}
                  />
                )}
              />

              {/* LIST OBAT */}
              <div className="space-y-5">
                {medicines.map((m: any, i: number) => (
                  <div
                    key={i}
                    className="grid grid-cols-12 gap-4 items-center bg-white/5 border border-[#FFD700]/20 p-4 rounded-xl"
                  >
                    <div className="col-span-5">
                      <CustomTextField
                        label="Nama Obat"
                        value={m.name_medicine}
                        onChange={(e) =>
                          handleMedicineChange(i, "name_medicine", e.target.value)
                        }
                      />
                    </div>

                    <div className="col-span-2">
                      <CustomTextField
                        label="Qty"
                        value={m.quantity}
                        onChange={(e) =>
                          handleMedicineChange(i, "quantity", e.target.value)
                        }
                      />
                    </div>

                    <div className="col-span-3">
                      <CustomTextField
                        label="Harga (Rp)"
                        value={m.price}
                        onChange={(e) =>
                          handleMedicineChange(i, "price", e.target.value)
                        }
                      />
                    </div>

                    <div className="col-span-2 text-right">
                      <Button sx={{ color: "#FF5555" }} onClick={() => removeMedicine(i)}>
                        Hapus
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="flex justify-between items-center">
                  <Button
                    onClick={addMedicine}
                    variant="outlined"
                    sx={{ borderColor: "#FFD700", color: "#FFD700" }}
                  >
                    Tambah Obat
                  </Button>

                  <p className="font-bold text-[#FFD700] text-lg">
                    Total: Rp {formatRupiah(totalObat)}
                  </p>
                </div>
              </div>
            </>
          )}

          {/* =============================== */}
          {/*         SUBMIT BUTTON          */}
          {/* =============================== */}
          <div className={`pt-6 flex ${isObat ? "justify-end" : "justify-center"}`}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                bgcolor: "#FFD700",
                color: "#12171d",
                fontWeight: "bold",
                px: 6,
                py: 1.5,
                fontSize: "16px",
                borderRadius: "10px",
                "&:hover": { bgcolor: "#ffe45c" },
              }}
            >
              {loading ? (
                <CircularProgress size={22} sx={{ color: "#12171d" }} />
              ) : (
                "Simpan Data Spending"
              )}
            </Button>
          </div>

        </form>
      </TabWrapper>
    </motion.div>
  )
}
