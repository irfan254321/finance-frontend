"use client"

import Footer from "../../../../../components/footer"
import { useEffect, useMemo, useState } from "react"
import axiosInstance from "@/lib/axiosInstance"
import { useParams } from "next/navigation"
import { PieChart } from "@mui/x-charts"
import Slide from "@mui/material/Slide"
import { forwardRef } from "react"


import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Divider,
    CircularProgress,
    Card,
    Button,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"

type Income = {
    id: number
    name_income: string
    amount_income: number
    category_id: number
    date_income: string
}

type Spending = {
    id: number
    name_spending: string
    amount_spending: number
    category_id: number
    date_spending: string
}

type Medicine = {
    medicine_id: number
    name_medicine: string
    quantity: number
    name_unit?: string
    created_at: string
}

// 🪄 Animasi Fade + Zoom
const Transition = forwardRef(function Transition(props: any, ref) {
    return <Slide direction="up" ref={ref} {...props} timeout={500} />
})

const INCOME_LABEL: Record<number, string> = {
    1: "Klaim BPJS",
    2: "Pasien Umum",
    3: "Bunga Deposito",
    4: "Kerja Sama & Sewa",
}

const SPENDING_LABEL: Record<number, string> = {
    4: "Operasional",
    5: "Pemeliharaan",
    6: "Pendukung",
    7: "Honor Pegawai",
    8: "Jasa Medis",
    9: "Obat",
    10: "Peralatan & Mesin",
}

const MONTHS_ID = Array.from({ length: 12 }, (_, i) => i + 1)
const MONTHS_LABEL = MONTHS_ID.map((m) =>
    new Date(2024, m - 1).toLocaleString("id-ID", { month: "long" })
)

const formatRp = (n: number) =>
    "Rp " + (n || 0).toLocaleString("id-ID", { maximumFractionDigits: 0 })

