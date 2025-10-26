"use client"

import { useState, useEffect, useMemo } from "react"
import axiosInstance from "@/lib/axiosInstance"
import {
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
} from "@mui/material"
import { styled } from "@mui/material/styles"
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

/* =========================
   CUSTOM TEXT FIELD (DARK)
   ========================= */
import TextField from "@mui/material/TextField"

const CustomTextField = styled(TextField)(({ theme }) => ({
    // Label
    "& .MuiInputLabel-root": {
        color: "rgba(236,236,236,0.7)",
        fontWeight: 500,
    },
    "& .MuiInputLabel-root.Mui-focused": {
        color: "#FFD700",
    },

    // Input base
    "& .MuiInputBase-root": {
        color: "#ECECEC",
        background: "rgba(255,255,255,0.03)",
        borderRadius: 12,
    },

    // Placeholder
    "& .MuiInputBase-input::placeholder": {
        color: "rgba(236,236,236,0.55)",
        opacity: 1,
    },

    // Outlined border
    "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "rgba(255,215,0,0.25)",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "#FFD700",
    },
    "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#FFD700",
        boxShadow: "0 0 0 2px rgba(255,215,0,0.2)",
    },

    // Select icon (dropdown arrow)
    "& .MuiSelect-icon": {
        color: "#FFD700",
    },

    // Helper text
    "& .MuiFormHelperText-root": {
        color: "rgba(236,236,236,0.8)",
    },
})) as typeof TextField

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
    const [selectedCompanyName, setSelectedCompanyName] = useState("")
    const [companySuggestions, setCompanySuggestions] = useState<Company[]>([])

    const [jenisUpload, setJenisUpload] = useState<"umum" | "obat">("umum")

    // ===== FORM SPENDING =====
    const [form, setForm] = useState({
        name_spending: "",
        amount_spending: "",
        category_id: "",
        date_spending: "",
        company_id: "",
    })

    // ===== CATEGORY =====
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

    // ===== MEDICINES =====
    const [medicines, setMedicines] = useState<MedicineRow[]>([
        { name_medicine: "", quantity: "", name_unit_id: "", price: "" },
    ])

    const totalObat = useMemo(
        () =>
            medicines.reduce((sum, r) => {
                const clean = String(r.price ?? "").replace(/[^0-9]/g, "")
                const val = clean ? Number(clean) : 0
                return sum + val
            }, 0),
        [medicines]
    )

    const [alert, setAlert] = useState({
        open: false,
        message: "",
        severity: "success" as "success" | "error" | "info",
    })

    const [uploading, setUploading] = useState(false)

    // ===== FETCHERS =====
    const getCategories = async () => {
        try {
            const res = await axiosInstance.get("/api/CategorySpending")
            setCategories(res.data)
        } catch (err) {
            console.error("Gagal mengambil kategori spending:", err)
            setAlert({ open: true, message: "Gagal memuat kategori.", severity: "error" })
        }
    }

    const [search, setSearch] = useState("")
    const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null)
    const getCompanies = async (searchText?: string) => {
        try {
            setCompanyLoading(true)
            const res = await axiosInstance.get("/api/CompanyMedicine", {
                params: { search: searchText ?? search },
            })
            setCompanies(res.data)
        } catch (err) {
            console.error("Gagal mengambil company medicine:", err)
            setAlert({ open: true, message: "Gagal memuat company medicine.", severity: "error" })
        } finally {
            setCompanyLoading(false)
        }
    }

    useEffect(() => {
        if (search.length < 3) {
            getCompanies("")
            return
        }
        if (typingTimeout) clearTimeout(typingTimeout)
        const timeout = setTimeout(() => {
            getCompanies(search)
        }, 400)
        setTypingTimeout(timeout)
        return () => clearTimeout(timeout)
    }, [search])

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

    const formatRupiah = (num: number) =>
        new Intl.NumberFormat("id-ID", { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num)

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

        const isObat = String(form.category_id) === String(OBAT_CATEGORY_ID)
        if (isObat) {
            if (!form.company_id) {
                setAlert({ open: true, message: "Untuk kategori obat, perusahaan wajib dipilih!", severity: "error" })
                return
            }
            const validRows = medicines.filter(
                (m) =>
                    m.name_medicine &&
                    Number(String(m.quantity || "0")) > 0 &&
                    Number(String(m.price || "0")) > 0 &&
                    m.name_unit_id
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
                    .filter(
                        (m) =>
                            m.name_medicine &&
                            Number(String(m.quantity || "0")) > 0 &&
                            Number(String(m.price || "0")) > 0 &&
                            m.name_unit_id
                    )
                    .map((m) => ({
                        name_medicine: m.name_medicine,
                        quantity: Number(m.quantity),
                        name_unit_id: Number(m.name_unit_id),
                        price_per_item: Number(String(m.price).replace(/[^0-9]/g, "")), // ✅ ubah ke price_per_item
                    }))
            }

            const res = await axiosInstance.post("/api/inputSpendingDetail", payload)
            if (res.status === 200) {
                setAlert({ open: true, message: "✅ Data spending berhasil disimpan!", severity: "success" })
                setForm({ name_spending: "", amount_spending: "", category_id: "", date_spending: "", company_id: "" })
                setMedicines([{ name_medicine: "", quantity: "", name_unit_id: "", price: "" }])
            }
        } catch (err: any) {
            console.error(err)
            setAlert({ open: true, message: err?.response?.data || "Gagal menyimpan data!", severity: "error" })
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
                setAlert({ open: true, message: "✅ Kategori spending baru berhasil disimpan!", severity: "success" })
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

    // ===== EXCEL =====
    const handleExcelSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0]
        if (!f) return
        setFile(f)

        const reader = new FileReader()
        reader.onload = (event: any) => {
            const workbook = XLSX.read(event.target.result, { type: "binary" })
            const sheet = workbook.SheetNames[0]
            const rawData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet])

            const requiredColsUmum = ["name_spending", "category_id", "date_spending", "amount_spending"]
            const requiredColsObat = [
                "name_spending",
                "category_id",
                "date_spending",
                "company_id",
                "name_medicine",
                "quantity",
                "unit_id",
                "price_per_item",
            ]
            const requiredCols = jenisUpload === "umum" ? requiredColsUmum : requiredColsObat

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

            const normalized = rawData.map((row: any) => {
                const base: any = {
                    name_spending: row.name_spending || "",
                    category_id: Number(row.category_id || 0),
                    date_spending: row.date_spending || "",
                }
                if (jenisUpload === "umum") {
                    base.amount_spending = row.amount_spending ? Number(row.amount_spending) : ""
                    return base
                } else {
                    base.company_id = row.company_id ? Number(row.company_id) : ""
                    base.name_medicine = row.name_medicine || ""
                    base.quantity = row.quantity ? Number(row.quantity) : ""
                    base.unit_id = row.unit_id ? Number(row.unit_id) : ""
                    base.price_per_item = row.price_per_item ? Number(row.price_per_item) : ""
                    return base
                }
            })

            setPreviewData(normalized)
        }
        reader.readAsBinaryString(f)
    }

    const handleUploadExcel = async () => {
        if (!file) return setAlert({ open: true, message: "📂 Pilih file Excel!", severity: "error" })

        try {
            setUploading(true)
            const formData = new FormData()
            formData.append("file", file)

            const url =
                jenisUpload === "umum" ? "/api/uploadSpendingExcelGeneral" : "/api/uploadSpendingExcelObat"

            const res = await axiosInstance.post(url, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })

            if (res.status === 200) {
                setAlert({
                    open: true,
                    message: res.data.message || "✅ Import Excel berhasil!",
                    severity: "success",
                })
                setFile(null)
                setPreviewData([])
                setTimeout(() => {
                    window.location.reload()
                }, 1200)
            }
        } catch (err: any) {
            console.error(err)
            setAlert({
                open: true,
                message: err?.response?.data || "❌ Gagal upload file! Pastikan format Excel sesuai.",
                severity: "error",
            })
        } finally {
            setUploading(false)
        }
    }

    const handleDownloadTemplate = () => {
        if (jenisUpload === "umum") {
            const rows = [
                {
                    name_spending: "Belanja Operasional",
                    category_id: 4,
                    date_spending: "2025-01-10",
                    amount_spending: 50000000,
                },
            ]
            const ws = XLSX.utils.json_to_sheet(rows)
            const wb = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(wb, ws, "spending_umum")
            XLSX.writeFile(wb, "template_spending_umum.xlsx")
            setAlert({ open: true, message: "📥 Template Spending Umum diunduh!", severity: "success" })
        } else {
            const rows = [
                {
                    name_spending: "Belanja Obat Januari",
                    category_id: 9,
                    date_spending: "2025-01-01",
                    company_id: 1,
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
                    name_medicine: "Asam Mefenamat",
                    quantity: 150,
                    unit_id: 2,
                    price_per_item: 3000,
                },
            ]
            const ws = XLSX.utils.json_to_sheet(rows)
            const wb = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(wb, ws, "spending_obat")
            XLSX.writeFile(wb, "template_spending_obat.xlsx")
            setAlert({ open: true, message: "📥 Template Spending Obat diunduh!", severity: "success" })
        }
    }

    const isObat = String(form.category_id) === String(OBAT_CATEGORY_ID)

    return (
        <main className="min-h-screen font-serif text-[#ECECEC] px-6 md:px-20 py-24 bg-gradient-to-b from-[#0f141a]/70 via-[#1c2430]/80 to-[#12171d]/90 backdrop-blur-xl">
            {/* HEADER */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-12 md:mb-16"
            >
                <h1 className="text-4xl md:text-6xl font-extrabold text-[#FFD700] drop-shadow-[0_2px_10px_rgba(255,215,0,0.2)]">
                    INPUT PENGELUARAN RUMAH SAKIT
                </h1>
                <p className="text-gray-300 mt-3 text-base md:text-lg max-w-3xl mx-auto">
                    Catat setiap pengeluaran dengan transparan dan akurat, termasuk obat & operasional.
                </p>
            </motion.div>

            {/* TABS */}
            <Box sx={{ width: "100%", maxWidth: "1100px", mb: 6, mx: "auto" }}>
                <Tabs
                    value={tab}
                    onChange={(_, v) => setTab(v)}
                    centered
                    TabIndicatorProps={{
                        style: {
                            background: "linear-gradient(90deg,#FFD700 0%,#B8860B 100%)",
                            height: "5px",
                            borderRadius: "5px",
                        },
                    }}
                >
                    <Tab icon={<MonetizationOn />} label="INPUT SPENDING" sx={{ color: "#FFD700", fontWeight: "bold" }} />
                    <Tab icon={<CategoryIcon />} label="INPUT KATEGORI" sx={{ color: "#FFD700", fontWeight: "bold" }} />
                    <Tab icon={<UploadFile />} label="IMPORT EXCEL" sx={{ color: "#FFD700", fontWeight: "bold" }} />
                    <Tab icon={<Business />} label="COMPANY MEDICINE" sx={{ color: "#FFD700", fontWeight: "bold" }} />
                </Tabs>
            </Box>

            {/* TAB 1: INPUT SPENDING */}
            {tab === 0 && (
                <motion.div
                    key="spending"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-3xl mx-auto bg-white/10 backdrop-blur-2xl border border-[#FFD700]/20 rounded-3xl p-8 md:p-10 shadow-[0_0_30px_rgba(255,215,0,0.1)]"
                >
                    <form onSubmit={handleSubmitSpending} className="flex flex-col gap-8">
                        <CustomTextField
                            label="Nama Pengeluaran"
                            name="name_spending"
                            fullWidth
                            value={form.name_spending}
                            onChange={handleChange}
                            required
                        />

                        {/* Jumlah (Rp) */}
                        <CustomTextField
                            label="Jumlah (Rp)"
                            name="amount_spending"
                            fullWidth
                            value={
                                isObat
                                    ? totalObat ? `Rp ${formatRupiah(totalObat)}` : ""
                                    : form.amount_spending
                                        ? "Rp " +
                                        new Intl.NumberFormat("id-ID", {
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0,
                                        }).format(Number(form.amount_spending))
                                        : ""
                            }
                            onChange={(e) => {
                                if (isObat) return
                                const raw = e.target.value.replace(/[^0-9]/g, "")
                                setForm({ ...form, amount_spending: raw })
                            }}
                            InputProps={{
                                inputMode: "numeric",
                                readOnly: isObat,
                                sx: { fontSize: "1.1rem", height: 64, pl: 1, bgcolor: isObat ? "rgba(255,215,0,0.06)" : "inherit" },
                            }}
                            InputLabelProps={{ sx: { fontSize: "1.05rem" } }}
                            required={!isObat}
                        />

                        <CustomTextField
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
                        </CustomTextField>

                        {/* Kategori OBAT */}
                        {isObat && (
                            <>
                                <div className="relative">
                                    <CustomTextField
                                        label="Perusahaan (min 3 huruf)"
                                        name="company_name"
                                        fullWidth
                                        value={selectedCompanyName}
                                        onChange={(e) => {
                                            const val = e.target.value
                                            setSelectedCompanyName(val)
                                            setForm({ ...form, company_id: "" })

                                            if (!val.trim() || val.trim().length < 3) {
                                                setCompanySuggestions([])
                                                return
                                            }

                                            if (typingTimeout) clearTimeout(typingTimeout)
                                            const timeout = setTimeout(async () => {
                                                try {
                                                    const res = await axiosInstance.get("/api/CompanyMedicine", {
                                                        params: { search: val.trim() },
                                                    })
                                                    setCompanySuggestions(res.data.slice(0, 8))
                                                } catch (err) {
                                                    console.error("Gagal mencari perusahaan:", err)
                                                }
                                            }, 400)
                                            setTypingTimeout(timeout)
                                        }}
                                        required
                                        InputProps={{ sx: { fontSize: "1.05rem", height: 64 } }}
                                        InputLabelProps={{ sx: { fontSize: "1.05rem" } }}
                                        helperText={
                                            form.company_id
                                                ? `Terpilih: ${selectedCompanyName} (ID: ${form.company_id})`
                                                : "Ketik minimal 3 huruf nama perusahaan"
                                        }
                                    />

                                    {/* Dropdown hasil pencarian (dark) */}
                                    {companySuggestions.length > 0 && (
                                        <div className="absolute z-10 bg-[#0f141a] border border-[#FFD700]/30 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.35)] mt-1 w-full max-h-56 overflow-auto">
                                            {companySuggestions.map((c) => (
                                                <div
                                                    key={c.id}
                                                    onClick={() => {
                                                        setSelectedCompanyName(c.name_company)
                                                        setForm({ ...form, company_id: String(c.id) })
                                                        setCompanySuggestions([])
                                                    }}
                                                    className="px-4 py-2 hover:bg-white/10 cursor-pointer text-sm text-[#ECECEC]"
                                                >
                                                    <b className="text-[#FFD700]">{c.name_company}</b>{" "}
                                                    <span className="text-gray-400">({c.id})</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <Divider sx={{ my: 2, borderColor: "rgba(255,215,0,0.25)" }} />
                                <h2 className="text-2xl font-serif font-bold text-[#FFD700]">🧪 Detail Obat yang Dibeli</h2>
                                <p className="text-sm text-gray-300 mb-2">
                                    Harga per baris = total harga obat (bukan harga satuan). Total otomatis dijumlahkan.
                                </p>

                                {medicines.map((m, i) => (
                                    <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                                        <div className="md:col-span-5">
                                            <CustomTextField
                                                label={`Nama Obat #${i + 1}`}
                                                value={m.name_medicine}
                                                onChange={(e) => handleMedicineChange(i, "name_medicine", e.target.value)}
                                                fullWidth
                                                required
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <CustomTextField
                                                label="Qty"
                                                type="number"
                                                value={m.quantity}
                                                onChange={(e) => handleMedicineChange(i, "quantity", e.target.value)}
                                                fullWidth
                                                required
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <CustomTextField
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
                                            </CustomTextField>
                                        </div>
                                        <div className="md:col-span-2">
                                            <CustomTextField
                                                label="Harga (Rp)"
                                                value={m.price ? `Rp ${formatRupiah(Number(String(m.price).replace(/[^0-9]/g, "")))}` : ""}
                                                onChange={(e) => handleMedicineChange(i, "price", e.target.value)}
                                                fullWidth
                                                InputProps={{ inputMode: "numeric" }}
                                                required
                                            />
                                        </div>
                                        <div className="md:col-span-1">
                                            <Button color="error" variant="outlined" onClick={() => handleRemoveMedicine(i)} disabled={medicines.length === 1}>
                                                Hapus
                                            </Button>
                                        </div>
                                    </div>
                                ))}

                                <div className="flex items-center gap-3 mt-2">
                                    <Button variant="outlined" onClick={handleAddMedicine} sx={{ borderColor: "#FFD700", color: "#FFD700" }}>
                                        ➕ Tambah Obat
                                    </Button>
                                    <div className="ml-auto text-right">
                                        <div className="text-sm text-gray-300">Total Obat</div>
                                        <div className="text-2xl font-bold text-[#FFD700]">Rp {formatRupiah(totalObat)}</div>
                                    </div>
                                </div>
                            </>
                        )}

                        <CustomTextField
                            label="Tanggal"
                            name="date_spending"
                            type="date"
                            fullWidth
                            value={form.date_spending}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                            required
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            disabled={loading}
                            sx={{ bgcolor: "#FFD700", color: "#12171d", fontWeight: "bold", py: 1.5, fontSize: "1.05rem" }}
                        >
                            {loading ? <CircularProgress size={24} sx={{ color: "#12171d" }} /> : "Simpan Data Spending"}
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
                    className="w-full max-w-3xl mx-auto bg-white/10 backdrop-blur-2xl border border-[#FFD700]/20 rounded-3xl p-8 md:p-10 shadow-[0_0_30px_rgba(255,215,0,0.1)]"
                >
                    <form onSubmit={handleSubmitCategory} className="flex flex-col gap-8 mb-8">
                        <CustomTextField
                            label="Nama Kategori Baru (Spending)"
                            fullWidth
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            required
                        />
                        <Button type="submit" variant="contained" disabled={loading} sx={{ bgcolor: "#FFD700", color: "#12171d", fontWeight: "bold" }}>
                            {loading ? <CircularProgress size={22} sx={{ color: "#12171d" }} /> : "Simpan Kategori"}
                        </Button>
                    </form>

                    <Divider sx={{ mb: 3, borderColor: "rgba(255,215,0,0.25)" }} />
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#FFD700] flex items-center gap-2">
                            <InfoOutlined /> Daftar Kategori Spending
                        </h2>
                        <Button onClick={getCategories} startIcon={<Refresh />} variant="outlined" sx={{ borderColor: "#FFD700", color: "#FFD700" }}>
                            Refresh
                        </Button>
                    </div>

                    <ul className="list-disc ml-6 text-lg md:text-xl text-yellow-100/90 leading-relaxed">
                        {categories.length > 0 ? categories.map((cat) => <li key={cat.id}><b>{cat.name_category}</b></li>) : <p className="text-gray-300">Belum ada kategori.</p>}
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
                    className="w-full max-w-5xl mx-auto bg-white/10 backdrop-blur-2xl border border-[#FFD700]/20 rounded-3xl p-8 md:p-10 shadow-[0_0_30px_rgba(255,215,0,0.1)] text-center"
                >
                    <CloudUpload sx={{ fontSize: 80, color: "#FFD700" }} />
                    <h2 className="text-3xl font-serif font-bold text-[#FFD700] mt-3 mb-6">Upload File Excel Spending</h2>

                    {/* Jenis upload */}
                    <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-6">
                        <div className="md:col-span-1 text-left md:text-right pr-0 md:pr-4 font-semibold text-[#FFD700]">Jenis Upload</div>
                        <div className="md:col-span-2">
                            <CustomTextField select fullWidth value={jenisUpload} onChange={(e) => setJenisUpload(e.target.value as "umum" | "obat")}>
                                <MenuItem value="umum">Spending Umum (tanpa obat)</MenuItem>
                                <MenuItem value="obat">Spending Obat (kategori 9)</MenuItem>
                            </CustomTextField>
                        </div>
                    </div>

                    <div className="flex justify-center gap-4 mb-8 flex-wrap">
                        <Button component="label" variant="outlined" startIcon={<InsertDriveFile />} sx={{ borderColor: "#FFD700", color: "#FFD700", fontWeight: "bold" }}>
                            Pilih File Excel
                            <input hidden type="file" accept=".xlsx,.xls" onChange={handleExcelSelect} />
                        </Button>
                        <Button onClick={handleDownloadTemplate} variant="outlined" startIcon={<Download />} sx={{ borderColor: "#FFD700", color: "#FFD700", fontWeight: "bold" }}>
                            Download Template {jenisUpload === "umum" ? "Umum" : "Obat"}
                        </Button>
                    </div>

                    {file && <p className="text-yellow-100/90 mb-4">📂 {file.name}</p>}

                    {previewData.length > 0 && (
                        <Paper sx={{ maxHeight: 420, overflow: "auto", mb: 4, background: "transparent", borderRadius: "16px" }}>
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
                                    {previewData.map((r, i) => (
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

                    <Button
                        onClick={handleUploadExcel}
                        variant="contained"
                        disabled={previewData.length === 0 || uploading}
                        sx={{ bgcolor: "#FFD700", color: "#12171d", fontWeight: "bold" }}
                    >
                        {uploading ? <CircularProgress size={26} sx={{ color: "#12171d" }} /> : "Import Data Excel Spending"}
                    </Button>
                </motion.div>
            )}

            {/* TAB 4: COMPANY MEDICINE */}
            {tab === 3 && (
                <motion.div
                    key="company"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-5xl mx-auto bg-white/10 backdrop-blur-2xl border border-[#FFD700]/20 rounded-3xl p-8 md:p-10 shadow-[0_0_30px_rgba(255,215,0,0.1)]"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-serif font-bold text-[#FFD700] flex items-center gap-2">
                            <Business /> Input & Daftar Company Medicine
                        </h2>
                    </div>

                    {/* Form input company */}
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
                        <CustomTextField
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
                            sx={{ bgcolor: "#FFD700", color: "#12171d", fontWeight: "bold", px: 6 }}
                        >
                            {companyLoading ? <CircularProgress size={22} sx={{ color: "#12171d" }} /> : "Simpan"}
                        </Button>
                    </form>

                    {/* Search */}
                    <div className="flex justify-end mb-4">
                        <CustomTextField size="small" placeholder="Cari perusahaan..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>

                    {/* Tabel */}
                    <Paper sx={{ width: "100%", overflow: "hidden", background: "transparent", borderRadius: "16px" }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: "bold", background: "#FFD700", color: "#12171d" }}>No</TableCell>
                                    <TableCell sx={{ fontWeight: "bold", background: "#FFD700", color: "#12171d" }}>Nama Perusahaan</TableCell>
                                    <TableCell sx={{ fontWeight: "bold", background: "#FFD700", color: "#12171d" }}>Created At</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {companyLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={3}>
                                            <div className="w-full flex justify-center py-6"><CircularProgress sx={{ color: "#FFD700" }} /></div>
                                        </TableCell>
                                    </TableRow>
                                ) : pagedCompanies.length > 0 ? (
                                    pagedCompanies.map((c) => (
                                        <TableRow key={c.id} sx={{ "& td": { color: "#ECECEC" } }}>
                                            <TableCell>{c.id}</TableCell>
                                            <TableCell>{c.name_company}</TableCell>
                                            <TableCell>{new Date(c.created_at).toLocaleString("id-ID")}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} sx={{ color: "#ECECEC" }}>Belum ada data company.</TableCell>
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
                            showFirstButton
                            showLastButton
                            sx={{
                                "& .MuiPaginationItem-root": { color: "#FFD700" },
                                "& .MuiPaginationItem-root.Mui-selected": {
                                    backgroundColor: "#FFD700",
                                    color: "#12171d",
                                },
                                "& .MuiPaginationItem-root:hover": { backgroundColor: "rgba(255,215,0,0.12)" },
                            }}
                        />
                    </div>
                </motion.div>
            )}

            {/* OVERLAY LOADING */}
            {uploading && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-md">
                    <div className="flex flex-col items-center gap-4 rounded-2xl px-8 py-6 bg-[#12171d]/80 border border-[#FFD700]/30 shadow-[0_0_20px_rgba(255,215,0,0.2)]">
                        <CircularProgress size={44} sx={{ color: "#FFD700" }} />
                        <p className="text-lg text-[#FFD700]">Mengimpor data Excel…</p>
                        <p className="text-sm text-gray-400">Tunggu sebentar ya</p>
                    </div>
                </div>
            )}

            {/* ALERT */}
            <Snackbar
                open={alert.open}
                autoHideDuration={3000}
                onClose={() => setAlert({ ...alert, open: false })}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert severity={alert.severity} variant="filled" sx={{ fontSize: "1rem", borderRadius: "10px" }}>
                    {alert.message}
                </Alert>
            </Snackbar>
        </main>
    )
}
