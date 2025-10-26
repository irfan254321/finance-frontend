"use client"
import { motion } from "framer-motion"
import { Button, CircularProgress, Table, TableHead, TableRow, TableCell, TableBody, Paper, Pagination } from "@mui/material"
import CustomTextField from "@/components/ui/CustomTextField"

export default function TabCompany({ companies, formCompany, setFormCompany, handleSubmitCompany, pagedCompanies, loading, search, setSearch, page, setPage, pageCount }: any) {
  return (
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.4}}
      className="bg-white/10 backdrop-blur-2xl border border-[#FFD700]/20 rounded-3xl p-10">
      <form onSubmit={handleSubmitCompany} className="flex flex-col md:flex-row gap-4 mb-8">
        <CustomTextField label="Nama Perusahaan" value={formCompany} onChange={(e)=>setFormCompany(e.target.value)} required />
        <Button type="submit" variant="contained" disabled={loading} sx={{bgcolor:"#FFD700",color:"#12171d"}}>
          {loading?<CircularProgress size={22} sx={{color:"#12171d"}}/>:"Simpan"}
        </Button>
      </form>

      <div className="flex justify-end mb-4">
        <CustomTextField size="small" placeholder="Cari perusahaan..." value={search} onChange={(e)=>setSearch(e.target.value)} />
      </div>

      <Paper sx={{background:"transparent"}}>
        <Table stickyHeader>
          <TableHead><TableRow><TableCell sx={{fontWeight:"bold",background:"#FFD700",color:"#12171d"}}>ID</TableCell><TableCell sx={{fontWeight:"bold",background:"#FFD700",color:"#12171d"}}>Nama</TableCell></TableRow></TableHead>
          <TableBody>{pagedCompanies.map((c:any)=><TableRow key={c.id}><TableCell sx={{color:"#ECECEC"}}>{c.id}</TableCell><TableCell sx={{color:"#ECECEC"}}>{c.name_company}</TableCell></TableRow>)}</TableBody>
        </Table>
      </Paper>

      <div className="flex justify-center mt-6">
        <Pagination count={pageCount} page={page} onChange={(_,v)=>setPage(v)} sx={{"& .MuiPaginationItem-root":{color:"#FFD700"}}}/>
      </div>
    </motion.div>
  )
}
