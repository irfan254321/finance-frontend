"use client"

import { useEffect, useMemo, useState } from "react"
import axiosInstance from "@/lib/axiosInstance"
import { useParams } from "next/navigation"
import { Box, Tab, Tabs } from "@mui/material"
import React from "react"

// Components
import MonthlyView from "./components/MonthlyView"
import SemesterView from "./components/SemesterView"
import YearlyView from "./components/YearlyView"
import MonthDetailDialog from "./components/dialogs/MonthDetailDialog"
import TransactionDetailDialog from "./components/dialogs/TransactionDetailDialog"
import MedicineDetailDialog from "./components/dialogs/MedicineDetailDialog"
import SemesterDetailDialog from "./components/dialogs/SemesterDetailDialog"
import YearDetailDialog from "./components/dialogs/YearDetailDialog"

// Utils & Types
import { Income, Spending, Category, Medicine } from "@/types/finance"
import { MONTHS_ID, MONTHS_LABEL, formatRp } from "@/lib/utils"

// ====================== MAIN COMPONENT ======================
export default function FinanceMonthly() {
    // ====================== HOOKS & PARAMS ======================
    const params = useParams()
    const year = params.year as string

    // ====================== STATE MANAGEMENT ======================
    // Data Raw (Pendapatan & Pengeluaran)
    const [incomeRaw, setIncomeRaw] = useState<Income[]>([])
    const [spendingRaw, setSpendingRaw] = useState<Spending[]>([])

    // Kategori Data
    const [incomeCategories, setIncomeCategories] = useState<Category[]>([]);
    const [spendingCategories, setSpendingCategories] = useState<Category[]>([]);

    // ====================== MEMOIZED LABELS ======================
    // Mapping ID Kategori ke Nama Kategori untuk efisiensi lookup
    const INCOME_LABEL = useMemo(() => {
        const obj: Record<number, string> = {};
        incomeCategories.forEach((c) => {
            obj[c.id] = c.name_category;
        });
        return obj;
    }, [incomeCategories]);

    const SPENDING_LABEL = useMemo(() => {
        const obj: Record<number, string> = {};
        spendingCategories.forEach((c) => {
            obj[c.id] = c.name_category;
        });
        return obj;
    }, [spendingCategories]);

    // ====================== DIALOG STATES ======================
    // Dialog Detail Bulan (Chart Besar)
    const [openMonthDialog, setOpenMonthDialog] = useState(false)
    const [selectedMonth, setSelectedMonth] = useState<number | null>(null)

    // Dialog Detail Transaksi (List)
    const [openDetail, setOpenDetail] = useState(false)
    const [detailTitle, setDetailTitle] = useState("")
    const [detailList, setDetailList] = useState<any[]>([])
    const [detailType, setDetailType] = useState<"income" | "spending" | null>(null)

    // Dialog Detail Obat
    const [openMedicine, setOpenMedicine] = useState(false)
    const [medicineList, setMedicineList] = useState<Medicine[]>([])
    const [loadingMedicine, setLoadingMedicine] = useState(false)
    const [selectedSpendingItem, setSelectedSpendingItem] = useState<Spending | null>(null)

    // Dialog Detail Tahunan
    const [openYearDetail, setOpenYearDetail] = useState(false)
    const [yearDetailType, setYearDetailType] = useState<"income" | "spending" | null>(null)

    // Dialog Detail Semester
    const [openSemesterDetail, setOpenSemesterDetail] = useState(false)
    const [semesterDetailType, setSemesterDetailType] = useState<"income" | "spending" | null>(null)
    const [semesterIndex, setSemesterIndex] = useState<1 | 2 | null>(null)

    // ====================== PAGINATION STATES ======================
    // Pagination untuk Detail Transaksi
    const [page, setPage] = useState(1)
    const rowsPerPage = 7
    const paginatedList = useMemo(() => {
        const start = (page - 1) * rowsPerPage
        return detailList.slice(start, start + rowsPerPage)
    }, [detailList, page])
    const totalPages = Math.ceil(detailList.length / rowsPerPage)

    // Pagination untuk Detail Obat
    const [medPage, setMedPage] = useState(1)
    const medRowsPerPage = 5
    const medTotalPages = Math.ceil(medicineList.length / medRowsPerPage)
    const medCurrentData = useMemo(() => {
        const start = (medPage - 1) * medRowsPerPage
        return medicineList.slice(start, start + medRowsPerPage)
    }, [medicineList, medPage])

    // ====================== EFFECTS ======================
    // Reset halaman obat saat dialog obat dibuka
    useEffect(() => {
        if (openMedicine) setMedPage(1)
    }, [openMedicine])

    // Fetch Kategori saat mount
    useEffect(() => {
        axiosInstance.get("/api/categoryIncome").then(res => setIncomeCategories(res.data));
        axiosInstance.get("/api/categorySpending").then(res => setSpendingCategories(res.data));
    }, []);

    // Fetch Data Transaksi berdasarkan Tahun
    useEffect(() => {
        if (!year) return
        axiosInstance.get<Income[]>(`/api/income/${year}`).then((res) => setIncomeRaw(res.data))
        axiosInstance.get<Spending[]>(`/api/spending/${year}`).then((res) => setSpendingRaw(res.data))
    }, [year])

    // ====================== DATA PROCESSING ======================
    // Mengolah data raw menjadi struktur bulanan yang mudah digunakan
    const monthly = useMemo(() => {
        const result: Record<
            number,
            {
                income: { byCat: Record<number, number>; total: number; pie: any[] }
                spending: { byCat: Record<number, number>; total: number; pie: any[] }
                surplus: number
            }
        > = {}

        // Inisialisasi struktur data untuk setiap bulan
        MONTHS_ID.forEach((m) => {
            result[m] = {
                income: { byCat: {}, total: 0, pie: [] },
                spending: { byCat: {}, total: 0, pie: [] },
                surplus: 0,
            }
        })

        // Proses data pendapatan
        for (const d of incomeRaw) {
            const m = new Date(d.date_income).getMonth() + 1
            if (!result[m]) continue
            result[m].income.byCat[d.category_id] =
                (result[m].income.byCat[d.category_id] || 0) + d.amount_income
            result[m].income.total += d.amount_income
        }

        // Proses data pengeluaran
        for (const d of spendingRaw) {
            const m = new Date(d.date_spending).getMonth() + 1
            if (!result[m]) continue
            result[m].spending.byCat[d.category_id] =
                (result[m].spending.byCat[d.category_id] || 0) + d.amount_spending
            result[m].spending.total += d.amount_spending
        }

        // Format data untuk Pie Chart dan hitung surplus
        MONTHS_ID.forEach((m) => {
            const incPie = Object.entries(result[m].income.byCat)
                .filter(([cat, val]) => val > 0)
                .map(([cat, val], idx) => ({
                    id: idx,
                    value: val,
                    name: INCOME_LABEL[Number(cat)],
                    catId: Number(cat),
                }))

            const spPie = Object.entries(result[m].spending.byCat)
                .filter(([cat, val]) => val > 0)
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
    }, [incomeRaw, spendingRaw, INCOME_LABEL, SPENDING_LABEL])

    // ====================== EVENT HANDLERS ======================
    // Handler untuk membuka dialog detail transaksi bulanan
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

    // Handler saat slice pie chart diklik
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

    // Handler untuk melihat detail obat pada pengeluaran
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

    // Handler untuk zoom semester
    const handleSemesterZoom = (type: "income" | "spending", index: 1 | 2) => {
        setSemesterDetailType(type)
        setSemesterIndex(index)
        setOpenSemesterDetail(true)
    }

    // ====================== CHART CONFIGURATIONS ======================
    // Konfigurasi umum untuk Pie Chart
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

    // Membuat event handler untuk klik pada chart
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

    // ====================== SEMESTER LOGIC ======================
    // Menghitung breakdown data per semester
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

    // ====================== TAB & VIEW HELPERS ======================
    const [tabValue, setTabValue] = useState(0)

    // Data agregat per semester
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

    // Data agregat tahunan
    const yearlyData = useMemo(() => {
        const totalIncome = MONTHS_ID.reduce((sum, m) => sum + (monthly[m]?.income.total || 0), 0)
        const totalSpending = MONTHS_ID.reduce((sum, m) => sum + (monthly[m]?.spending.total || 0), 0)
        return { totalIncome, totalSpending, surplus: totalIncome - totalSpending }
    }, [monthly])

    // ====================== YEARLY HANDLERS ======================
    // Menghitung breakdown data tahunan
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

    // ====================== RENDER ======================
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
                    <MonthlyView
                        monthly={monthly}
                        onMonthClick={(m) => {
                            setSelectedMonth(m)
                            setOpenMonthDialog(true)
                        }}
                        onViewAllClick={openDialogForMonthAll}
                        onSliceClick={handleSliceClick}
                    />
                )}

                {tabValue === 1 && (
                    <SemesterView
                        semesterData={semesterData}
                        onSemesterZoom={handleSemesterZoom}
                    />
                )}

                {tabValue === 2 && (
                    <YearlyView
                        year={year}
                        yearlyData={yearlyData}
                        calcYearlyBreakdown={calcYearlyBreakdown}
                        onYearDetailClick={(type) => {
                            setYearDetailType(type)
                            setOpenYearDetail(true)
                        }}
                        onCategoryClick={handleYearlyCategoryClick}
                    />
                )}
            </main>

            {/* ========== DIALOG BULAN (CHART BESAR) ========== */}
            <MonthDetailDialog
                open={openMonthDialog}
                onClose={() => setOpenMonthDialog(false)}
                selectedMonth={selectedMonth}
                year={year}
                monthly={monthly}
                pieOption={pieOption}
                createPieEvents={createPieEvents}
            />

            {/* ========== DIALOG DETAIL (LIST TRANSAKSI) ========== */}
            <TransactionDetailDialog
                open={openDetail}
                onClose={() => setOpenDetail(false)}
                title={detailTitle}
                list={detailList}
                type={detailType}
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
                paginatedList={paginatedList}
                onMedicineClick={handleClickSpendingObat}
            />

            {/* ========== DIALOG DETAIL OBAT (DENGAN PAGINATION) ========== */}
            <MedicineDetailDialog
                open={openMedicine}
                onClose={() => setOpenMedicine(false)}
                spendingName={selectedSpendingItem?.name_spending}
                loading={loadingMedicine}
                list={medicineList}
                page={medPage}
                totalPages={medTotalPages}
                onPageChange={setMedPage}
                currentData={medCurrentData}
            />

            {/* ========== DIALOG SEMESTER DETAIL (ZOOM BESAR) ========== */}
            <SemesterDetailDialog
                open={openSemesterDetail}
                onClose={() => setOpenSemesterDetail(false)}
                type={semesterDetailType}
                index={semesterIndex}
                semesterData={semesterData}
                onSliceClick={handleSemesterClick}
            />

            {/* ========== DIALOG YEARLY DETAIL (ZOOM BESAR) ========== */}
            <YearDetailDialog
                open={openYearDetail}
                onClose={() => setOpenYearDetail(false)}
                type={yearDetailType}
                year={year}
                yearlyData={yearlyData}
                calcYearlyBreakdown={calcYearlyBreakdown}
                onCategoryClick={handleYearlyCategoryClick}
            />

        </div>
    )
}
