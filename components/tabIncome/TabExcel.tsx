"use client"

import { motion } from "framer-motion"
import {
  Button,
  CircularProgress,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material"
import { CloudUpload, Download, InsertDriveFile } from "@mui/icons-material"
import { Key } from "react"

// 🧩 Tab Import Excel
// Menangani upload file Excel, preview, dan import ke database
export default function TabExcel({
  file,
  previewData,
  uploading,
  handleExcelSelect,
  handleUploadExcel,
  handleDownloadTemplate,
}: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white/10 backdrop-blur-2xl border border-[#FFD700]/20 rounded-3xl p-10 shadow-[0_0_25px_rgba(255,215,0,0.08)] text-center"
    >
      {/* Icon & Judul */}
      <CloudUpload sx={{ fontSize: 80, color: "#FFD700" }} />
      <h2 className="text-3xl font-serif font-bold text-[#FFD700] mb-8 mt-4">Upload File Excel</h2>

      {/* Tombol Upload dan Template */}
      <div className="flex justify-center gap-4 mb-8 flex-wrap">
        <Button component="label" variant="outlined" startIcon={<InsertDriveFile />} sx={{ borderColor: "#FFD700", color: "#FFD700", fontWeight: "bold" }}>
          Pilih File Excel
          <input hidden type="file" accept=".xlsx,.xls" onChange={handleExcelSelect} />
        </Button>

        <Button onClick={handleDownloadTemplate} variant="outlined" startIcon={<Download />} sx={{ borderColor: "#FFD700", color: "#FFD700", fontWeight: "bold" }}>
          Download Template
        </Button>
      </div>

      {/* Nama File */}
      {file && <p className="text-gray-200 mb-4">{file.name}</p>}

      {/* Preview Data */}
      {previewData.length > 0 && (
        <Paper sx={{ maxHeight: 400, overflow: "auto", mb: 4, background: "transparent" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {Object.keys(previewData[0]).map((k) => (
                  <TableCell key={k} sx={{ fontWeight: "bold", background: "#FFD700", color: "#12171d" }}>
                    {k}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {previewData.map((r: { [s: string]: unknown } | ArrayLike<unknown>, i: Key | null | undefined) => (
                <TableRow key={i}>
                  {Object.values(r).map((v, j) => (
                    <TableCell key={j} sx={{ color: "#ECECEC" }}>
                      {String(v)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      {/* Tombol Import */}
      <Button
        onClick={handleUploadExcel}
        disabled={uploading || previewData.length === 0}
        sx={{
          bgcolor: "#FFD700",
          color: "#12171d",
          fontWeight: "bold",
          py: 1.6,
          px: 4,
          fontSize: "1.1rem",
          borderRadius: "10px",
          boxShadow: "0 0 20px rgba(255,215,0,0.4)",
          "&:hover": { bgcolor: "#FFE55C", boxShadow: "0 0 40px rgba(255,215,0,0.6)" },
        }}
      >
        {uploading ? <CircularProgress size={26} sx={{ color: "#12171d" }} /> : "Import Data Excel"}
      </Button>
    </motion.div>
  )
}