export default function FinanceMonthly() {
    const params = useParams()
    const year = params.year as string

    const [incomeRaw, setIncomeRaw] = useState<Income[]>([])
    const [spendingRaw, setSpendingRaw] = useState<Spending[]>([])

    // 🆕 Zoom bulan: null = semua bulan, number = fokus ke bulan tsb (1-12)
    const [openMonthDialog, setOpenMonthDialog] = useState(false)
    const [selectedMonth, setSelectedMonth] = useState<number | null>(null)


    // ============== FETCH DATA ==============
    useEffect(() => {
        if (!year) return
        axiosInstance.get<Income[]>(`/api/income/${year}`).then((res) => setIncomeRaw(res.data))
        axiosInstance.get<Spending[]>(`/api/spending/${year}`).then((res) => setSpendingRaw(res.data))
    }, [year])

    // ============== BUILD MONTHLY DATASETS ==============
    /**
     * Struktur hasil:
     * {
     *   [monthNum]: {
     *     income: { byCat: { [catId]: total }, total: number, pie: Array<{id, value, label, catId}> },
     *     spending: { byCat: { [catId]: total }, total: number, pie: Array<{id, value, label, catId}> },
     *     surplus: number
     *   }
     * }
     */
    const monthly = useMemo(() => {
        const result: Record<
            number,
            {
                income: { byCat: Record<number, number>; total: number; pie: any[] }
                spending: { byCat: Record<number, number>; total: number; pie: any[] }
                surplus: number
            }
        > = {}

        // init
        MONTHS_ID.forEach((m) => {
            result[m] = {
                income: { byCat: {}, total: 0, pie: [] },
                spending: { byCat: {}, total: 0, pie: [] },
                surplus: 0,
            }
        })

        // income
        for (const d of incomeRaw) {
            const m = new Date(d.date_income).getMonth() + 1
            if (!result[m]) continue
            result[m].income.byCat[d.category_id] = (result[m].income.byCat[d.category_id] || 0) + d.amount_income
            result[m].income.total += d.amount_income
        }

        // spending
        for (const d of spendingRaw) {
            const m = new Date(d.date_spending).getMonth() + 1
            if (!result[m]) continue
            result[m].spending.byCat[d.category_id] = (result[m].spending.byCat[d.category_id] || 0) + d.amount_spending
            result[m].spending.total += d.amount_spending
        }

        // build pie + surplus
        MONTHS_ID.forEach((m) => {
            const incPie = Object.entries(result[m].income.byCat)
                .filter(([cat]) => INCOME_LABEL[Number(cat)])
                .map(([cat, val], idx) => ({
                    id: idx,
                    value: val,
                    label: INCOME_LABEL[Number(cat)],
                    catId: Number(cat),
                }))

            const spPie = Object.entries(result[m].spending.byCat)
                .filter(([cat]) => SPENDING_LABEL[Number(cat)])
                .map(([cat, val], idx) => ({
                    id: idx,
                    value: val,
                    label: SPENDING_LABEL[Number(cat)],
                    catId: Number(cat),
                }))

            result[m].income.pie = incPie
            result[m].spending.pie = spPie
            result[m].surplus = result[m].income.total - result[m].spending.total
        })

        return result
    }, [incomeRaw, spendingRaw])

    // ============== DIALOG STATES ==============
    const [openDetail, setOpenDetail] = useState(false)
    const [detailTitle, setDetailTitle] = useState<string>("")
    const [detailList, setDetailList] = useState<any[]>([])
    const [detailType, setDetailType] = useState<"income" | "spending" | null>(null)

    // pagination 👇👇👇
    const [page, setPage] = useState(1)
    const rowsPerPage = 7
    const paginatedList = useMemo(() => {
        const start = (page - 1) * rowsPerPage
        const end = start + rowsPerPage
        return detailList.slice(start, end)
    }, [detailList, page])
    const totalPages = Math.ceil(detailList.length / rowsPerPage)

    // Drilldown obat
    const [openMedicine, setOpenMedicine] = useState(false)
    const [medicineList, setMedicineList] = useState<Medicine[]>([])
    const [loadingMedicine, setLoadingMedicine] = useState(false)
    const [selectedSpendingItem, setSelectedSpendingItem] = useState<Spending | null>(null)

    // ============== HANDLERS ==============
    const openDialogForMonthAll = (monthIndex: number, type: "income" | "spending") => {
        if (type === "income") {
            const list = incomeRaw.filter(
                (d) => new Date(d.date_income).getMonth() + 1 === monthIndex + 1
            )
            setDetailList(list.sort((a, b) => +new Date(a.date_income) - +new Date(b.date_income)))
            setDetailTitle(`Detail Pendapatan — ${MONTHS_LABEL[monthIndex]}`)
            setDetailType("income")
            setOpenDetail(true)
            setPage(1)
        } else {
            const list = spendingRaw.filter(
                (d) => new Date(d.date_spending).getMonth() + 1 === monthIndex + 1
            )
            setDetailList(list.sort((a, b) => +new Date(a.date_spending) - +new Date(b.date_spending)))
            setDetailTitle(`Detail Pengeluaran — ${MONTHS_LABEL[monthIndex]}`)
            setDetailType("spending")
            setOpenDetail(true)
            setPage(1)
        }
    }

    const handleSliceClick = (type: "income" | "spending", monthIndex: number, item: any) => {
        const dataIndex = item.dataIndex as number
        if (type === "income") {
            const ds = monthly[monthIndex + 1]?.income.pie || []
            const picked = ds[dataIndex]
            const catId = picked?.catId as number
            const list = incomeRaw.filter((d) => {
                const m = new Date(d.date_income).getMonth() + 1
                return m === monthIndex + 1 && d.category_id === catId
            })
            setDetailList(list)
            setDetailTitle(`Pendapatan: ${picked?.label} — ${MONTHS_LABEL[monthIndex]}`)
            setDetailType("income")
            setOpenDetail(true)
            setPage(1)
        } else {
            const ds = monthly[monthIndex + 1]?.spending.pie || []
            const picked = ds[dataIndex]
            const catId = picked?.catId as number
            const list = spendingRaw.filter((d) => {
                const m = new Date(d.date_spending).getMonth() + 1
                return m === monthIndex + 1 && d.category_id === catId
            })
            setDetailList(list)
            setDetailTitle(`Pengeluaran: ${picked?.label} — ${MONTHS_LABEL[monthIndex]}`)
            setDetailType("spending")
            setOpenDetail(true)
            setPage(1)
        }
    }

    const handleClickSpendingObat = async (sp: Spending) => {
        try {
            setLoadingMedicine(true)
            setSelectedSpendingItem(sp)
            const res = await axiosInstance.post("/api/spendingMedicineBySpendingId", {
                detail_spending_id: sp.id,
            })
            setMedicineList(res.data)
            setOpenMedicine(true)
        } catch (err) {
            console.error(err)
            alert("Gagal memuat detail obat!")
        } finally {
            setLoadingMedicine(false)
        }
    }

    // ============== RENDER ==============
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1a2732] via-[#2C3E50] to-[#1a2732] text-white mt-10">
            <main className="max-w-[1700px] mx-auto px-6 pt-28 pb-16">
                <h1 className="text-4xl font-bold text-[#F4E1C1] text-center mb-10 drop-shadow-md">
                    <span className="text-yellow-400">Ringkasan Keuangan Per Bulan</span>
                    <br /> Rumah Sakit Bhayangkara M. Hasan Palembang {year}
                </h1>

                {/* === LOOP PER BULAN === */}
                <div className="flex flex-col gap-10">
                    {MONTHS_ID
                        .map((m, idx) => {
                            const inc = monthly[m]?.income
                            const sp = monthly[m]?.spending
                            const hasAny = (inc?.total || 0) > 0 || (sp?.total || 0) > 0
                            if (!hasAny) return null
                            const surplus = monthly[m].surplus

                            return (
                                <Card
                                    key={m}
                                    sx={{
                                        background: "rgba(43,59,75,0.9)",
                                        border: "1px solid rgba(255,215,0,0.2)",
                                        borderRadius: "20px",
                                        padding: "1.5rem",
                                    }}
                                >
                                    <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                                        <h2
                                            className="text-2xl font-bold text-[#FFD700] cursor-pointer hover:underline uppercase"
                                            onClick={() => {
                                                setSelectedMonth(m)      // simpan bulan yang dipilih
                                                setOpenMonthDialog(true) // buka popup
                                            }}
                                        >
                                            {MONTHS_LABEL[m - 1]}
                                        </h2>
                                        <div className="text-right">
                                            <p className="text-[#F4E1C1]">💰 Pendapatan: <b>{formatRp(inc?.total || 0)}</b></p>
                                            <p className="text-[#F4E1C1]">💸 Pengeluaran: <b>{formatRp(sp?.total || 0)}</b></p>
                                            <p className={`text-lg font-bold ${surplus >= 0 ? "text-green-400" : "text-red-400"}`}>
                                                {surplus >= 0 ? `📈 Surplus: ${formatRp(surplus)}` : `📉 Defisit: ${formatRp(Math.abs(surplus))}`}
                                            </p>
                                        </div>
                                    </div>

                                    <Divider sx={{ borderColor: "rgba(255,215,0,0.2)", mb: 3 }} />

                                    <div className={`grid ${selectedMonth ? "grid-cols-1 md:grid-cols-2 gap-12" : "grid-cols-1 md:grid-cols-2 gap-8"}`}>
                                        {/* Pendapatan Pie */}
                                        <div className="flex flex-col items-center">
                                            <h3 className="text-xl mb-2 text-[#F4E1C1] mr-28">{selectedMonth ? "Pendapatan" : "Pendapatan"}</h3>
                                            {inc?.pie?.length ? (
                                                <PieChart
                                                    series={[{ data: inc.pie, innerRadius: 60, outerRadius: selectedMonth ? 180 : 120 }]}
                                                    width={selectedMonth ? 680 : 520}
                                                    height={selectedMonth ? 460 : 360}
                                                    onItemClick={(_, item) => handleSliceClick("income", m - 1, item)}
                                                    sx={{
                                                        "& .MuiChartsLegend-root": {
                                                            marginTop: "30px",
                                                        },
                                                        "& .MuiChartsLegend-label": {
                                                            fill: "#F4E1C1",
                                                            fontSize: "20px",
                                                            color: "#FFD700",
                                                            fontWeight: 600,
                                                            textShadow: "0 1px 3px rgba(0,0,0,0.6)",
                                                        },
                                                        "& .MuiChartsLegend-mark": {
                                                            width: "18px",
                                                            height: "18px",
                                                            borderRadius: "4px",
                                                            transform: "translateY(2px)",
                                                        },
                                                    }}
                                                />
                                            ) : <p className="text-gray-400">Tidak ada data.</p>}
                                            <Button
                                                variant="contained"
                                                onClick={() => openDialogForMonthAll(m - 1, "income")}
                                                sx={{
                                                    mt: 1, background: "#FFD700", color: "#1a2732",
                                                    fontWeight: 700, borderRadius: "10px", px: 3,
                                                    "&:hover": { background: "#E6BE00" },
                                                }}
                                            >
                                                🔍 Lihat semua pendapatan bulan ini
                                            </Button>
                                        </div>

                                        {/* Pengeluaran Pie */}
                                        <div className="flex flex-col items-center">
                                            <h3 className="text-xl mb-2 text-[#F4E1C1] mr-36">{selectedMonth ? "Pengeluaran" : "Pengeluaran"}</h3>
                                            {sp?.pie?.length ? (
                                                <PieChart
                                                    series={[{ data: sp.pie, innerRadius: 60, outerRadius: selectedMonth ? 180 : 120 }]}
                                                    width={selectedMonth ? 680 : 520}
                                                    height={selectedMonth ? 460 : 360}
                                                    onItemClick={(_, item) => handleSliceClick("spending", m - 1, item)}
                                                    sx={{
                                                        "& .MuiChartsLegend-root": {
                                                            marginTop: "30px",
                                                        },
                                                        "& .MuiChartsLegend-label": {
                                                            fill: "#F4E1C1",
                                                            fontSize: "20px",
                                                            color: "#FFD700",
                                                            fontWeight: "600",
                                                            textShadow: "0 1px 3px rgba(0,0,0,0.6)",
                                                        },
                                                        "& .MuiChartsLegend-mark": {
                                                            width: "18px",
                                                            height: "18px",
                                                            borderRadius: "4px",
                                                            transform: "translateY(2px)",
                                                        },
                                                    }}
                                                />
                                            ) : <p className="text-gray-400">Tidak ada data.</p>}
                                            <Button
                                                variant="contained"
                                                onClick={() => openDialogForMonthAll(m - 1, "spending")}
                                                sx={{
                                                    mt: 1, background: "#FFD700", color: "#1a2732",
                                                    fontWeight: 700, borderRadius: "10px", px: 3,
                                                    "&:hover": { background: "#E6BE00" },
                                                }}
                                            >
                                                🔍 Lihat semua pengeluaran bulan ini
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            )
                        })}
                </div>
            </main>

            {/* ========== DIALOG BULAN (CHART BESAR) ========== */}
            <Dialog
                open={openMonthDialog}
                onClose={() => setOpenMonthDialog(false)}
                maxWidth={false}
                fullWidth
                TransitionComponent={Transition} // 🎬 animasi muncul
                BackdropProps={{
                    sx: {
                        backdropFilter: "blur(12px)",         // 🌫️ efek blur belakang
                        backgroundColor: "rgba(0, 0, 0, 0.5)", // 🔲 warna latar belakang (opsional)
                        transition: "backdrop-filter 0.4s ease", // halus saat muncul
                    },
                }}
                sx={{
                    "& .MuiDialog-paper": {
                        background: "rgba(25,30,40,0.98)",
                        borderRadius: "25px",
                        border: "1px solid rgba(255,215,0,0.3)",
                        padding: "20px",
                        color: "white",
                        margin: "5px auto",                       // ✅ jarak atas & bawah 5px
                        maxHeight: "calc(100vh - 10px)",          // ✅ tinggi responsif
                        overflowY: "auto",                        // ✅ scroll jika konten tinggi
                        boxShadow: "0 0 40px rgba(255,215,0,0.15)", // ✨ efek glow elegan
                        transition: "transform 0.3s ease, opacity 0.3s ease",
                    },
                }}
            >
                {selectedMonth && (
                    <>
                        <DialogTitle>
                            <div className="flex justify-between items-center">
                                <p className="font-bold text-3xl text-yellow-400 w-full text-center">
                                    {MONTHS_LABEL[selectedMonth - 1]} — {year}
                                </p>
                                <IconButton onClick={() => setOpenMonthDialog(false)}>
                                    <CloseIcon />
                                </IconButton>
                            </div>
                        </DialogTitle>
                        <Divider sx={{ borderColor: "rgba(255,215,0,0.2)", mb: 2 }} />

                        <DialogContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 justify-center">
                                {/* Pendapatan */}
                                <div className="flex flex-col items-center">
                                    <h3 className="text-xl mb-2 text-[#F4E1C1]">Pendapatan</h3>
                                    {monthly[selectedMonth]?.income.pie?.length ? (
                                        <PieChart
                                            series={[{
                                                data: monthly[selectedMonth].income.pie,
                                                innerRadius: 70,
                                                outerRadius: 220
                                            }]}
                                            sx={{
                                                "& .MuiChartsLegend-root": {
                                                    marginTop: "30px",
                                                },
                                                "& .MuiChartsLegend-label": {
                                                    fill: "#F4E1C1",
                                                    fontSize: "15px",
                                                    color: "#FFD700",
                                                    fontWeight: "600",
                                                    textShadow: "0 1px 3px rgba(0,0,0,0.6)",
                                                },
                                                "& .MuiChartsLegend-mark": {
                                                    width: "18px",
                                                    height: "18px",
                                                    borderRadius: "4px",
                                                    transform: "translateY(2px)",
                                                },
                                            }}
                                            width={700}
                                            height={500}
                                            onItemClick={(_, item) => handleSliceClick("income", selectedMonth - 1, item)}
                                        />
                                    ) : <p className="text-gray-400">Tidak ada data.</p>}
                                </div>

                                {/* Pengeluaran */}
                                <div className="flex flex-col items-center">
                                    <h3 className="text-xl mb-2 text-[#F4E1C1]">Pengeluaran</h3>
                                    {monthly[selectedMonth]?.spending.pie?.length ? (
                                        <PieChart
                                            series={[{
                                                data: monthly[selectedMonth].spending.pie,
                                                innerRadius: 70,
                                                outerRadius: 220
                                            }]}
                                            sx={{
                                                "& .MuiChartsLegend-root": {
                                                    marginTop: "30px",
                                                },
                                                "& .MuiChartsLegend-label": {
                                                    fill: "#F4E1C1",
                                                    fontSize: "20px",
                                                    color: "#FFD700",
                                                    fontWeight: "600",
                                                    textShadow: "0 1px 3px rgba(0,0,0,0.6)",
                                                },
                                                "& .MuiChartsLegend-mark": {
                                                    width: "18px",
                                                    height: "18px",
                                                    borderRadius: "4px",
                                                    transform: "translateY(2px)",
                                                },
                                            }}
                                            width={700}
                                            height={500}
                                            onItemClick={(_, item) => handleSliceClick("spending", selectedMonth - 1, item)}
                                        />
                                    ) : <p className="text-gray-400">Tidak ada data.</p>}
                                </div>
                            </div>
                        </DialogContent>
                    </>
                )}
            </Dialog>


            {/* ========== DIALOG DETAIL ========== */}
            <Dialog
                open={openDetail}
                onClose={() => setOpenDetail(false)}
                sx={{
                    "& .MuiDialog-paper": {
                        width: "900px",
                        maxWidth: "95vw",
                        borderRadius: "22px",
                        background: "rgba(25,30,40,0.95)",
                        border: "1px solid rgba(255,215,0,0.2)",
                        color: "white",

                    },
                }}
            >
                <DialogTitle>
                    <div className="flex justify-between items-center">
                        <p className="font-bold text-2xl text-yellow-400">{detailTitle}</p>
                        <IconButton onClick={() => setOpenDetail(false)}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                </DialogTitle>
                <Divider sx={{ borderColor: "rgba(255,215,0,0.2)" }} />
                <DialogContent className="px-8 py-6">
                    {detailList.length ? (
                        <>
                            <ul className="space-y-3">
                                {detailType === "income" &&
                                    paginatedList.map((d: Income) => (
                                        <li key={d.id} className="p-4 rounded-lg bg-[#2C3E50]/70 border border-[#F4E1C1]/10">
                                            <div className="flex justify-between">
                                                <div>
                                                    <p className="font-semibold text-[#FFD54F]">{d.name_income}</p>
                                                    <p className="text-gray-400 text-sm">
                                                        {new Date(d.date_income).toLocaleDateString("id-ID")}
                                                    </p>
                                                </div>
                                                <p className="text-[#F4E1C1] font-bold">{formatRp(d.amount_income)}</p>
                                            </div>
                                        </li>
                                    ))}

                                {detailType === "spending" &&
                                    paginatedList.map((d: Spending) => (
                                        <li
                                            key={d.id}
                                            className={`p-4 rounded-lg bg-[#2C3E50]/70 border border-[#F4E1C1]/10 ${d.category_id === 9 ? "hover:ring-2 hover:ring-[#FFD700] cursor-pointer" : ""
                                                }`}
                                            onClick={() => {
                                                if (d.category_id === 9) handleClickSpendingObat(d)
                                            }}
                                            title={d.category_id === 9 ? "Klik untuk lihat detail obat" : undefined}
                                        >
                                            <div className="flex justify-between">
                                                <div>
                                                    <p className="font-semibold text-[#FFD54F]">{d.name_spending}</p>
                                                    <p className="text-gray-400 text-sm">
                                                        {new Date(d.date_spending).toLocaleDateString("id-ID")}
                                                    </p>
                                                </div>
                                                <p className="text-[#F4E1C1] font-bold">{formatRp(d.amount_spending)}</p>
                                            </div>
                                            {d.category_id === 9 && (
                                                <p className="text-xs text-[#FFD700] mt-1">
                                                    💊 Transaksi obat — klik untuk lihat rinciannya
                                                </p>
                                            )}
                                        </li>
                                    ))}
                            </ul>

                            {/* PAGINATION BUTTONS 👇👇👇 */}
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center gap-3 mt-6">
                                    <Button
                                        variant="outlined"
                                        disabled={page === 1}
                                        onClick={() => setPage((p) => p - 1)}
                                        sx={{
                                            borderColor: "#FFD700",
                                            color: "#FFD700",
                                            "&:hover": { borderColor: "#E6BE00", background: "rgba(255,215,0,0.1)" },
                                        }}
                                    >
                                        ◀ Prev
                                    </Button>

                                    <span className="text-[#F4E1C1]">
                                        Halaman {page} dari {totalPages}
                                    </span>

                                    <Button
                                        variant="outlined"
                                        disabled={page === totalPages}
                                        onClick={() => setPage((p) => p + 1)}
                                        sx={{
                                            borderColor: "#FFD700",
                                            color: "#FFD700",
                                            "&:hover": { borderColor: "#E6BE00", background: "rgba(255,215,0,0.1)" },
                                        }}
                                    >
                                        Next ▶
                                    </Button>
                                </div>
                            )}
                        </>
                    ) : (
                        <p className="text-gray-400 text-center py-10">🚫 Tidak ada data.</p>
                    )}
                </DialogContent>
            </Dialog>

            {/* ========== DIALOG DETAIL OBAT ========== */}
            <Dialog
                open={openMedicine}
                onClose={() => setOpenMedicine(false)}
                sx={{
                    "& .MuiDialog-paper": {
                        width: "800px",
                        maxWidth: "95vw",
                        borderRadius: "22px",
                        background: "rgba(25,30,40,0.95)",
                        border: "1px solid rgba(255,215,0,0.3)",
                        color: "white",
                    },
                }}
            >
                <DialogTitle>
                    <div className="flex justify-between items-center">
                        <p className="font-bold text-2xl text-yellow-400">
                            Detail Obat — {selectedSpendingItem?.name_spending}
                        </p>
                        <IconButton onClick={() => setOpenMedicine(false)}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                </DialogTitle>
                <Divider sx={{ borderColor: "rgba(255,215,0,0.2)" }} />
                <DialogContent className="px-8 py-6">
                    {loadingMedicine ? (
                        <div className="flex justify-center items-center py-16">
                            <CircularProgress sx={{ color: "#FFD700" }} />
                            <span className="ml-3 text-[#FFD700]">Memuat data obat...</span>
                        </div>
                    ) : medicineList.length ? (
                        <ul className="space-y-3">
                            {medicineList.map((m) => (
                                <li
                                    key={m.medicine_id}
                                    className="p-4 rounded-lg bg-[#2C3E50]/70 border border-[#FFD54F]/10"
                                >
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold text-[#FFD54F]">{m.name_medicine}</p>
                                        <p className="text-[#F4E1C1]">
                                            {m.quantity} {m.name_unit || "Unit"}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-400 text-center py-10">
                            🚫 Tidak ada data obat untuk transaksi ini.
                        </p>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
