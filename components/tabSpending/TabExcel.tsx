"use client"
import { motion } from "framer-motion"
import { Button, CircularProgress, Paper, Table, TableHead, TableRow, TableCell, TableBody, MenuItem } from "@mui/material"
import { CloudUpload, Download, InsertDriveFile } from "@mui/icons-material"
import CustomTextField from "@/components/ui/CustomTextField"

export default function TabExcel({ file, previewData, jenisUpload, setJenisUpload, uploading, handleExcelSelect, handleUploadExcel }: any) {
  return (
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.4}}
      className="bg-white/10 backdrop-blur-2xl border border-[#FFD700]/20 rounded-3xl p-10 text-center">
      <CloudUpload sx={{ fontSize:80, color:"#FFD700" }} />
      <h2 className="text-3xl font-bold text-[#FFD700] mb-6">Upload File Excel Spending</h2>

      <div className="max-w-sm mx-auto mb-6">
        <CustomTextField select value={jenisUpload} onChange={(e)=>setJenisUpload(e.target.value)}>
          <MenuItem value="umum">Spending Umum</MenuItem>
          <MenuItem value="obat">Spending Obat</MenuItem>
        </CustomTextField>
      </div>

      <div className="flex justify-center gap-4 mb-8 flex-wrap">
        <Button component="label" variant="outlined" startIcon={<InsertDriveFile />} sx={{borderColor:"#FFD700",color:"#FFD700"}}>Pilih File
          <input hidden type="file" accept=".xlsx,.xls" onChange={handleExcelSelect}/>
        </Button>
        <Button variant="contained" onClick={handleUploadExcel} disabled={!file || uploading} sx={{bgcolor:"#FFD700",color:"#12171d"}}>
          {uploading?<CircularProgress size={22} sx={{color:"#12171d"}}/>:"Import Data"}
        </Button>
      </div>

      {file && <p className="text-gray-200 mb-4">📂 {file.name}</p>}

      {previewData.length>0 && (
        <Paper sx={{maxHeight:420,overflow:"auto",background:"transparent"}}>
          <Table stickyHeader>
            <TableHead><TableRow>{Object.keys(previewData[0]).map(k=><TableCell key={k} sx={{fontWeight:"bold",background:"#FFD700",color:"#12171d"}}>{k}</TableCell>)}</TableRow></TableHead>
            <TableBody>{previewData.map((r:any,i:number)=><TableRow key={i}>{Object.values(r).map((v,j)=><TableCell key={j} sx={{color:"#ECECEC"}}>{String(v)}</TableCell>)}</TableRow>)}</TableBody>
          </Table>
        </Paper>
      )}
    </motion.div>
  )
}
