"use client"

import { useState, useEffect, useMemo } from "react"
import axiosInstance from "@/lib/axiosInstance"
import {
    TextField,
    MenuItem,
    Button,
    Snackbar,
    Alert,
    CircularProgress,
    Tabs,
    Tab,
    Box,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Paper,
    Pagination,
    IconButton,
    Tooltip,
} from "@mui/material"
import { motion } from "framer-motion"
import {
    MonetizationOn,
    Category as CategoryIcon,
    InfoOutlined,
    Refresh,
    UploadFile,
    InsertDriveFile,
    CloudUpload,
    Download,
    Business,
} from "@mui/icons-material"
import * as XLSX from "xlsx"

// ====== KONSTAN ID KATEGORI OBAT (Belanja Bakal Kesehatan) ======
const OBAT_CATEGORY_ID = 9 as const

type Category = { id: number; name_category: string }
type Company = { id: number; name_company: string; created_at: string }
type Unit = { id: number; name_unit: string; created_at: string }

type MedicineRow = {
    name_medicine: string
    quantity: string | number
    name_unit_id: string | number
    price: string | number // total harga per baris (bukan unit price)
}

export default function InputSpendingPage() {
    const [tab, setTab] = useState(0)
    const [loading, setLoading] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const [previewData, setPreviewData] = useState<any[]>([])

    // ===== FORM SPENDING =====
    const [form, setForm] = useState({
        name_spending: "",
        amount_spending: "",
        category_id: "",
        date_spending: "",
        company_id: "", // ⬅️ tambahkan company untuk kategori obat
    })

    // ===== CATEGORY STATE =====
    const [categoryName, setCategoryName] = useState("")
    const [categories, setCategories] = useState<Category[]>([])

    // ===== COMPANY MEDICINE (TAB 4) =====
    const [companies, setCompanies] = useState<Company[]>([])
    const [companyLoading, setCompanyLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [formCompany, setFormCompany] = useState("")
    const rowsPerPage = 10
    const pageCount = Math.max(1, Math.ceil(companies.length / rowsPerPage))
    const pagedCompanies = useMemo(() => {
        const start = (page - 1) * rowsPerPage
        return companies.slice(start, start + rowsPerPage)
    }, [companies, page])

    // ===== UNIT (untuk obat) =====
    const [units, setUnits] = useState<Unit[]>([])
    const [unitsLoading, setUnitsLoading] = useState(false)

    // ===== MEDICINES (dynamic list untuk kategori OBAT) =====
    const [medicines, setMedicines] = useState<MedicineRow[]>([
        { name_medicine: "", quantity: "", name_unit_id: "", price: "" },
    ])

    // Total harga obat (jumlahkan price tiap baris; kosong dianggap 0)
    const totalObat = useMemo(() => {
        return medicines.reduce((sum, r) => {
            const clean = String(r.price ?? "").replace(/[^0-9]/g, "")
            const val = clean ? Number(clean) : 0
            return sum + val
        }, 0)
    }, [medicines])

    const [alert, setAlert] = useState({
        open: false,
        message: "",
        severity: "success" as "success" | "error" | "info",
    })

    // ===== FETCHERS =====
    const getCategories = async () => {
        try {
            const res = await axiosInstance.get("/api/inputCategorySpending")
            setCategories(res.data)
        } catch (err) {
            console.error("Gagal mengambil kategori spending:", err)
            setAlert({ open: true, message: "Gagal memuat kategori.", severity: "error" })
        }
    }

    const getCompanies = async () => {
        try {
            setCompanyLoading(true)
            const res = await axiosInstance.get("/api/inputCompanyMedicine")
            setCompanies(res.data)
        } catch (err) {
            console.error("Gagal mengambil company medicine:", err)
            setAlert({ open: true, message: "Gagal memuat company medicine.", severity: "error" })
        } finally {
            setCompanyLoading(false)
        }
    }

    const getUnits = async () => {
        try {
            setUnitsLoading(true)
            const res = await axiosInstance.get("/api/unitMedicine")
            setUnits(res.data)
        } catch (err) {
            console.error("Gagal mengambil unit obat:", err)
            setAlert({ open: true, message: "Gagal memuat unit obat.", severity: "error" })
        } finally {
            setUnitsLoading(false)
        }
    }

    useEffect(() => {
        getCategories()
        getCompanies()
        getUnits()
    }, [])

    // ===== HANDLERS =====
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setForm({ ...form, [name]: value })
    }

    // angka → "Rp 1.234.567"
    const formatRupiah = (num: number) =>
        new Intl.NumberFormat("id-ID", { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num)

    // ===== DYNAMIC MEDICINE LIST HANDLERS =====
    const handleAddMedicine = () => {
        setMedicines((prev) => [...prev, { name_medicine: "", quantity: "", name_unit_id: "", price: "" }])
    }

    const handleRemoveMedicine = (index: number) => {
        setMedicines((prev) => {
            if (prev.length === 1) return prev
            const next = [...prev]
            next.splice(index, 1)
            return next
        })
    }

    const handleMedicineChange = (index: number, field: keyof MedicineRow, rawVal: string) => {
        setMedicines((prev) => {
            const next = [...prev]
            if (field === "price") {
                // simpan numeric only (tanpa "Rp" & titik) di state
                const clean = rawVal.replace(/[^0-9]/g, "")
                next[index][field] = clean
            } else {
                next[index][field] = rawVal
            }
            return next
        })
    }

    // ===== SUBMIT SPENDING =====
    const handleSubmitSpending = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.name_spending || !form.category_id || !form.date_spending) {
            setAlert({ open: true, message: "Semua kolom wajib diisi!", severity: "error" })
            return
        }

        // Jika kategori = OBAT → company wajib, dan minimal 1 baris obat valid
        const isObat = String(form.category_id) === String(OBAT_CATEGORY_ID)
        if (isObat) {
            if (!form.company_id) {
                setAlert({ open: true, message: "Untuk kategori obat, perusahaan wajib dipilih!", severity: "error" })
                return
            }
            const validRows = medicines.filter(
                (m) => m.name_medicine && Number(String(m.quantity || "0")) > 0 && Number(String(m.price || "0")) > 0 && m.name_unit_id
            )
            if (!validRows.length) {
                setAlert({ open: true, message: "Tambahkan minimal 1 obat dengan data lengkap!", severity: "error" })
                return
            }
        } else {
            if (!form.amount_spending) {
                setAlert({ open: true, message: "Jumlah (Rp) wajib diisi!", severity: "error" })
                return
            }
        }

        try {
            setLoading(true)

            const payload: any = {
                ...form,
                amount_spending: isObat ? Number(totalObat) : Number(form.amount_spending),
                category_id: Number(form.category_id),
            }

            if (isObat) {
                payload.company_id = Number(form.company_id)
                payload.medicines = medicines
                    .filter((m) => m.name_medicine && Number(String(m.quantity || "0")) > 0 && Number(String(m.price || "0")) > 0 && m.name_unit_id)
                    .map((m) => ({
                        name_medicine: m.name_medicine,
                        quantity: Number(m.quantity),
                        name_unit_id: Number(m.name_unit_id),
                        price: Number(String(m.price).replace(/[^0-9]/g, "")), // kirim angka murni
                    }))
            }

            const res = await axiosInstance.post("/api/inputSpendingDetail", payload)
            if (res.status === 200) {
                setAlert({
                    open: true,
                    message: "✅ Data spending berhasil disimpan!",
                    severity: "success",
                })
                // reset
                setForm({
                    name_spending: "",
                    amount_spending: "",
                    category_id: "",
                    date_spending: "",
                    company_id: "",
                })
                setMedicines([{ name_medicine: "", quantity: "", name_unit_id: "", price: "" }])
            }
        } catch (err: any) {
            console.error(err)
            setAlert({
                open: true,
                message: err?.response?.data || "Gagal menyimpan data!",
                severity: "error",
            })
        } finally {
            setLoading(false)
        }
    }

    // ===== SUBMIT CATEGORY =====
    const handleSubmitCategory = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!categoryName.trim()) {
            setAlert({ open: true, message: "Nama kategori tidak boleh kosong!", severity: "error" })
            return
        }
        try {
            setLoading(true)
            const res = await axiosInstance.post("/api/inputCategorySpending", { name_category: categoryName })
            if (res.status === 200) {
                setAlert({
                    open: true,
                    message: "✅ Kategori spending baru berhasil disimpan!",
                    severity: "success",
                })
                setCategoryName("")
                getCategories()
            }
        } catch (err: any) {
            console.error(err)
            setAlert({ open: true, message: err?.response?.data || "Gagal menyimpan kategori!", severity: "error" })
        } finally {
            setLoading(false)
        }
    }

    // ===== HANDLE EXCEL UPLOAD =====
    const handleExcelSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0]
        if (!f) return
        setFile(f)

        const reader = new FileReader()
        reader.onload = (event: any) => {
            const workbook = XLSX.read(event.target.result, { type: "binary" })
            const sheet = workbook.SheetNames[0]
            const rawData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet])

            // ✅ Validasi kolom wajib
            const requiredCols = [
                "name_spending",
                "category_id",
                "date_spending",
                "company_id",
                "amount_spending",
                "name_medicine",
                "quantity",
                "unit_id",
                "price_per_item",
            ]

            const missingCols = requiredCols.filter((col) => !Object.keys(rawData[0] || {}).includes(col))
            if (missingCols.length > 0) {
                setAlert({
                    open: true,
                    message: `❌ Kolom berikut hilang di Excel: ${missingCols.join(", ")}`,
                    severity: "error",
                })
                setFile(null)
                setPreviewData([])
                return
            }

            // ✅ Normalisasi data angka & tanggal biar preview lebih rapi
            const normalized = rawData.map((row: any) => ({
                name_spending: row.name_spending || "",
                category_id: Number(row.category_id || 0),
                date_spending: row.date_spending || "",
                company_id: row.company_id ? Number(row.company_id) : "",
                amount_spending: row.amount_spending ? Number(row.amount_spending) : "",
                name_medicine: row.name_medicine || "",
                quantity: row.quantity ? Number(row.quantity) : "",
                unit_id: row.unit_id ? Number(row.unit_id) : "",
                price_per_item: row.price_per_item ? Number(row.price_per_item) : "",
            }))

            setPreviewData(normalized)
        }
        reader.readAsBinaryString(f)
    }


    const handleUploadExcel = async () => {
        if (!file) {
            setAlert({ open: true, message: "📂 Pilih file Excel terlebih dahulu!", severity: "error" })
            return
        }

        if (previewData.length === 0) {
            setAlert({ open: true, message: "📊 Tidak ada data yang akan diupload!", severity: "error" })
            return
        }

        try {
            setLoading(true)
            const formData = new FormData()
            formData.append("file", file)

            const res = await axiosInstance.post("/api/uploadSpendingExcel", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })

            if (res.status === 200) {
                setAlert({
                    open: true,
                    message: `✅ ${res.data.inserted_spending} transaksi dan ${res.data.inserted_medicines} detail obat berhasil diimport!`,
                    severity: "success",
                })
                setFile(null)
                setPreviewData([])
            }
        } catch (err: any) {
            console.error(err)
            setAlert({
                open: true,
                message: "❌ Gagal upload file! Periksa format Excel dan data yang dimasukkan.",
                severity: "error",
            })
        } finally {
            setLoading(false)
        }
    }


    // ===== DOWNLOAD TEMPLATE EXCEL (SYNC DARI CATEGORY DB) =====
    const handleDownloadTemplate = () => {
        const rows = [
            {
                name_spending: "Belanja Obat Januari",
                category_id: 9,
                date_spending: "2025-01-01",
                company_id: 1,
                amount_spending: "",
                name_medicine: "Paracetamol",
                quantity: 200,
                unit_id: 1,
                price_per_item: 2000,
            },
            {
                name_spending: "Belanja Obat Januari",
                category_id: 9,
                date_spending: "2025-01-01",
                company_id: 1,
                amount_spending: "",
                name_medicine: "Asam Mefenamat",
                quantity: 150,
                unit_id: 2,
                price_per_item: 3000,
            },
            {
                name_spending: "Belanja Operasional",
                category_id: 4,
                date_spending: "2025-01-10",
                company_id: "",
                amount_spending: 50000000,
                name_medicine: "",
                quantity: "",
                unit_id: "",
                price_per_item: "",
            },
        ]

        const ws = XLSX.utils.json_to_sheet(rows)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "spending data")
        XLSX.writeFile(wb, "template_spending.xlsx")

        setAlert({
            open: true,
            message: "📥 Template Excel spending (dengan contoh obat) berhasil diunduh!",
            severity: "success",
        })
    }


    const isObat = String(form.category_id) === String(OBAT_CATEGORY_ID)

    return (
        <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-[#E8EBEF] via-[#F9FAFB] to-[#E8EBEF] px-6 pt-32 pb-20">
            {/* HEADER */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-14"
            >
                <div className="flex justify-center items-center gap-6">
                    <MonetizationOn sx={{ fontSize: 70, color: "#FFD700" }} />
                    <h1 className="text-6xl font-serif font-extrabold text-[#2C3E50] tracking-wide">
                        INPUT SPENDING
                    </h1>
                </div>
                <div>
                    <h1 className="text-6xl font-serif font-extrabold text-[#2C3E50] tracking-wide">
                        RS BHAYANGKARA M HASAN PALEMBANG
                    </h1>
                </div>
                <div className="w-36 h-[4px] bg-gradient-to-r from-[#2C3E50] to-[#FFD700] mx-auto mt-5 rounded-full"></div>
            </motion.div>

            {/* TABS */}
            <Box
                sx={{
                    width: "100%",
                    maxWidth: "1100px",
                    mb: 6,
                    bgcolor: "rgba(255,255,255,0.95)",
                    borderRadius: "24px",
                    boxShadow: "0 15px 40px rgba(0,0,0,0.12)",
                }}
            >
                <Tabs
                    value={tab}
                    onChange={(_, v) => setTab(v)}
                    centered
                    TabIndicatorProps={{
                        style: {
                            background: "linear-gradient(90deg,#2C3E50 0%,#FFD700 100%)",
                            height: "5px",
                            borderRadius: "5px",
                        },
                    }}
                >
                    <Tab icon={<MonetizationOn />} label="Input Spending" sx={{ fontSize: "1.2rem", fontWeight: "bold" }} />
                    <Tab icon={<CategoryIcon />} label="Input Kategori" sx={{ fontSize: "1.2rem", fontWeight: "bold" }} />
                    <Tab icon={<UploadFile />} label="Import Excel" sx={{ fontSize: "1.2rem", fontWeight: "bold" }} />
                    <Tab icon={<Business />} label="Company Medicine" sx={{ fontSize: "1.2rem", fontWeight: "bold" }} />
                </Tabs>
            </Box>

            {/* TAB 1: INPUT SPENDING */}
            {tab === 0 && (
                <motion.div
                    key="spending"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white/95 shadow-[0_10px_60px_rgba(0,0,0,0.15)] rounded-[35px] w-full max-w-3xl p-16"
                >
                    <form onSubmit={handleSubmitSpending} className="flex flex-col gap-8">
                        <TextField
                            label="Nama Pengeluaran"
                            name="name_spending"
                            fullWidth
                            value={form.name_spending}
                            onChange={handleChange}
                            required
                        />

                        {/* ===== Jumlah (Rp) =====
                - Jika kategori OBAT → readonly & otomatis dari total obat
                - Selain OBAT → manual input seperti biasa */}
                        <TextField
                            label="Jumlah (Rp)"
                            name="amount_spending"
                            fullWidth
                            value={
                                isObat
                                    ? (totalObat ? `Rp ${formatRupiah(totalObat)}` : "")
                                    : form.amount_spending
                                        ? "Rp " +
                                        new Intl.NumberFormat("id-ID", {
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0,
                                        }).format(Number(form.amount_spending))
                                        : ""
                            }
                            onChange={(e) => {
                                if (isObat) return // ignore; otomatis
                                const raw = e.target.value.replace(/[^0-9]/g, "")
                                setForm({ ...form, amount_spending: raw })
                            }}
                            InputProps={{
                                inputMode: "numeric",
                                readOnly: isObat,
                                sx: { fontSize: "1.2rem", height: 70, pl: 1, bgcolor: isObat ? "rgba(255,215,0,0.06)" : "inherit" },
                            }}
                            InputLabelProps={{
                                sx: { fontSize: "1.1rem" },
                            }}
                            required={!isObat}
                        />

                        <TextField
                            select
                            label="Kategori"
                            name="category_id"
                            fullWidth
                            value={form.category_id}
                            onChange={handleChange}
                            required
                        >
                            {categories.length > 0 ? (
                                categories.map((cat) => (
                                    <MenuItem key={cat.id} value={cat.id}>
                                        {cat.name_category}
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem disabled>Memuat kategori...</MenuItem>
                            )}
                        </TextField>

                        {/* ======= Kalau kategori OBAT, tampilkan Company + Dynamic List Obat ======= */}
                        {isObat && (
                            <>
                                <TextField
                                    select
                                    label="Perusahaan Obat"
                                    name="company_id"
                                    fullWidth
                                    value={form.company_id}
                                    onChange={handleChange}
                                    required
                                >
                                    {companies.length ? (
                                        companies.map((c) => (
                                            <MenuItem key={c.id} value={c.id}>
                                                {c.name_company}
                                            </MenuItem>
                                        ))
                                    ) : (
                                        <MenuItem disabled>Memuat perusahaan...</MenuItem>
                                    )}
                                </TextField>

                                <Divider sx={{ my: 2 }} />
                                <h2 className="text-2xl font-serif font-bold text-[#2C3E50]">🧪 Detail Obat yang Dibeli</h2>
                                <p className="text-sm text-gray-600 mb-2">Harga per baris = total harga obat (bukan harga satuan). Total Rp otomatis dijumlahkan.</p>

                                {medicines.map((m, i) => (
                                    <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                                        <div className="md:col-span-5">
                                            <TextField
                                                label={`Nama Obat #${i + 1}`}
                                                value={m.name_medicine}
                                                onChange={(e) => handleMedicineChange(i, "name_medicine", e.target.value)}
                                                fullWidth
                                                required
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <TextField
                                                label="Qty"
                                                type="number"
                                                value={m.quantity}
                                                onChange={(e) => handleMedicineChange(i, "quantity", e.target.value)}
                                                fullWidth
                                                required
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <TextField
                                                select
                                                label="Unit"
                                                value={m.name_unit_id}
                                                onChange={(e) => handleMedicineChange(i, "name_unit_id", e.target.value)}
                                                fullWidth
                                                required
                                            >
                                                {unitsLoading ? (
                                                    <MenuItem disabled>Memuat unit...</MenuItem>
                                                ) : units.length ? (
                                                    units.map((u) => (
                                                        <MenuItem key={u.id} value={u.id}>
                                                            {u.name_unit}
                                                        </MenuItem>
                                                    ))
                                                ) : (
                                                    <MenuItem disabled>Belum ada unit</MenuItem>
                                                )}
                                            </TextField>
                                        </div>
                                        <div className="md:col-span-2">
                                            <TextField
                                                label="Harga (Rp)"
                                                value={m.price ? `Rp ${formatRupiah(Number(String(m.price).replace(/[^0-9]/g, "")))}` : ""}
                                                onChange={(e) => handleMedicineChange(i, "price", e.target.value)}
                                                fullWidth
                                                InputProps={{ inputMode: "numeric" }}
                                                required
                                            />
                                        </div>
                                        <div className="md:col-span-1">
                                            <Button
                                                color="error"
                                                variant="outlined"
                                                onClick={() => handleRemoveMedicine(i)}
                                                disabled={medicines.length === 1}
                                            >
                                                Hapus
                                            </Button>
                                        </div>
                                    </div>
                                ))}

                                <div className="flex items-center gap-3 mt-2">
                                    <Button variant="outlined" onClick={handleAddMedicine}>
                                        ➕ Tambah Obat
                                    </Button>
                                    <div className="ml-auto text-right">
                                        <div className="text-sm text-gray-600">Total Obat</div>
                                        <div className="text-2xl font-bold text-[#2C3E50]">Rp {formatRupiah(totalObat)}</div>
                                    </div>
                                </div>
                            </>
                        )}

                        <TextField
                            label="Tanggal"
                            name="date_spending"
                            type="date"
                            fullWidth
                            value={form.date_spending}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                            required
                        />

                        <Button type="submit" variant="contained" disabled={loading} sx={{ mt: 2, py: 2, fontSize: "1.1rem" }}>
                            {loading ? <CircularProgress size={28} sx={{ color: "#FFD700" }} /> : "Simpan Data Spending"}
                        </Button>
                    </form>
                </motion.div>
            )}

            {/* TAB 2: INPUT KATEGORI */}
            {tab === 1 && (
                <motion.div
                    key="category"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white/95 shadow-[0_10px_60px_rgba(0,0,0,0.15)] rounded-[35px] w-full max-w-3xl p-16"
                >
                    <form onSubmit={handleSubmitCategory} className="flex flex-col gap-8 mb-8">
                        <TextField
                            label="Nama Kategori Baru (Spending)"
                            fullWidth
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            required
                        />
                        <Button type="submit" variant="contained" disabled={loading}>
                            {loading ? <CircularProgress size={28} sx={{ color: "#FFD700" }} /> : "Simpan Kategori"}
                        </Button>
                    </form>

                    <Divider sx={{ mb: 3 }} />
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-3xl font-serif font-bold text-[#2C3E50] flex items-center gap-2">
                            <InfoOutlined sx={{ fontSize: 40 }} /> Daftar Kategori Spending
                        </h2>
                        <Button onClick={getCategories} startIcon={<Refresh />} variant="outlined">
                            Refresh
                        </Button>
                    </div>

                    <ul className="list-disc ml-6 text-xl text-[#3b4650] leading-relaxed">
                        {categories.length > 0 ? (
                            categories.map((cat) => <li key={cat.id}><b>{cat.name_category}</b></li>)
                        ) : (
                            <p>Belum ada kategori.</p>
                        )}
                    </ul>
                </motion.div>
            )}

            {/* TAB 3: IMPORT EXCEL */}
            {tab === 2 && (
                <motion.div
                    key="excel"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white/95 shadow-[0_10px_60px_rgba(0,0,0,0.15)] rounded-[35px] w-full max-w-5xl p-16 text-center"
                >
                    <CloudUpload sx={{ fontSize: 80, color: "#2C3E50" }} />
                    <h2 className="text-4xl font-serif font-bold text-[#2C3E50] mt-4 mb-6">Upload File Excel Spending</h2>

                    <div className="flex justify-center gap-4 mb-8">
                        <Button component="label" variant="outlined" startIcon={<InsertDriveFile />} sx={{ fontWeight: "bold", px: 4 }}>
                            Pilih File Excel
                            <input hidden type="file" accept=".xlsx,.xls" onChange={handleExcelSelect} />
                        </Button>
                        <Button onClick={handleDownloadTemplate} variant="outlined" startIcon={<Download />} sx={{ fontWeight: "bold", px: 4 }}>
                            Download Template
                        </Button>
                    </div>

                    {file && <p className="text-lg text-[#2C3E50] mb-6">📂 {file.name}</p>}

                    {previewData.length > 0 && (
                        <Paper sx={{ maxHeight: 400, overflow: "auto", mb: 4 }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        {Object.keys(previewData[0]).map((key) => (
                                            <TableCell key={key} sx={{ fontWeight: "bold", background: "#2C3E50", color: "white" }}>
                                                {key}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {previewData.map((row, i) => (
                                        <TableRow key={i}>
                                            {Object.values(row).map((val, j) => (
                                                <TableCell key={j}>{String(val)}</TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Paper>
                    )}

                    <Button onClick={handleUploadExcel} variant="contained" disabled={loading || previewData.length === 0}>
                        {loading ? <CircularProgress size={30} sx={{ color: "#FFD700" }} /> : "Import Data Excel Spending"}
                    </Button>
                </motion.div>
            )}

            {/* TAB 4: COMPANY MEDICINE (INPUT + PAGINATION) */}
            {tab === 3 && (
                <motion.div
                    key="company"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white/95 shadow-[0_10px_60px_rgba(0,0,0,0.15)] rounded-[35px] w-full max-w-5xl p-12"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-serif font-bold text-[#2C3E50] flex items-center gap-2">
                            <Business /> Input & Daftar Company Medicine
                        </h2>
                        <Tooltip title="Refresh">
                            <span>
                                <IconButton onClick={getCompanies} disabled={companyLoading}>
                                    <Refresh />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </div>

                    {/* ====== FORM INPUT COMPANY ====== */}
                    <form
                        onSubmit={async (e) => {
                            e.preventDefault()
                            if (!formCompany.trim()) {
                                setAlert({ open: true, message: "Nama perusahaan wajib diisi!", severity: "error" })
                                return
                            }
                            try {
                                setCompanyLoading(true)
                                const res = await axiosInstance.post("/api/inputCompanyMedicine", { name_company: formCompany })
                                if (res.status === 200) {
                                    setAlert({ open: true, message: "✅ Perusahaan baru disimpan!", severity: "success" })
                                    setFormCompany("")
                                    getCompanies()
                                }
                            } catch (err) {
                                console.error(err)
                                setAlert({ open: true, message: "Gagal simpan perusahaan!", severity: "error" })
                            } finally {
                                setCompanyLoading(false)
                            }
                        }}
                        className="flex flex-col md:flex-row gap-4 mb-8"
                    >
                        <TextField
                            label="Nama Perusahaan Baru"
                            fullWidth
                            value={formCompany}
                            onChange={(e) => setFormCompany(e.target.value)}
                            required
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={companyLoading}
                            sx={{ px: 6, fontWeight: "bold" }}
                        >
                            {companyLoading ? <CircularProgress size={24} /> : "Simpan"}
                        </Button>
                    </form>

                    {/* ====== TABLE COMPANY LIST ====== */}
                    <Paper sx={{ width: "100%", overflow: "hidden" }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: "bold" }}>No</TableCell>
                                    <TableCell sx={{ fontWeight: "bold" }}>Nama Perusahaan</TableCell>
                                    <TableCell sx={{ fontWeight: "bold" }}>Created At</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {companyLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={3}>
                                            <div className="w-full flex justify-center py-6"><CircularProgress /></div>
                                        </TableCell>
                                    </TableRow>
                                ) : pagedCompanies.length > 0 ? (
                                    pagedCompanies.map((c, idx) => (
                                        <TableRow key={c.id}>
                                            <TableCell>{(page - 1) * rowsPerPage + idx + 1}</TableCell>
                                            <TableCell>{c.name_company}</TableCell>
                                            <TableCell>{new Date(c.created_at).toLocaleString("id-ID")}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3}>Belum ada data company.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>

                        </Table>
                    </Paper>

                    <div className="w-full flex justify-center mt-6">
                        <Pagination
                            count={pageCount}
                            page={page}
                            onChange={(_, v) => setPage(v)}
                            color="primary"
                            showFirstButton
                            showLastButton
                        />
                    </div>
                </motion.div>
            )}

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
        </div>
    )
}
