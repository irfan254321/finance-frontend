"use client"

import { useEffect, useMemo, useState } from "react"
import axiosInstance from "@/lib/axiosInstance"
import { motion } from "framer-motion"
import {
  Tabs, Tab, Box, Paper, Table, TableHead, TableRow, TableCell, TableBody,
  Button, IconButton, Snackbar, Alert, Pagination, Dialog, DialogTitle, DialogContent,
  DialogActions, MenuItem, CircularProgress, Tooltip
} from "@mui/material"
import { Edit, Delete, Refresh, Search } from "@mui/icons-material"
import CustomTextField from "@/components/ui/CustomTextField"

type Category = { id: number; name_category: string; created_at?: string }
type Income = {
  id: number
  name_income: string
  amount_income: number
  category_id: number
  date_income: string
  created_at?: string
}

const rupiah = (n: number | null | undefined) =>
  "Rp " + new Intl.NumberFormat("id-ID").format(Number(n || 0))

export default function EditIncomePage() {
  const [tab, setTab] = useState(0)
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState<{ open: boolean; message: string; severity: "success" | "error" | "info" }>({
    open: false,
    message: "",
    severity: "success",
  })

  const getErrorMessage = (e: any) => {
  if (typeof e?.response?.data === "string") return e.response.data
  if (typeof e?.response?.data?.message === "string") return e.response.data.message
  return e?.message || "Terjadi kesalahan tak diketahui"
}

  const [categories, setCategories] = useState<Category[]>([])
  const [incomes, setIncomes] = useState<Income[]>([])

  // 🔍 Search & Pagination
  const [catQuery, setCatQuery] = useState("")
  const [incQuery, setIncQuery] = useState("")
  const pageSize = 10

  const filteredCategories = useMemo(
    () => categories.filter(c => c.name_category.toLowerCase().includes(catQuery.toLowerCase())),
    [categories, catQuery]
  )
  const catPageCount = Math.max(1, Math.ceil(filteredCategories.length / pageSize))
  const [catPage, setCatPage] = useState(1)
  const catPaged = useMemo(
    () => filteredCategories.slice((catPage - 1) * pageSize, catPage * pageSize),
    [filteredCategories, catPage]
  )

  const filteredIncomes = useMemo(
    () => incomes.filter(i =>
      `${i.name_income} ${i.date_income} ${i.category_id}`.toLowerCase().includes(incQuery.toLowerCase())
    ),
    [incomes, incQuery]
  )
  const incPageCount = Math.max(1, Math.ceil(filteredIncomes.length / pageSize))
  const [incPage, setIncPage] = useState(1)
  const incPaged = useMemo(
    () => filteredIncomes.slice((incPage - 1) * pageSize, incPage * pageSize),
    [filteredIncomes, incPage]
  )

  // ===== FETCH =====
  const getCategories = async () => {
    try {
      const res = await axiosInstance.get("/api/categoryIncome")
      setCategories(res.data)
    } catch (e: any) {
      setAlert({ open: true, message: getErrorMessage(e), severity: "error" })
    }
  }
  const getIncomes = async () => {
    try {
      const res = await axiosInstance.get("/api/income")
      setIncomes(res.data)
    } catch (e: any) {
      setAlert({ open: true, message: getErrorMessage(e), severity: "error" })
    }
  }
  useEffect(() => {
    getCategories()
    getIncomes()
  }, [])

  // ===== CATEGORY =====
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [editCategoryName, setEditCategoryName] = useState("")
  const openEditCategory = (c: Category) => { setEditingCategory(c); setEditCategoryName(c.name_category) }

  const saveEditCategory = async () => {
    if (!editingCategory) return
    try {
      setLoading(true)
      await axiosInstance.put(`/api/categoryIncome/${editingCategory.id}`, { name_category: editCategoryName })
      setAlert({ open: true, message: "✅ Kategori berhasil diupdate", severity: "success" })
      setEditingCategory(null)
      getCategories()
    } catch (e: any) {
      setAlert({ open: true, message: getErrorMessage(e), severity: "error" })
    } finally { setLoading(false) }
  }

  const deleteCategory = async (id: number) => {
    if (!confirm("Hapus kategori ini?")) return
    try {
      setLoading(true)
      await axiosInstance.delete(`/api/categoryIncome/${id}`)
      setAlert({ open: true, message: "🗑️ Kategori dihapus", severity: "success" })
      getCategories()
    } catch (e: any) {
      setAlert({ open: true, message: getErrorMessage(e), severity: "error" })
    } finally { setLoading(false) }
  }

  // ===== INCOME =====
  const [editingIncome, setEditingIncome] = useState<Income | null>(null)
  const [incForm, setIncForm] = useState({
    name_income: "",
    amount_income: "",
    category_id: "",
    date_income: "",
  })

  const openEditIncome = (i: Income) => {
    setEditingIncome(i)
    setIncForm({
      name_income: i.name_income,
      amount_income: String(i.amount_income || ""),
      category_id: String(i.category_id),
      date_income: i.date_income,
    })
  }

  const saveEditIncome = async () => {
    if (!editingIncome) return
    try {
      setLoading(true)
      await axiosInstance.put(`/api/detailIncome/${editingIncome.id}`, {
        name_income: incForm.name_income,
        amount_income: Number(incForm.amount_income || 0),
        category_id: Number(incForm.category_id),
        date_income: incForm.date_income,
      })
      setAlert({ open: true, message: "✅ Income berhasil diupdate", severity: "success" })
      setEditingIncome(null)
      getIncomes()
    } catch (e: any) {
      setAlert({ open: true, message: getErrorMessage(e), severity: "error" })
    } finally { setLoading(false) }
  }

  const deleteIncome = async (id: number) => {
    if (!confirm("Hapus data income ini?")) return
    try {
      setLoading(true)
      await axiosInstance.delete(`/api/detailIncome/${id}`)
      setAlert({ open: true, message: "🗑️ Income dihapus", severity: "success" })
      getIncomes()
    } catch (e: any) {
      setAlert({ open: true, message: getErrorMessage(e), severity: "error" })
    } finally { setLoading(false) }
  }

  return (
    <main className="min-h-screen font-serif text-[#ECECEC] px-6 md:px-20 py-24 bg-gradient-to-b from-[#0f141a]/70 via-[#1c2430]/80 to-[#12171d]/90 backdrop-blur-xl">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold text-[#FFD700] drop-shadow-[0_2px_10px_rgba(255,215,0,0.2)]">
          EDIT & MANAGE INCOME
        </h1>
        <p className="text-gray-300 mt-4 text-lg max-w-3xl mx-auto">
          Ubah data pendapatan dan kategori secara cepat dan aman.
        </p>
        <div className="w-28 h-[4px] bg-gradient-to-r from-[#2C3E50] to-[#FFD700] mx-auto mt-6 rounded-full" />
      </motion.div>

      {/* WRAPPER */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "1200px",
          p: { xs: 2, md: 3 },
          borderRadius: "20px",
          border: "1px solid rgba(255,215,0,0.20)",
          background: "rgba(18,23,29,0.55)",
          backdropFilter: "blur(16px)",
          boxShadow: "0 0 25px rgba(255,215,0,0.08)",
          mx: "auto",
        }}
      >
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTab-root": {
              color: "#D1D5DB",
              textTransform: "none",
              fontWeight: 600,
              mr: 1,
              borderRadius: "12px",
              px: 2,
              "&.Mui-selected": { color: "#12171d", backgroundColor: "#FFD700" },
            },
          }}
          TabIndicatorProps={{ sx: { height: "0px" } }}
        >
          <Tab label="Category" />
          <Tab label="Income" />
        </Tabs>

        {/* CATEGORY TAB */}
        {tab === 0 && (
          <section className="mt-5">
            <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between mb-3">
              <div className="flex items-center gap-2 w-full md:w-1/2">
                <Search fontSize="small" />
                <CustomTextField
                  fullWidth
                  size="small"
                  placeholder="Cari kategori..."
                  value={catQuery}
                  onChange={(e: any) => setCatQuery(e.target.value)}
                />
              </div>
              <Tooltip title="Refresh">
                <span><IconButton onClick={getCategories} disabled={loading} sx={{ color: "#FFD700" }}><Refresh /></IconButton></span>
              </Tooltip>
            </div>

            <Paper sx={{ background: "transparent", borderRadius: "16px", border: "1px solid rgba(255,215,0,0.2)" }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {["ID", "Nama Kategori", "Aksi"].map(h => (
                      <TableCell key={h} sx={{ fontWeight: "bold", background: "#FFD700", color: "#12171d" }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {catPaged.map(c => (
                    <TableRow key={c.id} hover sx={{ "& td": { color: "#ECECEC" } }}>
                      <TableCell>{c.id}</TableCell>
                      <TableCell>{c.name_category}</TableCell>
                      <TableCell>
                        <IconButton size="small" onClick={() => openEditCategory(c)} sx={{ color: "#FFE55C" }}>
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => deleteCategory(c.id)} sx={{ color: "#ff6363" }}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {catPaged.length === 0 && (
                    <TableRow><TableCell colSpan={3} sx={{ color: "#ECECEC" }}>Tidak ada data</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </Paper>

            <div className="flex justify-center mt-3">
              <Pagination
                count={catPageCount}
                page={catPage}
                onChange={(_, v) => setCatPage(v)}
                sx={{
                  "& .MuiPaginationItem-root": { color: "#ECECEC" },
                  "& .Mui-selected": { bgcolor: "#FFD700", color: "#12171d" }
                }}
              />
            </div>

            {/* Dialog Edit Kategori */}
            <Dialog
              open={!!editingCategory}
              onClose={() => setEditingCategory(null)}
              PaperProps={{
                sx: {
                  background: "rgba(18,23,29,0.95)",
                  border: "1px solid rgba(255,215,0,0.25)",
                  color: "#ECECEC",
                  borderRadius: "16px"
                }
              }}
            >
              <DialogTitle>Edit Kategori</DialogTitle>
              <DialogContent>
                <CustomTextField
                  fullWidth
                  label="Nama Kategori"
                  value={editCategoryName}
                  onChange={(e: any) => setEditCategoryName(e.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setEditingCategory(null)} sx={{ color: "#ECECEC" }}>Batal</Button>
                <Button
                  onClick={saveEditCategory}
                  variant="contained"
                  disabled={loading}
                  sx={{ bgcolor: "#FFD700", color: "#12171d", fontWeight: 700, "&:hover": { bgcolor: "#FFE55C" } }}
                >
                  Simpan
                </Button>
              </DialogActions>
            </Dialog>
          </section>
        )}

        {/* INCOME TAB */}
        {tab === 1 && (
          <section className="mt-5">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-3 mb-3">
              <div className="flex items-center gap-2 w-full md:w-1/2">
                <Search fontSize="small" />
                <CustomTextField
                  fullWidth
                  size="small"
                  placeholder="Cari income (nama/tanggal/category)..."
                  value={incQuery}
                  onChange={(e: any) => setIncQuery(e.target.value)}
                />
              </div>
              <Tooltip title="Refresh">
                <span><IconButton onClick={getIncomes} disabled={loading} sx={{ color: "#FFD700" }}><Refresh /></IconButton></span>
              </Tooltip>
            </div>

            <Paper sx={{ background: "transparent", borderRadius: "16px", border: "1px solid rgba(255,215,0,0.2)" }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {["ID", "Nama", "Jumlah", "Kategori", "Tanggal", "Aksi"].map(h => (
                      <TableCell key={h} sx={{ fontWeight: "bold", background: "#FFD700", color: "#12171d" }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {incPaged.map(i => (
                    <TableRow key={i.id} hover sx={{ "& td": { color: "#ECECEC" } }}>
                      <TableCell>{i.id}</TableCell>
                      <TableCell>{i.name_income}</TableCell>
                      <TableCell>{rupiah(i.amount_income)}</TableCell>
                      <TableCell>{i.category_id}</TableCell>
                      <TableCell>{i.date_income}</TableCell>
                      <TableCell>
                        <IconButton size="small" onClick={() => openEditIncome(i)} sx={{ color: "#FFE55C" }}>
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => deleteIncome(i.id)} sx={{ color: "#ff6363" }}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {incPaged.length === 0 && (
                    <TableRow><TableCell colSpan={6} sx={{ color: "#ECECEC" }}>Tidak ada data</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </Paper>

            <div className="flex justify-center mt-3">
              <Pagination
                count={incPageCount}
                page={incPage}
                onChange={(_, v) => setIncPage(v)}
                sx={{
                  "& .MuiPaginationItem-root": { color: "#ECECEC" },
                  "& .Mui-selected": { bgcolor: "#FFD700", color: "#12171d" }
                }}
              />
            </div>

            {/* Dialog Edit Income */}
            <Dialog
              open={!!editingIncome}
              onClose={() => setEditingIncome(null)}
              maxWidth="sm"
              fullWidth
              PaperProps={{
                sx: {
                  background: "rgba(18,23,29,0.95)",
                  border: "1px solid rgba(255,215,0,0.35)",
                  color: "#ECECEC",
                  borderRadius: "20px",
                  p: 3,
                  boxShadow: "0 0 40px rgba(255,215,0,0.15)",
                },
              }}
            >
              <DialogTitle
                sx={{
                  fontSize: "1.8rem",
                  fontWeight: 700,
                  textAlign: "center",
                  color: "#FFD700",
                  letterSpacing: "0.5px",
                  mb: 2,
                }}
              >
                Edit Income
              </DialogTitle>

              <DialogContent
                className="flex flex-col gap-4"
                sx={{
                  "& .MuiInputBase-input": { fontSize: "1.2rem", py: 2.5 },
                  "& .MuiInputLabel-root": { fontSize: "1.1rem" },
                }}
              >
                <CustomTextField
                  label="Nama Income"
                  fullWidth
                  value={incForm.name_income}
                  onChange={(e: any) => setIncForm({ ...incForm, name_income: e.target.value })}
                />
                <CustomTextField
                  label="Jumlah (Rp)"
                  fullWidth
                  value={new Intl.NumberFormat("id-ID").format(Number(incForm.amount_income || 0))}
                  onChange={(e: any) => {
                    const raw = String(e.target.value).replace(/[^0-9]/g, "")
                    setIncForm({ ...incForm, amount_income: raw })
                  }}
                />
                <CustomTextField
                  select
                  label="Kategori"
                  fullWidth
                  value={incForm.category_id}
                  onChange={(e: any) => setIncForm({ ...incForm, category_id: e.target.value })}
                >
                  {categories.map(c => (
                    <MenuItem key={c.id} value={String(c.id)}>{c.name_category}</MenuItem>
                  ))}
                </CustomTextField>
                <CustomTextField
                  type="date"
                  label="Tanggal"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={incForm.date_income}
                  onChange={(e: any) => setIncForm({ ...incForm, date_income: e.target.value })}
                />
              </DialogContent>

              <DialogActions sx={{ justifyContent: "space-between", mt: 2 }}>
                <Button
                  onClick={() => setEditingIncome(null)}
                  sx={{ color: "#ECECEC", fontSize: "1.1rem", fontWeight: 600 }}
                >
                  BATAL
                </Button>
                <Button
                  onClick={saveEditIncome}
                  variant="contained"
                  disabled={loading}
                  sx={{
                    bgcolor: "#FFD700",
                    color: "#12171d",
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    px: 4,
                    py: 1.2,
                    borderRadius: "10px",
                    "&:hover": { bgcolor: "#FFE55C" },
                  }}
                >
                  SIMPAN
                </Button>
              </DialogActions>
            </Dialog>
          </section>
        )}
      </Box>

      {/* ALERT */}
      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={alert.severity} variant="filled" sx={{ fontSize: "1.05rem", borderRadius: "10px" }}>
          {alert.message}
        </Alert>
      </Snackbar>

      {/* GLOBAL LOADING OVERLAY */}
      {loading && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
          <CircularProgress sx={{ color: "#FFD700" }} />
        </div>
      )}
    </main>
  )
}
