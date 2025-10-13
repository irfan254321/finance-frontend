"use client"

import { useState, useEffect } from "react"
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
} from "@mui/material"
import { motion } from "framer-motion"
import {
    MonetizationOn,
    Category,
    InfoOutlined,
    Refresh,
    UploadFile,
    InsertDriveFile,
    CloudUpload,
    Download,
} from "@mui/icons-material"
import * as XLSX from "xlsx"

export default function InputIncomePage() {
    const [tab, setTab] = useState(0)
    const [loading, setLoading] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const [previewData, setPreviewData] = useState<any[]>([])

    // === FORM INCOME ===
    const [form, setForm] = useState({
        name_income: "",
        amount_income: "",
        category_id: "",
        date_income: "",
    })

    // === FORM CATEGORY ===
    const [categoryName, setCategoryName] = useState("")
    const [categories, setCategories] = useState<{ id: number; name_category: string }[]>([])

    const [alert, setAlert] = useState({
        open: false,
        message: "",
        severity: "success" as "success" | "error",
    })

    // === FETCH CATEGORIES ===
    const getCategories = async () => {
        try {
            const res = await axiosInstance.get("/api/categoryIncome")
            setCategories(res.data)
        } catch (err) {
            console.error("Gagal mengambil kategori:", err)
        }
    }

    useEffect(() => {
        getCategories()
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setForm({ ...form, [name]: value })
    }

    // === SUBMIT INCOME ===
    const handleSubmitIncome = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.name_income || !form.amount_income || !form.category_id || !form.date_income) {
            setAlert({ open: true, message: "Semua kolom wajib diisi!", severity: "error" })
            return
        }

        try {
            setLoading(true)
            const res = await axiosInstance.post("/api/inputIncomeDetail", form)
            if (res.status === 200) {
                setAlert({
                    open: true,
                    message: "✅ Data income berhasil disimpan!",
                    severity: "success",
                })
                setForm({ name_income: "", amount_income: "", category_id: "", date_income: "" })
            }
        } catch (err) {
            console.error(err)
            setAlert({ open: true, message: "Gagal menyimpan data!", severity: "error" })
        } finally {
            setLoading(false)
        }
    }

    // === SUBMIT CATEGORY ===
    const handleSubmitCategory = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!categoryName.trim()) {
            setAlert({ open: true, message: "Nama kategori tidak boleh kosong!", severity: "error" })
            return
        }
        try {
            setLoading(true)
            const res = await axiosInstance.post("/api/inputCategoryIncome", {
                name_category: categoryName,
            })
            if (res.status === 200) {
                setAlert({
                    open: true,
                    message: "✅ Kategori baru berhasil disimpan!",
                    severity: "success",
                })
                setCategoryName("")
                getCategories()
            }
        } catch (err) {
            console.error(err)
            setAlert({ open: true, message: "Gagal menyimpan kategori!", severity: "error" })
        } finally {
            setLoading(false)
        }
    }

    // === HANDLE EXCEL UPLOAD ===
    const handleExcelSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setFile(file)

        const reader = new FileReader()
        reader.onload = (event: any) => {
            const workbook = XLSX.read(event.target.result, { type: "binary" })
            const sheet = workbook.SheetNames[0]
            const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
            setPreviewData(data)
        }
        reader.readAsBinaryString(file)
    }

    const handleUploadExcel = async () => {
        if (!file) {
            setAlert({ open: true, message: "Pilih file Excel terlebih dahulu!", severity: "error" })
            return
        }

        try {
            setLoading(true)
            const formData = new FormData()
            formData.append("file", file)

            const res = await axiosInstance.post("/api/uploadIncomeExcel", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })

            if (res.status === 200) {
                setAlert({
                    open: true,
                    message: `✅ ${res.data.inserted} baris berhasil diimport!`,
                    severity: "success",
                })
                setFile(null)
                setPreviewData([])
            }
        } catch (err) {
            console.error(err)
            setAlert({
                open: true,
                message: "❌ Gagal upload file! Pastikan format Excel sesuai.",
                severity: "error",
            })
        } finally {
            setLoading(false)
        }
    }

    // === DOWNLOAD TEMPLATE EXCEL (SYNC DARI CATEGORY DB) ===
    const handleDownloadTemplate = () => {
        const exampleRows = categories.length
            ? categories.map((cat) => ({
                name_income: `Contoh ${cat.name_category}`,
                amount_income: 100000,
                category_id: cat.id,
                date_income: "2025-01-01",
                kategori: cat.name_category,
            }))
            : [
                {
                    name_income: "Klaim BPJS Januari",
                    amount_income: 72000000,
                    category_id: 1,
                    date_income: "2025-01-01",
                    kategori: "Klaim BPJS",
                },
            ]

        const worksheet = XLSX.utils.json_to_sheet(exampleRows)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, "Template Income")
        XLSX.writeFile(workbook, "template_income.xlsx")

        setAlert({
            open: true,
            message: "📥 Template Excel berhasil diunduh (sinkron kategori DB)!",
            severity: "success",
        })
    }

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
                        INPUT INCOME
                    </h1>
                </div>
                <div>
                    <h1 className="text-6xl font-serif font-extrabold text-[#2C3E50] tracking-wide">
                        RS BHAYANGKARA M HASAN PALEMBANG
                    </h1>
                </div>
                <div className="w-36 h-[4px] bg-gradient-to-r from-[#2C3E50] to-[#FFD700] mx-auto mt-5 rounded-full"></div>
            </motion.div>

            {/* === TABS === */}
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
                    <Tab icon={<MonetizationOn />} label="Input Income" sx={{ fontSize: "1.3rem", fontWeight: "bold" }} />
                    <Tab icon={<Category />} label="Input Kategori" sx={{ fontSize: "1.3rem", fontWeight: "bold" }} />
                    <Tab icon={<UploadFile />} label="Import Excel" sx={{ fontSize: "1.3rem", fontWeight: "bold" }} />
                </Tabs>
            </Box>

            {/* === TAB 1: INPUT INCOME === */}
            {tab === 0 && (
                <motion.div
                    key="income"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white/95 shadow-[0_10px_60px_rgba(0,0,0,0.15)] rounded-[35px] w-full max-w-3xl p-16"
                >
                    <form onSubmit={handleSubmitIncome} className="flex flex-col gap-8">
                        <TextField label="Nama Pemasukan" name="name_income" fullWidth value={form.name_income} onChange={handleChange} required />
                        <TextField
                            label="Jumlah (Rp)"
                            name="amount_income"
                            fullWidth
                            value={
                                form.amount_income
                                    ? "Rp " +
                                    new Intl.NumberFormat("id-ID", {
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                    }).format(Number(form.amount_income))
                                    : ""
                            }
                            onChange={(e) => {
                                // Hilangkan semua selain angka
                                const raw = e.target.value.replace(/[^0-9]/g, "")
                                setForm({ ...form, amount_income: raw })
                            }}
                            InputProps={{
                                inputMode: "numeric",
                                sx: { fontSize: "1.2rem", height: 70, pl: 1 },
                            }}
                            InputLabelProps={{
                                sx: { fontSize: "1.1rem" },
                            }}
                            required
                        />

                        <TextField select label="Kategori" name="category_id" fullWidth value={form.category_id} onChange={handleChange} required>
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
                        <TextField label="Tanggal" name="date_income" type="date" fullWidth value={form.date_income} onChange={handleChange} InputLabelProps={{ shrink: true }} required />
                        <Button type="submit" variant="contained" disabled={loading} sx={{ mt: 4, py: 2, fontSize: "1.2rem" }}>
                            {loading ? <CircularProgress size={28} sx={{ color: "#FFD700" }} /> : "Simpan Data Income"}
                        </Button>
                    </form>
                </motion.div>
            )}

            {/* === TAB 2: INPUT KATEGORI === */}
            {tab === 1 && (
                <motion.div key="category" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="bg-white/95 shadow-[0_10px_60px_rgba(0,0,0,0.15)] rounded-[35px] w-full max-w-3xl p-16">
                    <form onSubmit={handleSubmitCategory} className="flex flex-col gap-8 mb-8">
                        <TextField label="Nama Kategori Baru" fullWidth value={categoryName} onChange={(e) => setCategoryName(e.target.value)} required />
                        <Button type="submit" variant="contained" disabled={loading}>
                            {loading ? <CircularProgress size={28} sx={{ color: "#FFD700" }} /> : "Simpan Kategori"}
                        </Button>
                    </form>
                    <Divider sx={{ mb: 3 }} />
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-3xl font-serif font-bold text-[#2C3E50] flex items-center gap-2">
                            <InfoOutlined sx={{ fontSize: 40 }} /> Daftar Kategori Saat Ini
                        </h2>
                        <Button onClick={getCategories} startIcon={<Refresh />} variant="outlined">Refresh</Button>
                    </div>
                    <ul className="list-disc ml-6 text-xl text-[#3b4650] leading-relaxed">
                        {categories.length > 0 ? categories.map((cat) => <li key={cat.id}><b>{cat.name_category}</b></li>) : <p>Belum ada kategori.</p>}
                    </ul>
                </motion.div>
            )}

            {/* === TAB 3: IMPORT EXCEL === */}
            {tab === 2 && (
                <motion.div key="excel" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="bg-white/95 shadow-[0_10px_60px_rgba(0,0,0,0.15)] rounded-[35px] w-full max-w-5xl p-16 text-center">
                    <CloudUpload sx={{ fontSize: 80, color: "#2C3E50" }} />
                    <h2 className="text-4xl font-serif font-bold text-[#2C3E50] mt-4 mb-6">Upload File Excel</h2>

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
                                            <TableCell key={key} sx={{ fontWeight: "bold", background: "#2C3E50", color: "white" }}>{key}</TableCell>
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
                        {loading ? <CircularProgress size={30} sx={{ color: "#FFD700" }} /> : "Import Data Excel"}
                    </Button>
                </motion.div>
            )}

            {/* ALERT */}
            <Snackbar open={alert.open} autoHideDuration={3000} onClose={() => setAlert({ ...alert, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                <Alert severity={alert.severity} variant="filled" sx={{ fontSize: "1.1rem", borderRadius: "10px" }}>
                    {alert.message}
                </Alert>
            </Snackbar>
        </div>
    )
}
