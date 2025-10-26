"use client"
import { motion } from "framer-motion"
import { Button, CircularProgress } from "@mui/material"
import CustomTextField from "@/components/ui/CustomTextField"

export default function TabCategory({ categoryName, setCategoryName, handleSubmitCategory, loading, categories }: any) {
  return (
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.4}}
      className="bg-white/10 backdrop-blur-2xl border border-[#FFD700]/20 rounded-3xl p-10">
      <form onSubmit={handleSubmitCategory} className="flex flex-col gap-6 mb-8">
        <CustomTextField label="Nama Kategori Baru" value={categoryName} onChange={(e)=>setCategoryName(e.target.value)} required />
        <Button type="submit" variant="contained" disabled={loading} sx={{bgcolor:"#FFD700",color:"#12171d"}}>
          {loading?<CircularProgress size={22} sx={{color:"#12171d"}}/>:"Simpan Kategori"}
        </Button>
      </form>
      <p className="text-[#FFD700] font-semibold mb-3 text-xl">Daftar Kategori:</p>
      <ul className="space-y-2 text-gray-200">{categories.map((c:any)=><li key={c.id}>• {c.name_category}</li>)}</ul>
    </motion.div>
  )
}
