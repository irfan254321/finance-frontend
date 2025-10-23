"use client"

import { useEffect, useMemo, useState } from "react"
import axiosInstance from "@/lib/axiosInstance"
import { motion } from "framer-motion"
import {
    Tabs, Tab, Box, Paper, Table, TableHead, TableRow, TableCell, TableBody, TextField, Button,
    IconButton, Snackbar, Alert, Pagination, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem,
    CircularProgress, Tooltip
} from "@mui/material"
import { Edit, Delete, Refresh, Search } from "@mui/icons-material"

// ===== Types =====
type Category = { id: number; name_category: string; created_at?: string }
type Company = { id: number; name_company: string; created_at?: string }
type UnitMed = { id: number; name_unit: string; created_at?: string }
type Spending = {
    id: number
    name_spending: string
    amount_spending: number
    company_id: number | null
    category_id: number
    date_spending: string
    created_at?: string
}
type MedicineDetail = {
    id: number
    detail_spending_id: number
    name_medicine: string
    quantity: number
    name_unit_id: number
    name_unit?: string
    created_at?: string
}

// ===== Utils =====
const rupiah = (n: number | null | undefined) =>
    "Rp " + new Intl.NumberFormat("id-ID").format(Number(n || 0))

export default function EditSpendingPage() {
    const [tab, setTab] = useState(0)
    const [loading, setLoading] = useState(false)
    const [alert, setAlert] = useState<{ open: boolean; message: string; severity: "success" | "error" | "info" }>({
        open: false,
        message: "",
        severity: "success",
    })

    // ===== Shared Lists =====
    const [categories, setCategories] = useState<Category[]>([])
    const [companies, setCompanies] = useState<Company[]>([])
    const [units, setUnits] = useState<UnitMed[]>([])
    const [spendings, setSpendings] = useState<Spending[]>([])
    const [medicines, setMedicines] = useState<MedicineDetail[]>([])

    // ===== SEARCH states =====
    const [catQuery, setCatQuery] = useState("")
    const [companyQuery, setCompanyQuery] = useState("")
    const [unitQuery, setUnitQuery] = useState("")
    const [spendingQuery, setSpendingQuery] = useState("")
    const [medQuery, setMedQuery] = useState("")
    const [medSearchSpendingId, setMedSearchSpendingId] = useState("")

    // ===== Pagination (client-side) =====
    const pageSize = 10

    // CATEGORY
    const [catPage, setCatPage] = useState(1)
    const filteredCategories = useMemo(
        () => categories.filter(c => c.name_category.toLowerCase().includes(catQuery.toLowerCase())),
        [categories, catQuery]
    )
    const catPageCount = Math.max(1, Math.ceil(filteredCategories.length / pageSize))
    const catPaged = useMemo(() => filteredCategories.slice((catPage - 1) * pageSize, catPage * pageSize), [filteredCategories, catPage])

    // COMPANY
    const [compPage, setCompPage] = useState(1)
    const filteredCompanies = useMemo(
        () => companies.filter(c => c.name_company.toLowerCase().includes(companyQuery.toLowerCase())),
        [companies, companyQuery]
    )
    const compPageCount = Math.max(1, Math.ceil(filteredCompanies.length / pageSize))
    const compPaged = useMemo(() => filteredCompanies.slice((compPage - 1) * pageSize, compPage * pageSize), [filteredCompanies, compPage])

    // UNIT
    const [unitPage, setUnitPage] = useState(1)
    const filteredUnits = useMemo(
        () => units.filter(u => u.name_unit.toLowerCase().includes(unitQuery.toLowerCase())),
        [units, unitQuery]
    )
    const unitPageCount = Math.max(1, Math.ceil(filteredUnits.length / pageSize))
    const unitPaged = useMemo(() => filteredUnits.slice((unitPage - 1) * pageSize, unitPage * pageSize), [filteredUnits, unitPage])

    // SPENDING
    const [spPage, setSpPage] = useState(1)
    const filteredSpendings = useMemo(
        () => spendings.filter(s =>
            `${s.name_spending} ${s.date_spending} ${s.category_id} ${s.company_id ?? ""}`
                .toLowerCase()
                .includes(spendingQuery.toLowerCase())
        ),
        [spendings, spendingQuery]
    )
    const spPageCount = Math.max(1, Math.ceil(filteredSpendings.length / pageSize))
    const spPaged = useMemo(() => filteredSpendings.slice((spPage - 1) * pageSize, spPage * pageSize), [filteredSpendings, spPage])

    // MEDICINE
    const [medPage, setMedPage] = useState(1)
    const filteredMeds = useMemo(
        () => medicines.filter(m => `${m.name_medicine} ${m.detail_spending_id}`.toLowerCase().includes(medQuery.toLowerCase())),
        [medicines, medQuery]
    )
    const medPageCount = Math.max(1, Math.ceil(filteredMeds.length / pageSize))
    const medPaged = useMemo(() => filteredMeds.slice((medPage - 1) * pageSize, medPage * pageSize), [filteredMeds, medPage])

    // ===== Fetchers =====
    const getCategories = async () => {
        try {
            const res = await axiosInstance.get("/api/inputCategorySpending")
            setCategories(res.data)
        } catch {
            setAlert({ open: true, message: "Gagal memuat kategori", severity: "error" })
        }
    }
    const getCompanies = async () => {
        try {
            const res = await axiosInstance.get("/api/inputCompanyMedicine")
            setCompanies(res.data)
        } catch {
            setAlert({ open: true, message: "Gagal memuat perusahaan", severity: "error" })
        }
    }
    const getUnits = async () => {
        try {
            const res = await axiosInstance.get("/api/unitMedicine")
            setUnits(res.data)
        } catch {
            setAlert({ open: true, message: "Gagal memuat unit", severity: "error" })
        }
    }
    const getSpendings = async () => {
        try {
            const res = await axiosInstance.get("/api/spending")
            setSpendings(res.data)
        } catch {
            setAlert({ open: true, message: "Gagal memuat spending", severity: "error" })
        }
    }
    const getMedicinesBySpendingId = async (detail_spending_id: number) => {
        try {
            const res = await axiosInstance.post("/api/spendingMedicineBySpendingId", { detail_spending_id })
            setMedicines(res.data)
        } catch {
            setAlert({ open: true, message: "Gagal memuat detail obat", severity: "error" })
        }
    }

    // initial
    useEffect(() => {
        getCategories()
        getCompanies()
        getUnits()
        getSpendings()
    }, [])

    // ====== CATEGORY: Edit/Hapus ======
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [editCategoryName, setEditCategoryName] = useState("")
    const openEditCategory = (c: Category) => {
        setEditingCategory(c)
        setEditCategoryName(c.name_category)
    }
    const saveEditCategory = async () => {
        if (!editingCategory) return
        try {
            setLoading(true)
            await axiosInstance.put(`/api/categorySpending/${editingCategory.id}`, { name_category: editCategoryName })
            setAlert({ open: true, message: "✅ Kategori diupdate", severity: "success" })
            setEditingCategory(null)
            getCategories()
        } catch (e: any) {
            setAlert({ open: true, message: e?.response?.data || "Gagal update kategori", severity: "error" })
        } finally {
            setLoading(false)
        }
    }
    const deleteCategory = async (id: number) => {
        if (!confirm("Hapus kategori ini?")) return
        try {
            setLoading(true)
            await axiosInstance.delete(`/api/categorySpending/${id}`)
            setAlert({ open: true, message: "🗑️ Kategori dihapus", severity: "success" })
            getCategories()
        } catch (e: any) {
            setAlert({ open: true, message: e?.response?.data || "Gagal hapus kategori", severity: "error" })
        } finally {
            setLoading(false)
        }
    }

    // ====== COMPANY: Edit/Hapus ======
    const [editingCompany, setEditingCompany] = useState<Company | null>(null)
    const [editCompanyName, setEditCompanyName] = useState("")
    const openEditCompany = (c: Company) => {
        setEditingCompany(c)
        setEditCompanyName(c.name_company)
    }
    const saveEditCompany = async () => {
        if (!editingCompany) return
        try {
            setLoading(true)
            await axiosInstance.put(`/api/companyMedicine/${editingCompany.id}`, { name_company: editCompanyName })
            setAlert({ open: true, message: "✅ Perusahaan diupdate", severity: "success" })
            setEditingCompany(null)
            getCompanies()
        } catch (e: any) {
            setAlert({ open: true, message: e?.response?.data || "Gagal update perusahaan", severity: "error" })
        } finally {
            setLoading(false)
        }
    }
    const deleteCompany = async (id: number) => {
        if (!confirm("Hapus perusahaan ini?")) return
        try {
            setLoading(true)
            await axiosInstance.delete(`/api/companyMedicine/${id}`)
            setAlert({ open: true, message: "🗑️ Perusahaan dihapus", severity: "success" })
            getCompanies()
        } catch (e: any) {
            setAlert({ open: true, message: e?.response?.data || "Gagal hapus perusahaan", severity: "error" })
        } finally {
            setLoading(false)
        }
    }

    // ====== UNIT: Tambah/Edit/Hapus ======
    const [unitName, setUnitName] = useState("")
    const [editingUnit, setEditingUnit] = useState<UnitMed | null>(null)
    const [editUnitName, setEditUnitName] = useState("")

    const addUnit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!unitName.trim()) {
            setAlert({ open: true, message: "Nama unit wajib diisi!", severity: "error" })
            return
        }
        try {
            setLoading(true)
            await axiosInstance.post("/api/unitMedicine", { name_unit: unitName })
            setAlert({ open: true, message: "✅ Unit ditambahkan", severity: "success" })
            setUnitName("")
            getUnits()
        } catch (e: any) {
            setAlert({ open: true, message: e?.response?.data || "Gagal tambah unit", severity: "error" })
        } finally {
            setLoading(false)
        }
    }
    const openEditUnit = (u: UnitMed) => {
        setEditingUnit(u)
        setEditUnitName(u.name_unit)
    }
    const saveEditUnit = async () => {
        if (!editingUnit) return
        try {
            setLoading(true)
            await axiosInstance.put(`/api/unitMedicine/${editingUnit.id}`, { name_unit: editUnitName })
            setAlert({ open: true, message: "✅ Unit diupdate", severity: "success" })
            setEditingUnit(null)
            getUnits()
        } catch (e: any) {
            setAlert({ open: true, message: e?.response?.data || "Gagal update unit", severity: "error" })
        } finally {
            setLoading(false)
        }
    }
    const deleteUnit = async (id: number) => {
        if (!confirm("Hapus unit ini?")) return
        try {
            setLoading(true)
            await axiosInstance.delete(`/api/unitMedicine/${id}`)
            setAlert({ open: true, message: "🗑️ Unit dihapus", severity: "success" })
            getUnits()
        } catch (e: any) {
            setAlert({ open: true, message: e?.response?.data || "Gagal hapus unit", severity: "error" })
        } finally {
            setLoading(false)
        }
    }

    // ====== SPENDING: Edit/Hapus ======
    const [editingSpending, setEditingSpending] = useState<Spending | null>(null)
    const [spForm, setSpForm] = useState({
        name_spending: "",
        amount_spending: "",
        category_id: "",
        date_spending: "",
        company_id: "",
    })
    const openEditSpending = (s: Spending) => {
        setEditingSpending(s)
        setSpForm({
            name_spending: s.name_spending,
            amount_spending: String(s.amount_spending ?? ""),
            category_id: String(s.category_id),
            date_spending: s.date_spending,
            company_id: s.company_id ? String(s.company_id) : "",
        })
    }
    const saveEditSpending = async () => {
        if (!editingSpending) return
        try {
            setLoading(true)
            await axiosInstance.put(`/api/detailSpending/${editingSpending.id}`, {
                name_spending: spForm.name_spending,
                amount_spending: spForm.category_id === "9" ? undefined : Number(spForm.amount_spending || 0), // kategori 9 tidak wajib
                category_id: Number(spForm.category_id),
                date_spending: spForm.date_spending,
                company_id: spForm.company_id ? Number(spForm.company_id) : null,
            })
            setAlert({ open: true, message: "✅ Spending diupdate", severity: "success" })
            setEditingSpending(null)
            getSpendings()
        } catch (e: any) {
            setAlert({ open: true, message: e?.response?.data || "Gagal update spending", severity: "error" })
        } finally {
            setLoading(false)
        }
    }
    const deleteSpending = async (id: number) => {
        if (!confirm("Hapus transaksi ini beserta semua detail obat?")) return
        try {
            setLoading(true)
            await axiosInstance.delete(`/api/detailSpending/${id}`)
            setAlert({ open: true, message: "🗑️ Spending dihapus", severity: "success" })
            getSpendings()
        } catch (e: any) {
            setAlert({ open: true, message: e?.response?.data || "Gagal hapus spending", severity: "error" })
        } finally {
            setLoading(false)
        }
    }

    // ====== MEDICINE: Edit/Hapus ======
    const [editingMed, setEditingMed] = useState<MedicineDetail | null>(null)
    const [medForm, setMedForm] = useState({ name_medicine: "", quantity: "", name_unit_id: "" })

    const startEditMed = (m: MedicineDetail) => {
        setEditingMed(m)
        setMedForm({
            name_medicine: m.name_medicine,
            quantity: String(m.quantity),
            name_unit_id: String(m.name_unit_id),
        })
    }
    const saveEditMed = async () => {
        if (!editingMed) return
        try {
            setLoading(true)
            await axiosInstance.put(`/api/detailMedicineSpending/${editingMed.id}`, {
                name_medicine: medForm.name_medicine,
                quantity: Number(medForm.quantity || 0),
                name_unit_id: Number(medForm.name_unit_id || 0),
            })
            setAlert({ open: true, message: "✅ Detail obat diupdate", severity: "success" })
            // refresh list based on where we are (by search or last loaded)
            if (medSearchSpendingId) {
                await getMedicinesBySpendingId(Number(medSearchSpendingId))
            }
            setEditingMed(null)
        } catch (e: any) {
            setAlert({ open: true, message: e?.response?.data || "Gagal update obat", severity: "error" })
        } finally {
            setLoading(false)
        }
    }
    const deleteMed = async (id: number) => {
        if (!confirm("Hapus obat ini?")) return
        try {
            setLoading(true)
            await axiosInstance.delete(`/api/detailMedicineSpending/${id}`)
            setAlert({ open: true, message: "🗑️ Obat dihapus", severity: "success" })
            if (medSearchSpendingId) {
                await getMedicinesBySpendingId(Number(medSearchSpendingId))
            }
        } catch (e: any) {
            setAlert({ open: true, message: e?.response?.data || "Gagal hapus obat", severity: "error" })
        } finally {
            setLoading(false)
        }
    }
    const searchMedBySpending = async () => {
        const id = Number(medSearchSpendingId || 0)
        if (!id) {
            setAlert({ open: true, message: "Isi Spending ID dulu", severity: "error" })
            return
        }
        await getMedicinesBySpendingId(id)
    }

    // ===== Render =====
    return (
        <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-[#E8EBEF] via-[#F9FAFB] to-[#E8EBEF] px-6 py-16 mt-28">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-8"
            >
                <h1 className="text-4xl md:text-5xl font-serif font-extrabold text-[#2C3E50] tracking-wide">
                    EDIT & MANAGE SPENDING
                </h1>
                <div className="w-28 h-[4px] bg-gradient-to-r from-[#2C3E50] to-[#FFD700] mx-auto mt-4 rounded-full" />
            </motion.div>

            {/* Tabs */}
            <Box
                sx={{
                    width: "100%",
                    maxWidth: "1200px",
                    bgcolor: "rgba(255,255,255,0.95)",
                    borderRadius: "20px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                    p: { xs: 2, md: 3 },
                }}
            >
                <Tabs
                    value={tab}
                    onChange={(_, v) => setTab(v)}
                    variant="scrollable"
                    scrollButtons="auto"
                    TabIndicatorProps={{
                        style: {
                            background: "linear-gradient(90deg,#2C3E50 0%,#FFD700 100%)",
                            height: "4px",
                            borderRadius: "4px",
                        },
                    }}
                >
                    <Tab label="Category" />
                    <Tab label="Company" />
                    <Tab label="Unit" />
                    <Tab label="Spending" />
                    <Tab label="Medicine Detail" />
                </Tabs>

                {/* CATEGORY TAB */}
                {tab === 0 && (
                    <section className="mt-4">
                        <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between mb-3">
                            <div className="flex items-center gap-2 w-full md:w-1/2">
                                <Search fontSize="small" />
                                <TextField fullWidth size="small" placeholder="Cari kategori..."
                                    value={catQuery} onChange={e => setCatQuery(e.target.value)} />
                            </div>
                            <Tooltip title="Refresh">
                                <span>
                                    <IconButton onClick={getCategories} disabled={loading}><Refresh /></IconButton>
                                </span>
                            </Tooltip>
                        </div>
                        <Paper>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                                        <TableCell sx={{ fontWeight: "bold" }}>Nama Kategori</TableCell>
                                        <TableCell sx={{ fontWeight: "bold" }}>Aksi</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {catPaged.map(c => (
                                        <TableRow key={c.id}>
                                            <TableCell>{c.id}</TableCell>
                                            <TableCell>{c.name_category}</TableCell>
                                            <TableCell>
                                                <IconButton size="small" onClick={() => openEditCategory(c)}><Edit fontSize="small" /></IconButton>
                                                <IconButton size="small" color="error" onClick={() => deleteCategory(c.id)}><Delete fontSize="small" /></IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {catPaged.length === 0 && (
                                        <TableRow><TableCell colSpan={3}>Tidak ada data</TableCell></TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </Paper>
                        <div className="flex justify-center mt-3">
                            <Pagination count={catPageCount} page={catPage} onChange={(_, v) => setCatPage(v)} />
                        </div>

                        <Dialog open={!!editingCategory} onClose={() => setEditingCategory(null)}>
                            <DialogTitle>Edit Kategori</DialogTitle>
                            <DialogContent>
                                <TextField fullWidth label="Nama Kategori" sx={{ mt: 1 }}
                                    value={editCategoryName} onChange={e => setEditCategoryName(e.target.value)} />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setEditingCategory(null)}>Batal</Button>
                                <Button onClick={saveEditCategory} variant="contained" disabled={loading}>Simpan</Button>
                            </DialogActions>
                        </Dialog>
                    </section>
                )}

                {/* COMPANY TAB */}
                {tab === 1 && (
                    <section className="mt-4">
                        <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between mb-3">
                            <div className="flex items-center gap-2 w-full md:w-1/2">
                                <Search fontSize="small" />
                                <TextField fullWidth size="small" placeholder="Cari perusahaan..."
                                    value={companyQuery} onChange={e => setCompanyQuery(e.target.value)} />
                            </div>
                            <Tooltip title="Refresh">
                                <span>
                                    <IconButton onClick={getCompanies} disabled={loading}><Refresh /></IconButton>
                                </span>
                            </Tooltip>
                        </div>
                        <Paper>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                                        <TableCell sx={{ fontWeight: "bold" }}>Nama Perusahaan</TableCell>
                                        <TableCell sx={{ fontWeight: "bold" }}>Created At</TableCell>
                                        <TableCell sx={{ fontWeight: "bold" }}>Aksi</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {compPaged.map(c => (
                                        <TableRow key={c.id}>
                                            <TableCell>{c.id}</TableCell>
                                            <TableCell>{c.name_company}</TableCell>
                                            <TableCell>{c.created_at ? new Date(c.created_at).toLocaleString("id-ID") : "-"}</TableCell>
                                            <TableCell>
                                                <IconButton size="small" onClick={() => openEditCompany(c)}><Edit fontSize="small" /></IconButton>
                                                <IconButton size="small" color="error" onClick={() => deleteCompany(c.id)}><Delete fontSize="small" /></IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {compPaged.length === 0 && (
                                        <TableRow><TableCell colSpan={4}>Tidak ada data</TableCell></TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </Paper>
                        <div className="flex justify-center mt-3">
                            <Pagination count={compPageCount} page={compPage} onChange={(_, v) => setCompPage(v)} />
                        </div>

                        <Dialog open={!!editingCompany} onClose={() => setEditingCompany(null)}>
                            <DialogTitle>Edit Perusahaan</DialogTitle>
                            <DialogContent>
                                <TextField fullWidth label="Nama Perusahaan" sx={{ mt: 1 }}
                                    value={editCompanyName} onChange={e => setEditCompanyName(e.target.value)} />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setEditingCompany(null)}>Batal</Button>
                                <Button onClick={saveEditCompany} variant="contained" disabled={loading}>Simpan</Button>
                            </DialogActions>
                        </Dialog>
                    </section>
                )}

                {/* UNIT TAB */}
                {tab === 2 && (
                    <section className="mt-4">
                        <div className="flex flex-col md:flex-row items-start md:items-end gap-3 mb-3">
                            <div className="flex items-center gap-2 w-full md:w-1/2">
                                <Search fontSize="small" />
                                <TextField fullWidth size="small" placeholder="Cari unit..."
                                    value={unitQuery} onChange={e => setUnitQuery(e.target.value)} />
                            </div>
                            <form onSubmit={addUnit} className="flex gap-2 w-full md:w-1/2">
                                <TextField fullWidth label="Tambah Unit Baru" value={unitName} onChange={e => setUnitName(e.target.value)} />
                                <Button type="submit" variant="contained" disabled={loading}>Tambah</Button>
                                <Tooltip title="Refresh">
                                    <span><IconButton onClick={getUnits} disabled={loading}><Refresh /></IconButton></span>
                                </Tooltip>
                            </form>
                        </div>
                        <Paper>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                                        <TableCell sx={{ fontWeight: "bold" }}>Nama Unit</TableCell>
                                        <TableCell sx={{ fontWeight: "bold" }}>Aksi</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {unitPaged.map(u => (
                                        <TableRow key={u.id}>
                                            <TableCell>{u.id}</TableCell>
                                            <TableCell>{u.name_unit}</TableCell>
                                            <TableCell>
                                                <IconButton size="small" onClick={() => openEditUnit(u)}><Edit fontSize="small" /></IconButton>
                                                <IconButton size="small" color="error" onClick={() => deleteUnit(u.id)}><Delete fontSize="small" /></IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {unitPaged.length === 0 && (
                                        <TableRow><TableCell colSpan={3}>Tidak ada data</TableCell></TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </Paper>
                        <div className="flex justify-center mt-3">
                            <Pagination count={unitPageCount} page={unitPage} onChange={(_, v) => setUnitPage(v)} />
                        </div>

                        <Dialog open={!!editingUnit} onClose={() => setEditingUnit(null)}>
                            <DialogTitle>Edit Unit</DialogTitle>
                            <DialogContent>
                                <TextField fullWidth label="Nama Unit" sx={{ mt: 1 }}
                                    value={editUnitName} onChange={e => setEditUnitName(e.target.value)} />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setEditingUnit(null)}>Batal</Button>
                                <Button onClick={saveEditUnit} variant="contained" disabled={loading}>Simpan</Button>
                            </DialogActions>
                        </Dialog>
                    </section>
                )}

                {/* SPENDING TAB */}
                {tab === 3 && (
                    <section className="mt-4">
                        <div className="flex flex-col md:flex-row items-start md:items-end gap-3 mb-3">
                            <div className="flex items-center gap-2 w-full md:w-1/2">
                                <Search fontSize="small" />
                                <TextField fullWidth size="small" placeholder="Cari spending (nama/tanggal/category/company)..."
                                    value={spendingQuery} onChange={e => setSpendingQuery(e.target.value)} />
                            </div>
                            <Tooltip title="Refresh">
                                <span><IconButton onClick={getSpendings} disabled={loading}><Refresh /></IconButton></span>
                            </Tooltip>
                        </div>
                        <Paper>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                                        <TableCell sx={{ fontWeight: "bold" }}>Nama</TableCell>
                                        <TableCell sx={{ fontWeight: "bold" }}>Jumlah</TableCell>
                                        <TableCell sx={{ fontWeight: "bold" }}>Kategori</TableCell>
                                        <TableCell sx={{ fontWeight: "bold" }}>Company</TableCell>
                                        <TableCell sx={{ fontWeight: "bold" }}>Tanggal</TableCell>
                                        <TableCell sx={{ fontWeight: "bold" }}>Aksi</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {spPaged.map(s => (
                                        <TableRow key={s.id}>
                                            <TableCell>{s.id}</TableCell>
                                            <TableCell>{s.name_spending}</TableCell>
                                            <TableCell>{rupiah(s.amount_spending)}</TableCell>
                                            <TableCell>{s.category_id}</TableCell>
                                            <TableCell>{s.company_id ?? "-"}</TableCell>
                                            <TableCell>{s.date_spending}</TableCell>
                                            <TableCell>
                                                <IconButton size="small" onClick={() => openEditSpending(s)}><Edit fontSize="small" /></IconButton>
                                                <IconButton size="small" color="error" onClick={() => deleteSpending(s.id)}><Delete fontSize="small" /></IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {spPaged.length === 0 && (
                                        <TableRow><TableCell colSpan={7}>Tidak ada data</TableCell></TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </Paper>
                        <div className="flex justify-center mt-3">
                            <Pagination count={spPageCount} page={spPage} onChange={(_, v) => setSpPage(v)} />
                        </div>

                        {/* Edit Spending Dialog */}
                        <Dialog open={!!editingSpending} onClose={() => setEditingSpending(null)} maxWidth="sm" fullWidth>
                            <DialogTitle>Edit Spending</DialogTitle>
                            <DialogContent className="flex flex-col gap-3">
                                <TextField
                                    label="Nama Spending"
                                    fullWidth
                                    value={spForm.name_spending}
                                    onChange={(e) => setSpForm({ ...spForm, name_spending: e.target.value })}
                                />
                                <TextField
                                    select
                                    label="Kategori"
                                    fullWidth
                                    value={spForm.category_id}
                                    onChange={(e) => setSpForm({ ...spForm, category_id: e.target.value })}
                                >
                                    {categories.map(c => (
                                        <MenuItem key={c.id} value={String(c.id)}>{c.name_category}</MenuItem>
                                    ))}
                                </TextField>
                                <TextField
                                    label="Tanggal"
                                    type="date"
                                    fullWidth
                                    value={spForm.date_spending}
                                    onChange={(e) => setSpForm({ ...spForm, date_spending: e.target.value })}
                                    InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                    label="Company ID (khusus kategori 9)"
                                    fullWidth
                                    value={spForm.company_id}
                                    onChange={(e) => setSpForm({ ...spForm, company_id: e.target.value })}
                                />
                                <TextField
                                    label="Amount (Rp)"
                                    fullWidth
                                    value={
                                        spForm.category_id === "9"
                                            ? "Auto (total dari detail obat)"
                                            : (spForm.amount_spending
                                                ? "Rp " + new Intl.NumberFormat("id-ID").format(Number(spForm.amount_spending))
                                                : "")
                                    }
                                    onChange={(e) => {
                                        const raw = e.target.value.replace(/[^0-9]/g, "")
                                        setSpForm({ ...spForm, amount_spending: raw })
                                    }}
                                    disabled={spForm.category_id === "9"}
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setEditingSpending(null)}>Batal</Button>
                                <Button onClick={saveEditSpending} variant="contained" disabled={loading}>Simpan</Button>
                            </DialogActions>
                        </Dialog>
                    </section>
                )}

                {/* MEDICINE DETAIL TAB */}
                {tab === 4 && (
                    <section className="mt-4">
                        <div className="flex flex-col md:flex-row gap-3 items-start md:items-end mb-3">
                            <div className="flex items-center gap-2 w-full md:w-1/2">
                                <Search fontSize="small" />
                                <TextField fullWidth size="small" placeholder="Cari obat (nama/ID spending)..."
                                    value={medQuery} onChange={e => setMedQuery(e.target.value)} />
                            </div>
                            <div className="flex items-end gap-2 w-full md:w-1/2">
                                <TextField
                                    fullWidth
                                    label="Cari berdasarkan Spending ID"
                                    value={medSearchSpendingId}
                                    onChange={(e) => setMedSearchSpendingId(e.target.value.replace(/[^0-9]/g, ""))}
                                    inputProps={{ inputMode: "numeric" }}
                                />
                                <Button variant="contained" onClick={searchMedBySpending}>Cari</Button>
                            </div>
                        </div>
                        <Paper>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                                        <TableCell sx={{ fontWeight: "bold" }}>Spending ID</TableCell>
                                        <TableCell sx={{ fontWeight: "bold" }}>Nama Obat</TableCell>
                                        <TableCell sx={{ fontWeight: "bold" }}>Qty</TableCell>
                                        <TableCell sx={{ fontWeight: "bold" }}>Unit</TableCell>
                                        <TableCell sx={{ fontWeight: "bold" }}>Aksi</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {medPaged.map(m => (
                                        <TableRow key={m.id}>
                                            <TableCell>{m.id}</TableCell>
                                            <TableCell>{m.detail_spending_id}</TableCell>
                                            <TableCell>{m.name_medicine}</TableCell>
                                            <TableCell>{m.quantity}</TableCell>
                                            <TableCell>{m.name_unit ?? m.name_unit_id}</TableCell>
                                            <TableCell>
                                                <IconButton size="small" onClick={() => startEditMed(m)}><Edit fontSize="small" /></IconButton>
                                                <IconButton size="small" color="error" onClick={() => deleteMed(m.id)}><Delete fontSize="small" /></IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {medPaged.length === 0 && (
                                        <TableRow><TableCell colSpan={6}>Tidak ada data</TableCell></TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </Paper>
                        <div className="flex justify-center mt-3">
                            <Pagination count={medPageCount} page={medPage} onChange={(_, v) => setMedPage(v)} />
                        </div>

                        {/* Edit Medicine Dialog */}
                        <Dialog open={!!editingMed} onClose={() => setEditingMed(null)}>
                            <DialogTitle>Edit Detail Obat</DialogTitle>
                            <DialogContent className="flex flex-col gap-3">
                                <TextField
                                    label="Nama Obat"
                                    fullWidth
                                    value={medForm.name_medicine}
                                    onChange={(e) => setMedForm({ ...medForm, name_medicine: e.target.value })}
                                />
                                <TextField
                                    label="Quantity"
                                    fullWidth
                                    value={medForm.quantity}
                                    onChange={(e) => setMedForm({ ...medForm, quantity: e.target.value.replace(/[^0-9]/g, "") })}
                                />
                                <TextField
                                    select
                                    label="Unit"
                                    fullWidth
                                    value={medForm.name_unit_id}
                                    onChange={(e) => setMedForm({ ...medForm, name_unit_id: e.target.value })}
                                >
                                    {units.map(u => (
                                        <MenuItem key={u.id} value={String(u.id)}>{u.name_unit}</MenuItem>
                                    ))}
                                </TextField>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setEditingMed(null)}>Batal</Button>
                                <Button onClick={saveEditMed} variant="contained" disabled={loading}>Simpan</Button>
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

            {/* GLOBAL LOADING OVERLAY (subtle) */}
            {loading && (
                <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
                    <CircularProgress />
                </div>
            )}
        </div>
    )
}
