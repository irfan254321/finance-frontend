"use client"
import { motion } from "framer-motion"
import { Button, CircularProgress, MenuItem, Divider } from "@mui/material"
import CustomTextField from "@/components/ui/CustomTextField"

export default function TabSpending({ form, handleChange, handleSubmitSpending, categories, medicines, handleMedicineChange, addMedicine, removeMedicine, totalObat, loading }: any) {
  const isObat = String(form.category_id) === "9"
  const formatRupiah = (num: number) => new Intl.NumberFormat("id-ID").format(num)

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      className="bg-white/10 backdrop-blur-2xl border border-[#FFD700]/20 rounded-3xl p-10 shadow-[0_0_25px_rgba(255,215,0,0.08)]">
      <form onSubmit={handleSubmitSpending} className="flex flex-col gap-8">
        <CustomTextField label="Nama Pengeluaran" name="name_spending" value={form.name_spending} onChange={handleChange} required />
        <CustomTextField label="Jumlah (Rp)" name="amount_spending" value={isObat ? `Rp ${formatRupiah(totalObat)}` : form.amount_spending} onChange={handleChange} InputProps={{readOnly: isObat,}} />
        <CustomTextField select label="Kategori" name="category_id" value={form.category_id} onChange={handleChange} required>
          {categories.map((c: any) => <MenuItem key={c.id} value={c.id}>{c.name_category}</MenuItem>)}
        </CustomTextField>

        {isObat && (
          <>
            <Divider sx={{ my: 2, borderColor: "rgba(255,215,0,0.3)" }} />
            {medicines.map((m: any, i: number) => (
              <div key={i} className="grid grid-cols-12 gap-3 items-center">
                <div className="col-span-5"><CustomTextField label="Nama Obat" value={m.name_medicine} onChange={(e)=>handleMedicineChange(i,"name_medicine",e.target.value)} /></div>
                <div className="col-span-2"><CustomTextField label="Qty" value={m.quantity} onChange={(e)=>handleMedicineChange(i,"quantity",e.target.value)} /></div>
                <div className="col-span-3"><CustomTextField label="Harga (Rp)" value={m.price} onChange={(e)=>handleMedicineChange(i,"price",e.target.value)} /></div>
                <div className="col-span-2"><Button color="error" onClick={()=>removeMedicine(i)}>Hapus</Button></div>
              </div>
            ))}
            <Button onClick={addMedicine} variant="outlined" sx={{ borderColor:"#FFD700", color:"#FFD700" }}>Tambah Obat</Button>
            <p className="text-right font-bold text-[#FFD700] text-lg mt-2">Total: Rp {formatRupiah(totalObat)}</p>
          </>
        )}

        <CustomTextField type="date" label="Tanggal" name="date_spending" value={form.date_spending} onChange={handleChange} InputLabelProps={{ shrink: true }} />
        <Button type="submit" variant="contained" disabled={loading} sx={{ bgcolor:"#FFD700",color:"#12171d" }}>{loading?<CircularProgress size={22} sx={{color:"#12171d"}}/>:"Simpan Data Spending"}</Button>
      </form>
    </motion.div>
  )
}
