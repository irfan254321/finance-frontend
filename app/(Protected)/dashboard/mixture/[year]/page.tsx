"use client"

import { useEffect, useMemo, useState, forwardRef } from "react"
import axiosInstance from "@/lib/axiosInstance"
import { useParams } from "next/navigation"
import ReactECharts from "echarts-for-react"

import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Divider,
    CircularProgress,
    Card,
    Button,
    Slide,
    Tab,
    Tabs,
    Box,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import React from "react"

// ====================== TYPES ======================
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

// ====================== CONST ======================
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

// ====================== MAIN ======================
export default function FinanceMonthly() {
    const params = useParams()
    const year = params.year as string

    const [incomeRaw, setIncomeRaw] = useState<Income[]>([])
    const [spendingRaw, setSpendingRaw] = useState<Spending[]>([])

    // Dialog bulan besar (zoom)
    const [openMonthDialog, setOpenMonthDialog] = useState(false)
    const [selectedMonth, setSelectedMonth] = useState<number | null>(null)

    // ========== DETAIL STATES ==========
    const [openDetail, setOpenDetail] = useState(false)
    const [detailTitle, setDetailTitle] = useState("")
    const [detailList, setDetailList] = useState<any[]>([])
    const [detailType, setDetailType] = useState<"income" | "spending" | null>(null)

    // Detail Obat
    const [openMedicine, setOpenMedicine] = useState(false)
    const [medicineList, setMedicineList] = useState<Medicine[]>([])
    const [loadingMedicine, setLoadingMedicine] = useState(false)
    const [selectedSpendingItem, setSelectedSpendingItem] = useState<Spending | null>(null)

    // Pagination detail (pendapatan/pengeluaran)
    const [page, setPage] = useState(1)
    const rowsPerPage = 7
    const paginatedList = useMemo(() => {
        const start = (page - 1) * rowsPerPage
        return detailList.slice(start, start + rowsPerPage)
    }, [detailList, page])
    const totalPages = Math.ceil(detailList.length / rowsPerPage)

    // Pagination detail obat (terpisah biar gak bentrok)
    const [medPage, setMedPage] = useState(1)
    const medRowsPerPage = 5
    const medTotalPages = Math.ceil(medicineList.length / medRowsPerPage)
    const medCurrentData = useMemo(() => {
        const start = (medPage - 1) * medRowsPerPage
        return medicineList.slice(start, start + medRowsPerPage)
    }, [medicineList, medPage])

    // Dialog tahunan
    const [openYearDialog, setOpenYearDialog] = useState(false)
    const [selectedYearType, setSelectedYearType] = useState<"income" | "spending" | null>()

    const [openYearDetail, setOpenYearDetail] = useState(false)
    const [yearDetailType, setYearDetailType] = useState<"income" | "spending" | null>(null)

    // Dialog semester besar
    const [openSemesterDetail, setOpenSemesterDetail] = useState(false)
    const [semesterDetailType, setSemesterDetailType] = useState<"income" | "spending" | null>(null)
    const [semesterIndex, setSemesterIndex] = useState<1 | 2 | null>(null)


    const handleSemesterZoom = (type: "income" | "spending", index: 1 | 2) => {
        setSemesterDetailType(type)
        setSemesterIndex(index)
        setOpenSemesterDetail(true)
    }

    useEffect(() => {
        if (openMedicine) setMedPage(1)
    }, [openMedicine])

    // ================= FETCH DATA =================
    useEffect(() => {
        if (!year) return
        axiosInstance.get<Income[]>(`/api/income/${year}`).then((res) => setIncomeRaw(res.data))
        axiosInstance.get<Spending[]>(`/api/spending/${year}`).then((res) => setSpendingRaw(res.data))
    }, [year])

    // ================= BUILD MONTHLY =================
    const monthly = useMemo(() => {
        const result: Record<
            number,
            {
                income: { byCat: Record<number, number>; total: number; pie: any[] }
                spending: { byCat: Record<number, number>; total: number; pie: any[] }
                surplus: number
            }
        > = {}

        MONTHS_ID.forEach((m) => {
            result[m] = {
                income: { byCat: {}, total: 0, pie: [] },
                spending: { byCat: {}, total: 0, pie: [] },
                surplus: 0,
            }
        })

        for (const d of incomeRaw) {
            const m = new Date(d.date_income).getMonth() + 1
            if (!result[m]) continue
            result[m].income.byCat[d.category_id] =
                (result[m].income.byCat[d.category_id] || 0) + d.amount_income
            result[m].income.total += d.amount_income
        }

        for (const d of spendingRaw) {
            const m = new Date(d.date_spending).getMonth() + 1
            if (!result[m]) continue
            result[m].spending.byCat[d.category_id] =
                (result[m].spending.byCat[d.category_id] || 0) + d.amount_spending
            result[m].spending.total += d.amount_spending
        }

        MONTHS_ID.forEach((m) => {
            const incPie = Object.entries(result[m].income.byCat)
                .filter(([cat]) => INCOME_LABEL[Number(cat)])
                .map(([cat, val], idx) => ({
                    id: idx,
                    value: val,
                    name: INCOME_LABEL[Number(cat)],
                    catId: Number(cat),
                }))

            const spPie = Object.entries(result[m].spending.byCat)
                .filter(([cat]) => SPENDING_LABEL[Number(cat)])
                .map(([cat, val], idx) => ({
                    id: idx,
                    value: val,
                    name: SPENDING_LABEL[Number(cat)],
                    catId: Number(cat),
                }))

            result[m].income.pie = incPie
            result[m].spending.pie = spPie
            result[m].surplus = result[m].income.total - result[m].spending.total
        })

        return result
    }, [incomeRaw, spendingRaw])

    // ================= HANDLERS =================
    const openDialogForMonthAll = (monthIndex: number, type: "income" | "spending") => {
        if (type === "income") {
            const list = incomeRaw
                .filter((d) => new Date(d.date_income).getMonth() + 1 === monthIndex + 1)
                .sort((a, b) => +new Date(a.date_income) - +new Date(b.date_income))
            setDetailList(list)
            setDetailTitle(`Detail Pendapatan — ${MONTHS_LABEL[monthIndex]}`)
            setDetailType("income")
        } else {
            const list = spendingRaw
                .filter((d) => new Date(d.date_spending).getMonth() + 1 === monthIndex + 1)
                .sort((a, b) => +new Date(a.date_spending) - +new Date(b.date_spending))
            setDetailList(list)
            setDetailTitle(`Detail Pengeluaran — ${MONTHS_LABEL[monthIndex]}`)
            setDetailType("spending")
        }
        setPage(1)
        setOpenDetail(true)
    }

    const handleSliceClick = (type: "income" | "spending", month: number, params: any) => {
        const data = params?.data
        if (!data) return
        const catId = data.catId

        if (type === "income") {
            const list = incomeRaw.filter((d) => {
                const m = new Date(d.date_income).getMonth() + 1
                return m === month && d.category_id === catId
            })
            setDetailList(list)
            setDetailTitle(`Pendapatan: ${data.name} — ${MONTHS_LABEL[month - 1]}`)
            setDetailType("income")
        } else {
            const list = spendingRaw.filter((d) => {
                const m = new Date(d.date_spending).getMonth() + 1
                return m === month && d.category_id === catId
            })
            setDetailList(list)
            setDetailTitle(`Pengeluaran: ${data.name} — ${MONTHS_LABEL[month - 1]}`)
            setDetailType("spending")
        }
        setPage(1)
        setOpenDetail(true)
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

    // ================= ECHARTS CONFIG =================
    const pieOption = (title: string, data: any[]) => ({
        backgroundColor: "transparent",
        tooltip: {
            trigger: "item",
            formatter: (p: any) => `${p.name}<br/><b>${formatRp(p.value)}</b>`,
        },
        legend: {
            bottom: 0,
            textStyle: { color: "#F4E1C1", fontSize: 13 },
        },
        series: [
            {
                name: title,
                type: "pie",
                radius: ["45%", "75%"],
                center: ["50%", "45%"],
                data,
                label: {
                    color: "#fff",
                    formatter: (p: any) => `${p.name}\n${formatRp(p.value)}`,
                },
                itemStyle: {
                    borderRadius: 8,
                    borderColor: "#1a2732",
                    borderWidth: 2,
                },
                emphasis: {
                    scale: true,
                    scaleSize: 15,
                    itemStyle: { shadowBlur: 20, shadowColor: "rgba(255,215,0,0.4)" },
                },
            },
        ],
    })

    const createPieEvents = (type: "income" | "spending", month: number) => ({
        click: (params: any) => {
            // prevent refresh / bubbling ke parent
            if (params?.event?.event) {
                params.event.event.preventDefault()
                params.event.event.stopPropagation()
            }
            handleSliceClick(type, month, params)
        },
    })

    // ================= SEMESTER HANDLERS =================
    const calcSemesterBreakdown = (type: "income" | "spending", semIndex: 1 | 2) => {
        const start = semIndex === 1 ? 1 : 7
        const end = semIndex === 1 ? 6 : 12
        const result: Record<number, number> = {}

        for (let m = start; m <= end; m++) {
            const items = type === "income" ? monthly[m].income.byCat : monthly[m].spending.byCat
            Object.entries(items).forEach(([catId, val]) => {
                result[Number(catId)] = (result[Number(catId)] || 0) + val
            })
        }

        return Object.entries(result).map(([cat, val], idx) => ({
            id: idx,
            catId: Number(cat),
            value: val,
            name: type === "income" ? INCOME_LABEL[Number(cat)] : SPENDING_LABEL[Number(cat)],
        }))
    }

    const handleSemesterClick = (type: "income" | "spending", semIndex: 1 | 2) => {
        const list = calcSemesterBreakdown(type, semIndex)
        setDetailList(list)
        setDetailTitle(
            type === "income"
                ? `Pendapatan Semester ${semIndex}`
                : `Pengeluaran Semester ${semIndex}`
        )
        setDetailType(type)
        setOpenDetail(true)
    }


    // sebelum return(), tambahkan state dan data helper:
    const [tabValue, setTabValue] = useState(0)

    const semesterData = useMemo(() => {
        const s1 = { income: 0, spending: 0 }
        const s2 = { income: 0, spending: 0 }
        MONTHS_ID.forEach((m) => {
            if (m <= 6) {
                s1.income += monthly[m]?.income.total || 0
                s1.spending += monthly[m]?.spending.total || 0
            } else {
                s2.income += monthly[m]?.income.total || 0
                s2.spending += monthly[m]?.spending.total || 0
            }
        })
        return {
            s1: { ...s1, surplus: s1.income - s1.spending },
            s2: { ...s2, surplus: s2.income - s2.spending },
        }
    }, [monthly])

    const yearlyData = useMemo(() => {
        const totalIncome = MONTHS_ID.reduce((sum, m) => sum + (monthly[m]?.income.total || 0), 0)
        const totalSpending = MONTHS_ID.reduce((sum, m) => sum + (monthly[m]?.spending.total || 0), 0)
        return { totalIncome, totalSpending, surplus: totalIncome - totalSpending }
    }, [monthly])

    // ================= YEARLY HANDLERS =================
    const calcYearlyBreakdown = (type: "income" | "spending") => {
        const result: Record<number, number> = {}
        MONTHS_ID.forEach((m) => {
            const items = type === "income" ? monthly[m].income.byCat : monthly[m].spending.byCat
            Object.entries(items).forEach(([catId, val]) => {
                result[Number(catId)] = (result[Number(catId)] || 0) + val
            })
        })
        return Object.entries(result).map(([cat, val], idx) => ({
            id: idx,
            catId: Number(cat),
            value: val,
            name: type === "income" ? INCOME_LABEL[Number(cat)] : SPENDING_LABEL[Number(cat)],
        }))
    }

    const handleYearlyCategoryClick = (type: "income" | "spending", catId: number, catName: string) => {
        const list = MONTHS_ID.map((m) => {
            const monthName = MONTHS_LABEL[m - 1]
            const total =
                type === "income"
                    ? monthly[m]?.income.byCat[catId] || 0
                    : monthly[m]?.spending.byCat[catId] || 0
            return { id: m, month: monthName, total }
        })

        setDetailList(list)
        setDetailTitle(`${type === "income" ? "Pendapatan" : "Pengeluaran"}: ${catName} per Bulan`)
        setDetailType(type)
        setOpenDetail(true)
    }
    ``
    function DynamicYearlyChart({
        title,
        color,
        data,
        onClick,
    }: {
        title: string
        color: string
        data: { id: number; name: string; value: number; catId?: number }[]
        onClick: (catId: number, catName: string) => void
    }) {
        const chartRef = React.useRef<any>(null)
        const [fadeState, setFadeState] = React.useState<"icon" | "bar">("icon")

        // ====== ICONS (SVG dari /public/icons) ======
        const pathSymbols = {
            bpjs: "image:///icons/bpjs.svg",
            umum: "image:///icons/patient.svg",
            deposito: "image:///icons/money.svg",
            sewa: "image:///icons/handshake.svg",
            operasional: "image:///icons/gear.svg",
            pemeliharaan: "image:///icons/wrench.svg",
            pendukung: "image:///icons/box.svg",
            honor: "image:///icons/tie.svg",
            jasa: "image:///icons/steth.svg",
            obat: "image:///icons/pill.svg",
            mesin: "image:///icons/machine.svg",
        }

        const makeSeries = (type: "icon" | "bar"): echarts.PictorialBarSeriesOption => ({
            name: type === "icon" ? "Ikon" : "Bar",
            type: "pictorialBar", // <— sekarang valid
            symbolRepeat: true,
            symbolSize: [70, 70],
            barCategoryGap: "80%",
            symbolMargin: 3,
            animationDuration: 1000,
            animationDurationUpdate: 1200, // << smooth update
            animationEasingUpdate: "cubicInOut",
            label: {
                show: true,
                position: "top",
                distance: 10,
                color,
                fontWeight: "bold",
                fontSize: 16,
                opacity: type === fadeState ? 1 : 0,
                formatter: (p: any) => formatRp(p.value),
            },
            itemStyle: {
                opacity: type === fadeState ? 1 : 0, // Crossfade
                shadowBlur: 10,
                shadowColor:
                    color === "#FFD700" ? "rgba(255,215,0,0.3)" : "rgba(255,127,80,0.3)",
            },
            data:
                type === "icon"
                    ? data.map((d) => ({
                        value: d.value,
                        name: d.name,
                        catId: d.catId,
                        symbol:
                            d.name.includes("BPJS") ? pathSymbols.bpjs :
                                d.name.includes("Umum") ? pathSymbols.umum :
                                    d.name.includes("Deposito") ? pathSymbols.deposito :
                                        d.name.includes("Sewa") ? pathSymbols.sewa :
                                            d.name.includes("Obat") ? pathSymbols.obat :
                                                d.name.includes("Operasional") ? pathSymbols.operasional :
                                                    d.name.includes("Medis") ? pathSymbols.jasa :
                                                        d.name.includes("Pegawai") ? pathSymbols.honor :
                                                            d.name.includes("Pemeliharaan") ? pathSymbols.pemeliharaan :
                                                                d.name.includes("Pendukung") ? pathSymbols.pendukung :
                                                                    pathSymbols.mesin,
                    }))
                    : data.map((d) => ({
                        value: d.value,
                        name: d.name,
                        catId: d.catId,
                        symbol: "rect",
                    })),
        });


        const makeOption = (): echarts.EChartsOption => ({
            backgroundColor: "transparent",
            tooltip: {
                trigger: "item",
                formatter: (p: any) => `${p.name}<br/><b>${formatRp(p.value)}</b>`,
            },
            title: {
                text: title,
                left: "center",
                textStyle: { color, fontSize: 18, fontWeight: 700 },
            },
            grid: { left: 20, right: 20, top: 60, bottom: 50 },
            xAxis: {
                type: "category",
                data: data.map((d) => d.name),
                axisLabel: { color: "#F4E1C1", fontWeight: 600, rotate: 15 },
                axisTick: { show: false },
                axisLine: { show: false },
            },
            yAxis: { show: false },
            series: [makeSeries("icon"), makeSeries("bar")],
        })

        React.useEffect(() => {
            if (!chartRef.current) return
            const chart = chartRef.current.getEchartsInstance()
            chart.setOption(makeOption())

            const timer = setInterval(() => {
                setFadeState((prev) => (prev === "icon" ? "bar" : "icon"))
            }, 3000)

            return () => clearInterval(timer)
        }, [data])

        React.useEffect(() => {
            if (!chartRef.current) return
            const chart = chartRef.current.getEchartsInstance()
            chart.setOption(makeOption(), { notMerge: true })
        }, [fadeState])

        return (
            <Card
                sx={{
                    background: "rgba(43,59,75,0.9)",
                    border: "1px solid rgba(255,215,0,0.2)",
                    borderRadius: "20px",
                    p: "1.5rem",
                }}
            >
                <ReactECharts
                    ref={chartRef}
                    option={makeOption()}
                    style={{ height: 500 }}
                    opts={{ renderer: "svg" }}
                    onEvents={{
                        click: (params: any) => {
                            const catName = params?.data?.name
                            const catId = params?.data?.catId
                            if (catName && catId) onClick(catId, catName)
                        },
                    }}
                />
            </Card>
        )
    }


    // ================= RENDER =================
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1a2732] via-[#2C3E50] to-[#1a2732] text-white mt-10">
            <main className="max-w-[1700px] mx-auto px-6 pt-28 pb-16">
                <h1 className="text-4xl font-bold text-[#F4E1C1] text-center mb-10 drop-shadow-md">
                    <span className="text-yellow-400">Ringkasan Keuangan Per Bulan</span>
                    <br /> Rumah Sakit Bhayangkara M. Hasan Palembang {year}
                </h1>

                {/* === NAVIGASI TAB === */}
                <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 4 }}>
                    <Tabs
                        value={tabValue}
                        onChange={(_, v) => setTabValue(v)}
                        centered
                        textColor="inherit"
                        indicatorColor="secondary"
                    >
                        <Tab label="Bulanan" />
                        <Tab label="Semester" />
                        <Tab label="Tahunan" />
                    </Tabs>
                </Box>

                {/* === KONTEN TAB === */}
                {tabValue === 0 && (
                    <div className="flex flex-col gap-10">
                        {MONTHS_ID.map((m) => {
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
                                                setSelectedMonth(m)
                                                setOpenMonthDialog(true)
                                            }}
                                        >
                                            {MONTHS_LABEL[m - 1]}
                                        </h2>
                                        <div className="text-right">
                                            <p className="text-[#F4E1C1]">
                                                💰 Pendapatan: <b>{formatRp(inc.total)}</b>
                                            </p>
                                            <p className="text-[#F4E1C1]">
                                                💸 Pengeluaran: <b>{formatRp(sp.total)}</b>
                                            </p>
                                            <p
                                                className={`text-lg font-bold ${surplus >= 0 ? "text-green-400" : "text-red-400"
                                                    }`}
                                            >
                                                {surplus >= 0
                                                    ? `📈 Surplus: ${formatRp(surplus)}`
                                                    : `📉 Defisit: ${formatRp(Math.abs(surplus))}`}
                                            </p>
                                        </div>
                                    </div>

                                    <Divider sx={{ borderColor: "rgba(255,215,0,0.2)", mb: 3 }} />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="flex flex-col items-center">
                                            <h3 className="text-xl mb-2 text-[#F4E1C1]">Pendapatan</h3>
                                            <ReactECharts
                                                option={pieOption("Pendapatan", inc.pie)}
                                                style={{ height: 380, width: "100%" }}
                                                onEvents={createPieEvents("income", m)}
                                            />
                                            <Button
                                                type="button"
                                                variant="contained"
                                                onClick={() => openDialogForMonthAll(m - 1, "income")}
                                                sx={{
                                                    mt: 1,
                                                    background: "#FFD700",
                                                    color: "#1a2732",
                                                    fontWeight: 700,
                                                    borderRadius: "10px",
                                                    px: 3,
                                                    "&:hover": { background: "#E6BE00" },
                                                }}
                                            >
                                                🔍 Lihat semua pendapatan bulan ini
                                            </Button>
                                        </div>

                                        <div className="flex flex-col items-center">
                                            <h3 className="text-xl mb-2 text-[#F4E1C1]">Pengeluaran</h3>
                                            <ReactECharts
                                                option={pieOption("Pengeluaran", sp.pie)}
                                                style={{ height: 380, width: "100%" }}
                                                onEvents={createPieEvents("spending", m)}
                                            />
                                            <Button
                                                type="button"
                                                variant="contained"
                                                onClick={() => openDialogForMonthAll(m - 1, "spending")}
                                                sx={{
                                                    mt: 1,
                                                    background: "#FFD700",
                                                    color: "#1a2732",
                                                    fontWeight: 700,
                                                    borderRadius: "10px",
                                                    px: 3,
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
                )}

                {tabValue === 1 && (
                    <div className="grid md:grid-cols-2 gap-10">
                        {/* SEMESTER 1 */}
                        <Card
                            sx={{
                                background: "rgba(43,59,75,0.9)",
                                border: "1px solid rgba(255,215,0,0.2)",
                                borderRadius: "20px",
                                p: "1.5rem",
                                cursor: "pointer",
                                transition: "all 0.3s",
                                "&:hover": { transform: "scale(1.02)", borderColor: "#FFD700" },
                            }}
                            onClick={() => handleSemesterZoom("income", 1)} // klik buat buka zoom
                        >
                            <h2 className="text-2xl font-bold text-[#FFD700] text-center mb-2">
                                Semester 1 (Jan–Jun)
                            </h2>
                            <p className="text-center text-[#F4E1C1] mb-3">
                                💰 {formatRp(semesterData.s1.income)} | 💸 {formatRp(semesterData.s1.spending)} <br />
                                {semesterData.s1.surplus >= 0
                                    ? `📈 Surplus: ${formatRp(semesterData.s1.surplus)}`
                                    : `📉 Defisit: ${formatRp(Math.abs(semesterData.s1.surplus))}`}
                            </p>
                            <ReactECharts
                                option={{
                                    tooltip: { trigger: "item" },
                                    legend: { top: "5%", left: "center", textStyle: { color: "#F4E1C1" } },
                                    series: [
                                        {
                                            name: "Semester 1",
                                            type: "pie",
                                            radius: ["40%", "70%"],
                                            data: [
                                                { value: semesterData.s1.income, name: "Pendapatan" },
                                                { value: semesterData.s1.spending, name: "Pengeluaran" },
                                            ],
                                        },
                                    ],
                                }}
                                style={{ height: 400 }}
                            />
                        </Card>

                        {/* SEMESTER 2 */}
                        <Card
                            sx={{
                                background: "rgba(43,59,75,0.9)",
                                border: "1px solid rgba(255,215,0,0.2)",
                                borderRadius: "20px",
                                p: "1.5rem",
                                cursor: "pointer",
                                transition: "all 0.3s",
                                "&:hover": { transform: "scale(1.02)", borderColor: "#FFD700" },
                            }}
                            onClick={() => handleSemesterZoom("income", 2)}
                        >
                            <h2 className="text-2xl font-bold text-[#FFD700] text-center mb-2">
                                Semester 2 (Jul–Des)
                            </h2>
                            <p className="text-center text-[#F4E1C1] mb-3">
                                💰 {formatRp(semesterData.s2.income)} | 💸 {formatRp(semesterData.s2.spending)} <br />
                                {semesterData.s2.surplus >= 0
                                    ? `📈 Surplus: ${formatRp(semesterData.s2.surplus)}`
                                    : `📉 Defisit: ${formatRp(Math.abs(semesterData.s2.surplus))}`}
                            </p>
                            <ReactECharts
                                option={{
                                    tooltip: { trigger: "item" },
                                    legend: { top: "5%", left: "center", textStyle: { color: "#F4E1C1" } },
                                    series: [
                                        {
                                            name: "Semester 2",
                                            type: "pie",
                                            radius: ["40%", "70%"],
                                            data: [
                                                { value: semesterData.s2.income, name: "Pendapatan" },
                                                { value: semesterData.s2.spending, name: "Pengeluaran" },
                                            ],
                                        },
                                    ],
                                }}
                                style={{ height: 400 }}
                            />
                        </Card>
                    </div>
                )}

                {tabValue === 2 && (
                    <div className="grid md:grid-cols-2 gap-10 justify-center items-start">

                        {/* ====== SURPLUS / DEFISIT INFO ====== */}
                        <div className="md:col-span-2 text-center mb-6">
                            {yearlyData.surplus >= 0 ? (
                                <p className="text-xl font-bold text-green-400">
                                    📈 Surplus: {formatRp(yearlyData.surplus)}
                                </p>
                            ) : (
                                <p className="text-xl font-bold text-red-400">
                                    📉 Defisit: {formatRp(Math.abs(yearlyData.surplus))}
                                </p>
                            )}
                        </div>

                        {/* Pendapatan Tahunan */}
                        <div>
                            <h2 className="text-2xl font-bold text-[#FFD700] uppercase text-center mb-1 cursor-pointer"
                                onClick={() => { setYearDetailType("income"); setOpenYearDetail(true) }}>
                                Pendapatan Tahunan — {year}
                            </h2>
                            <p className="text-center text-lg text-[#F4E1C1] mb-4">
                                Total: <b className="text-[#FFD700]">{formatRp(yearlyData.totalIncome)}</b>
                            </p>
                            <DynamicYearlyChart
                                title=""
                                color="#FFD700"
                                data={calcYearlyBreakdown("income")}
                                onClick={(catId, catName) => handleYearlyCategoryClick("income", catId, catName)}
                            />
                        </div>

                        {/* Pengeluaran Tahunan */}
                        <div>
                            <h2 className="text-2xl font-bold text-[#FF7F50] uppercase text-center mb-1 cursor-pointer"
                                onClick={() => { setYearDetailType("spending"); setOpenYearDetail(true) }}>
                                Pengeluaran Tahunan — {year}
                            </h2>
                            <p className="text-center text-lg text-[#F4E1C1] mb-4">
                                Total: <b className="text-[#FF7F50]">{formatRp(yearlyData.totalSpending)}</b>
                            </p>
                            <DynamicYearlyChart
                                title=""
                                color="#FF7F50"
                                data={calcYearlyBreakdown("spending")}
                                onClick={(catId, catName) => handleYearlyCategoryClick("spending", catId, catName)}
                            />
                        </div>
                    </div>
                )}
            </main>

            {/* ========== DIALOG BULAN (CHART BESAR) ========== */}
            <Dialog
                open={openMonthDialog}
                onClose={() => setOpenMonthDialog(false)}
                maxWidth={false}
                fullWidth
                TransitionComponent={Transition}
                BackdropProps={{
                    sx: {
                        backdropFilter: "blur(12px)",
                        backgroundColor: "rgba(0,0,0,0.6)",
                    },
                }}
                sx={{
                    "& .MuiDialog-paper": {
                        background: "rgba(25,30,40,0.98)",
                        borderRadius: "25px",
                        border: "1px solid rgba(255,215,0,0.3)",
                        padding: "20px",
                        color: "white",
                        margin: "5px auto",
                        maxHeight: "calc(100vh - 20px)",
                        overflowY: "auto",
                        boxShadow: "0 0 40px rgba(255,215,0,0.2)",
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
                                    <ReactECharts
                                        option={pieOption("Pendapatan", monthly[selectedMonth]?.income.pie || [])}
                                        style={{ height: 500, width: "100%" }}
                                        onEvents={createPieEvents("income", selectedMonth)}
                                    />
                                </div>

                                {/* Pengeluaran */}
                                <div className="flex flex-col items-center">
                                    <h3 className="text-xl mb-2 text-[#F4E1C1]">Pengeluaran</h3>
                                    <ReactECharts
                                        option={pieOption("Pengeluaran", monthly[selectedMonth]?.spending.pie || [])}
                                        style={{ height: 500, width: "100%" }}
                                        onEvents={createPieEvents("spending", selectedMonth)}
                                    />
                                </div>
                            </div>
                        </DialogContent>
                    </>
                )}
            </Dialog>

            {/* ========== DIALOG DETAIL (LIST TRANSAKSI) ========== */}
            <Dialog
                open={openDetail}
                onClose={() => setOpenDetail(false)}
                TransitionComponent={Transition}
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
                                {/* === VIEW TAHUNAN PER BULAN === */}
                                {detailTitle.includes("per Bulan") ? (
                                    detailList.map((d) => (
                                        <li
                                            key={d.id}
                                            className="p-4 rounded-lg bg-[#2C3E50]/70 border border-[#F4E1C1]/10"
                                        >
                                            <div className="flex justify-between">
                                                <p className="font-semibold text-[#FFD54F]">{d.month}</p>
                                                <p className="text-[#F4E1C1] font-bold">{formatRp(d.total)}</p>
                                            </div>
                                        </li>
                                    ))
                                ) : detailTitle.includes("Semester") ? (
                                    detailList.map((d) => (
                                        <li
                                            key={d.id}
                                            className="p-4 rounded-lg bg-[#2C3E50]/70 border border-[#F4E1C1]/10"
                                        >
                                            <div className="flex justify-between">
                                                <p className="font-semibold text-[#FFD54F]">{d.name}</p>
                                                <p className="text-[#F4E1C1] font-bold">{formatRp(d.value)}</p>
                                            </div>
                                        </li>
                                    ))
                                ) : detailType === "income" ? (
                                    paginatedList.map((d: Income) => (
                                        <li
                                            key={d.id}
                                            className="p-4 rounded-lg bg-[#2C3E50]/70 border border-[#F4E1C1]/10"
                                        >
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
                                    ))
                                ) : (
                                    paginatedList.map((d: Spending) => (
                                        <li
                                            key={d.id}
                                            className={`p-4 rounded-lg bg-[#2C3E50]/70 border border-[#F4E1C1]/10 ${d.category_id === 9 ? "hover:ring-2 hover:ring-[#FFD700] cursor-pointer" : ""
                                                }`}
                                            onClick={() => {
                                                if (d.category_id === 9) handleClickSpendingObat(d)
                                            }}
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
                                        </li>
                                    ))
                                )}
                            </ul>

                            {/* Pagination */}
                            {!detailTitle.includes("per Bulan") &&
                                !detailTitle.includes("Semester") &&
                                totalPages > 1 && (
                                    <div className="flex justify-center items-center gap-3 mt-6">
                                        <Button
                                            type="button"
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
                                            type="button"
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

            {/* ========== DIALOG DETAIL OBAT (DENGAN PAGINATION) ========== */}
            <Dialog
                open={openMedicine}
                onClose={() => setOpenMedicine(false)}
                TransitionComponent={Transition}
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
                        <>
                            <ul className="space-y-3">
                                {medCurrentData.map((m) => (
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

                            {/* Pagination Obat */}
                            {medTotalPages > 1 && (
                                <div className="flex justify-center items-center gap-3 mt-6">
                                    <Button
                                        type="button"
                                        variant="outlined"
                                        disabled={medPage === 1}
                                        onClick={() => setMedPage((p) => p - 1)}
                                        sx={{
                                            borderColor: "#FFD700",
                                            color: "#FFD700",
                                            "&:hover": { borderColor: "#E6BE00", background: "rgba(255,215,0,0.1)" },
                                        }}
                                    >
                                        ◀ Prev
                                    </Button>

                                    <span className="text-[#F4E1C1]">Halaman {medPage} dari {medTotalPages}</span>

                                    <Button
                                        type="button"
                                        variant="outlined"
                                        disabled={medPage === medTotalPages}
                                        onClick={() => setMedPage((p) => p + 1)}
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
                        <p className="text-gray-400 text-center py-10">
                            🚫 Tidak ada data obat untuk transaksi ini.
                        </p>
                    )}
                </DialogContent>
            </Dialog>

            {/* ========== DIALOG SEMESTER DETAIL (ZOOM BESAR) ========== */}
            <Dialog
                open={openSemesterDetail}
                onClose={() => setOpenSemesterDetail(false)}
                maxWidth={false}
                fullWidth
                TransitionComponent={Transition}
                BackdropProps={{
                    sx: {
                        backdropFilter: "blur(12px)",
                        backgroundColor: "rgba(0,0,0,0.6)",
                    },
                }}
                sx={{
                    "& .MuiDialog-paper": {
                        background: "rgba(25,30,40,0.98)",
                        borderRadius: "25px",
                        border: "1px solid rgba(255,215,0,0.3)",
                        padding: "20px",
                        color: "white",
                        margin: "5px auto",
                        width: "95%",
                        maxWidth: "1500px",
                        maxHeight: "calc(100vh - 20px)",
                        overflowY: "auto",
                        boxShadow: "0 0 40px rgba(255,215,0,0.25)",
                    },
                }}
            >
                {semesterDetailType && semesterIndex && (
                    <>
                        <DialogTitle>
                            <div className="flex justify-between items-center">
                                <div className="flex flex-col w-full text-center">
                                    <p className="font-bold text-4xl text-yellow-400 uppercase tracking-wide mb-2">
                                        {semesterIndex === 1
                                            ? `Semester 1 (Jan–Jun)`
                                            : `Semester 2 (Jul–Des)`}
                                    </p>

                                    <p className="text-lg text-[#F4E1C1]">
                                        💰 Pendapatan:&nbsp;
                                        <b className="text-[#FFD700]">
                                            {formatRp(
                                                semesterIndex === 1
                                                    ? semesterData.s1.income
                                                    : semesterData.s2.income
                                            )}
                                        </b>
                                        &nbsp; | 💸 Pengeluaran:&nbsp;
                                        <b className="text-[#FF7F50]">
                                            {formatRp(
                                                semesterIndex === 1
                                                    ? semesterData.s1.spending
                                                    : semesterData.s2.spending
                                            )}
                                        </b>
                                        <br />
                                        {semesterIndex === 1
                                            ? semesterData.s1.surplus >= 0
                                                ? `📈 Surplus: ${formatRp(semesterData.s1.surplus)}`
                                                : `📉 Defisit: ${formatRp(
                                                    Math.abs(semesterData.s1.surplus)
                                                )}`
                                            : semesterData.s2.surplus >= 0
                                                ? `📈 Surplus: ${formatRp(semesterData.s2.surplus)}`
                                                : `📉 Defisit: ${formatRp(
                                                    Math.abs(semesterData.s2.surplus)
                                                )}`}
                                    </p>
                                </div>
                                <IconButton onClick={() => setOpenSemesterDetail(false)}>
                                    <CloseIcon />
                                </IconButton>
                            </div>
                        </DialogTitle>

                        <Divider sx={{ borderColor: "rgba(255,215,0,0.2)", mb: 2 }} />

                        <DialogContent>
                            <div className="flex justify-center">
                                <div className="max-w-[1300px] w-full">
                                    <ReactECharts
                                        option={{
                                            tooltip: { trigger: "item" },
                                            legend: {
                                                top: "5%",
                                                left: "center",
                                                textStyle: { color: "#F4E1C1" },
                                            },
                                            series: [
                                                {
                                                    name:
                                                        semesterIndex === 1
                                                            ? "Semester 1"
                                                            : "Semester 2",
                                                    type: "pie",
                                                    radius: ["45%", "75%"],
                                                    data: [
                                                        {
                                                            value:
                                                                semesterIndex === 1
                                                                    ? semesterData.s1.income
                                                                    : semesterData.s2.income,
                                                            name: "Pendapatan",
                                                        },
                                                        {
                                                            value:
                                                                semesterIndex === 1
                                                                    ? semesterData.s1.spending
                                                                    : semesterData.s2.spending,
                                                            name: "Pengeluaran",
                                                        },
                                                    ],
                                                },
                                            ],
                                        }}
                                        style={{ height: 600 }}
                                        onEvents={{
                                            click: (params: { name: string }) => {
                                                if (params.name === "Pendapatan") {
                                                    handleSemesterClick("income", 1);
                                                } else if (params.name === "Pengeluaran") {
                                                    handleSemesterClick("spending", 1);
                                                }
                                            },
                                        }}
                                    />
                                </div>
                            </div>
                        </DialogContent>
                    </>
                )}
            </Dialog>

            {/* ========== DIALOG YEARLY DETAIL (ZOOM BESAR) ========== */}
            <Dialog
                open={openYearDetail}
                onClose={() => setOpenYearDetail(false)}
                maxWidth={false}
                fullWidth
                TransitionComponent={Transition}
                BackdropProps={{
                    sx: {
                        backdropFilter: "blur(12px)",
                        backgroundColor: "rgba(0,0,0,0.6)",
                    },
                }}
                sx={{
                    "& .MuiDialog-paper": {
                        background: "rgba(25,30,40,0.98)",
                        borderRadius: "25px",
                        border: "1px solid rgba(255,215,0,0.3)",
                        padding: "20px",
                        color: "white",
                        margin: "5px auto",
                        width: "95%",
                        maxWidth: "1800px",
                        maxHeight: "calc(100vh - 20px)",
                        overflowY: "auto",
                        boxShadow: "0 0 40px rgba(255,215,0,0.25)",
                    },
                }}
            >
                {yearDetailType && (
                    <>
                        <DialogTitle>
                            <div className="flex justify-between items-center">
                                <div className="flex flex-col w-full text-center">
                                    <p className="font-bold text-4xl text-yellow-400 uppercase tracking-wide mb-2">
                                        {yearDetailType === "income"
                                            ? `Pendapatan Tahunan — ${year}`
                                            : `Pengeluaran Tahunan — ${year}`}
                                    </p>

                                    <p className="text-lg text-[#F4E1C1]">
                                        Total:&nbsp;
                                        <b
                                            className={
                                                yearDetailType === "income"
                                                    ? "text-[#FFD700]" // kuning untuk pendapatan
                                                    : "text-[#FF7F50]" // oranye untuk pengeluaran
                                            }
                                        >
                                            {yearDetailType === "income"
                                                ? formatRp(yearlyData.totalIncome)
                                                : formatRp(yearlyData.totalSpending)}
                                        </b>
                                    </p>
                                </div>

                                <IconButton onClick={() => setOpenYearDetail(false)}>
                                    <CloseIcon />
                                </IconButton>
                            </div>
                        </DialogTitle>

                        <Divider sx={{ borderColor: "rgba(255,215,0,0.2)", mb: 2 }} />

                        <DialogContent>
                            <div className="flex justify-center">
                                <div className="max-w-[1500px] w-full">
                                    <DynamicYearlyChart
                                        title={
                                            yearDetailType === "income"
                                                ? ``
                                                : ``
                                        }
                                        color={yearDetailType === "income" ? "#FFD700" : "#FF7F50"}
                                        data={calcYearlyBreakdown(yearDetailType)}
                                        onClick={(catId, catName) =>
                                            handleYearlyCategoryClick(yearDetailType, catId, catName)
                                        }
                                    />
                                </div>
                            </div>
                        </DialogContent>
                    </>
                )}
            </Dialog>

        </div>
    )
}
