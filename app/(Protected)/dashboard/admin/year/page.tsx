"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  TextField,
  Button,
  IconButton,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material"
import { Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material"
import axiosInstance from "@/lib/axiosInstance"

export default function YearInputPage() {
  const [years, setYears] = useState<{ id: number; year: number }[]>([])
  const [newYear, setNewYear] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  })

  useEffect(() => {
    fetchYears()
  }, [])

  const fetchYears = async () => {
    setLoading(true)
    try {
      const res = await axiosInstance.get("/api/year")
      setYears(res.data)
    } catch (err) {
      console.error("Gagal ambil tahun:", err)
      showToast("Gagal mengambil data tahun", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleAddYear = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newYear) return

    setSubmitting(true)
    try {
      await axiosInstance.post("/api/year", { year: parseInt(newYear) })
      showToast("Tahun berhasil ditambahkan", "success")
      setNewYear("")
      fetchYears()
    } catch (err: any) {
      console.error("Gagal tambah tahun:", err)
      showToast(err.response?.data?.message || "Gagal menambahkan tahun", "error")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteYear = async (id: number) => {
    if (!confirm("Yakin ingin menghapus tahun ini?")) return

    try {
      await axiosInstance.delete(`/api/year/${id}`)
      showToast("Tahun berhasil dihapus", "success")
      fetchYears()
    } catch (err: any) {
      console.error("Gagal hapus tahun:", err)
      showToast("Gagal menghapus tahun", "error")
    }
  }

  const showToast = (message: string, severity: "success" | "error") => {
    setToast({ open: true, message, severity })
  }

  const handleCloseToast = () => setToast({ ...toast, open: false })

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a2732] via-[#2C3E50] to-[#1a2732] text-[#EBD77A] p-8 pt-24 font-serif">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <Typography variant="h3" className="font-bold text-[#EBD77A] drop-shadow-lg">
            📅 Kelola Tahun
          </Typography>
          <Typography className="text-[#F4E1C1]/80">
            Tambahkan atau hapus tahun untuk periode laporan keuangan.
          </Typography>
        </motion.div>

        {/* INPUT FORM */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Paper className="p-6 bg-[#1a2732]/80 border border-[#EBD77A]/20 rounded-xl shadow-xl backdrop-blur-sm">
            <form onSubmit={handleAddYear} className="flex gap-4 items-center">
              <TextField
                label="Tahun Baru (YYYY)"
                variant="outlined"
                type="number"
                value={newYear}
                onChange={(e) => setNewYear(e.target.value)}
                fullWidth
                InputLabelProps={{ className: "!text-[#EBD77A]/70" }}
                InputProps={{ className: "!text-[#FFD970] !border-[#EBD77A]/30" }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "rgba(235, 215, 122, 0.3)" },
                    "&:hover fieldset": { borderColor: "#EBD77A" },
                    "&.Mui-focused fieldset": { borderColor: "#FFD970" },
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={submitting || !newYear}
                startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
                className="!bg-[#EBD77A] !text-[#1a2732] !font-bold hover:!bg-[#FFD970] !h-[56px] !px-8 !rounded-lg"
              >
                {submitting ? "Menyimpan..." : "Tambah"}
              </Button>
            </form>
          </Paper>
        </motion.div>

        {/* TABLE LIST */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <TableContainer component={Paper} className="!bg-[#1a2732]/80 !border !border-[#EBD77A]/20 !rounded-xl !shadow-xl !backdrop-blur-sm">
            <Table>
              <TableHead className="bg-[#2C3E50]/50">
                <TableRow>
                  <TableCell className="!text-[#EBD77A] !font-bold !text-lg">No</TableCell>
                  <TableCell className="!text-[#EBD77A] !font-bold !text-lg">Tahun</TableCell>
                  <TableCell align="right" className="!text-[#EBD77A] !font-bold !text-lg">Aksi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center" className="!py-8">
                      <CircularProgress className="!text-[#EBD77A]" />
                    </TableCell>
                  </TableRow>
                ) : years.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center" className="!text-[#F4E1C1]/60 !py-8 !italic">
                      Belum ada data tahun.
                    </TableCell>
                  </TableRow>
                ) : (
                  years.map((row, index) => (
                    <TableRow
                      key={row.id}
                      className="hover:bg-white/5 transition-colors border-b border-[#EBD77A]/10 last:border-0"
                    >
                      <TableCell className="!text-[#F4E1C1]">{index + 1}</TableCell>
                      <TableCell className="!text-[#FFD970] !font-semibold !text-lg">
                        {row.year}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={() => handleDeleteYear(row.id)}
                          className="!text-red-400 hover:!text-red-300 hover:!bg-red-500/10"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </motion.div>

      </div>

      {/* TOAST NOTIFICATION */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseToast} severity={toast.severity} variant="filled" sx={{ width: "100%" }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </div>
  )
}
