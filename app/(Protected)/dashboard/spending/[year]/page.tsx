"use client"

import Footer from "../../../../../components/footer"
import { useEffect, useState } from "react"
import axiosInstance from "@/lib/axiosInstance"
import { useParams } from "next/navigation"
import ReactECharts from "echarts-for-react"
import * as echarts from "echarts"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Divider,
  CircularProgress,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import { Spending, Medicine } from "@/app/(Protected)/dashboard/mixture/[year]/components/types"
import Transition from "@/components/ui/Transition"

export default function SpendingDashboard() {
  const params = useParams()
  const year = params.year as string
  const [data, setData] = useState<Spending[]>([])
  const [dataMonth, setDataMonth] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [chartSize, setChartSize] = useState({ width: 1800, height: 600 })

  // 🔹 Dialog kedua (Detail Obat)
  const [openMedicine, setOpenMedicine] = useState(false)
  const [medicineList, setMedicineList] = useState<Medicine[]>([])
  const [selectedSpending, setSelectedSpending] = useState<Spending | null>(null)
  const [loadingMedicine, setLoadingMedicine] = useState(false)

  // 📏 Resize responsif - LEBIH BESAR
  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth
      const width = Math.min(screenWidth * 0.95, 2000)
      const height = Math.max(600, Math.round(width * 0.45))
      setChartSize({ width, height })
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // 🔹 Ambil data API Spending
  useEffect(() => {
    if (!year) return

    const map: Record<number, string> = {
      4: "operasional",
      5: "pemeliharaan",
      6: "pendukung",
      7: "honor",
      8: "jasaMedis",
      9: "obat",
      10: "peralatan",
    }

    const monthly: Record<string, any> = {}

    axiosInstance.get<Spending[]>(`/api/spending/${year}`).then((res) => {
      res.data.forEach((d) => {
        const m = new Date(d.date_spending).getMonth() + 1
        const key = map[d.category_id]
        if (!monthly[m]) {
          monthly[m] = {
            operasional: 0,
            pemeliharaan: 0,
            pendukung: 0,
            honor: 0,
            jasaMedis: 0,
            obat: 0,
            peralatan: 0,
          }
        }
        if (key) monthly[m][key] += d.amount_spending
      })

      const sorted = Object.entries(monthly)
        .sort((a, b) => Number(a[0]) - Number(b[0]))
        .map(([num, val]) => ({
          month: new Date(2024, Number(num) - 1).toLocaleString("id-ID", { month: "long" }),
          ...val,
        }))

      setData(res.data)
      setDataMonth(sorted)
    })
  }, [year])

  // 🔹 Klik bar chart (ECharts)
  const handleBarClick = (paramsEvt: any) => {
    // paramsEvt: { seriesName, dataIndex, ... }
    const monthIndex = paramsEvt?.dataIndex
    const seriesName = paramsEvt?.seriesName as string

    const nameToKey: Record<string, string> = {
      Operasional: "operasional",
      Pemeliharaan: "pemeliharaan",
      Pendukung: "pendukung",
      "Honor Pegawai": "honor",
      "Jasa Medis": "jasaMedis",
      "Obat (Bekal Kesehatan)": "obat",
      "Peralatan & Mesin": "peralatan",
    }

    const keyToCatId: Record<string, number> = {
      operasional: 4,
      pemeliharaan: 5,
      pendukung: 6,
      honor: 7,
      jasaMedis: 8,
      obat: 9,
      peralatan: 10,
    }

    const categoryKey = nameToKey[seriesName]
    if (categoryKey == null) return

    const categoryId = keyToCatId[categoryKey]
    const monthName = dataMonth[monthIndex]?.month

    const filtered = data.filter((d) => {
      const m = new Date(d.date_spending).getMonth() + 1
      // samakan monthIndex (0-based) dengan bulan (1-based)
      return m === monthIndex + 1 && d.category_id === categoryId
    })

    setSelectedItem({ month: monthName, category: categoryKey, details: filtered })
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setSelectedItem(null)
  }

  // 🔹 Ambil detail obat berdasarkan spending_id
  const handleClickSpending = async (item: Spending) => {
    if (item.category_id !== 9) return // hanya kategori obat

    try {
      setLoadingMedicine(true)
      const res = await axiosInstance.post("/api/spendingMedicineBySpendingId", {
        detail_spending_id: item.id,
      })
      setMedicineList(res.data)
      setSelectedSpending(item)
      setOpenMedicine(true)
    } catch (err) {
      console.error(err)
      alert("Gagal memuat detail obat!")
    } finally {
      setLoadingMedicine(false)
    }
  }

  // ===================== ECHARTS: OPTION =====================
  const barOption = (rows: any[]) => {
    // warna sesuai palet kamu
    const colors = [
      "#4FC3F7", // Operasional
      "#FFD54F", // Pemeliharaan
      "#BA68C8", // Pendukung
      "#81C784", // Honor
      "#E57373", // Jasa Medis
      "#4DB6AC", // Obat
      "#9575CD", // Peralatan
    ]

    return {
      backgroundColor: "transparent",
      animationDuration: 1000,
      animationEasing: "cubicOut",
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        backgroundColor: "rgba(20,20,30,0.95)",
        borderColor: "rgba(255,215,0,0.5)",
        borderWidth: 2,
        textStyle: { color: "#F4E1C1", fontSize: 16 },
        padding: 16,
        formatter: (params: any[]) => {
          if (!params?.length) return ""
          const title = params[0].axisValue
          const formatRp = (n: number) =>
            "Rp " + (n || 0).toLocaleString("id-ID", { maximumFractionDigits: 0 })

          const lines = params
            .map((p) => {
              const marker = p.marker || "•"
              // 🔥 Ambil data asli dari dataMonth
              const row = rows[p.dataIndex]
              let key = ""

              // mapping nama seri ke key di dataset
              switch (p.seriesName) {
                case "Operasional":
                  key = "operasional"
                  break
                case "Pemeliharaan":
                  key = "pemeliharaan"
                  break
                case "Pendukung":
                  key = "pendukung"
                  break
                case "Honor Pegawai":
                  key = "honor"
                  break
                case "Jasa Medis":
                  key = "jasaMedis"
                  break
                case "Obat (Bekal Kesehatan)":
                  key = "obat"
                  break
                case "Peralatan & Mesin":
                  key = "peralatan"
                  break
                default:
                  key = ""
              }

              const val = key && row ? row[key] : 0
              return `<div style="display:flex; justify-content:space-between; gap:20px; margin-top:4px">
                        <span>${marker} ${p.seriesName}</span>
                        <span style="font-weight:bold; color:#FFD970">${formatRp(val)}</span>
                      </div>`
            })
            .join("")

          return `<div style="margin-bottom:8px; font-size:18px; font-weight:bold; border-bottom:1px solid rgba(255,255,255,0.2); padding-bottom:4px">${title}</div>${lines}`
        },
        confine: true,
      },

      legend: {
        top: 0,
        textStyle: { color: "#F4E1C1", fontSize: 16, fontWeight: "bold" },
        itemWidth: 20,
        itemHeight: 14,
        itemGap: 20,
      },
      grid: {
        top: 80,
        left: 80,
        right: 40,
        bottom: 80,
        containLabel: true,
      },
      xAxis: {
        type: "category",
        axisLabel: { color: "#F4E1C1", fontSize: 14, fontWeight: "bold", margin: 16 },
        axisLine: { lineStyle: { color: "rgba(255,215,0,0.4)", width: 2 } },
        axisTick: { show: false },
      },
      yAxis: {
        type: "value",
        axisLabel: {
          color: "#F4E1C1",
          fontSize: 14,
          fontWeight: "bold",
          formatter: (v: number) => (v >= 1000000000 ? `${(v / 1000000000).toFixed(1)}M` : v >= 1000000 ? `${(v / 1000000).toFixed(0)}jt` : v),
        },
        splitLine: { lineStyle: { color: "rgba(255,215,0,0.1)", width: 1 } },
      },
      dataset: {
        dimensions: [
          "month",
          "operasional",
          "pemeliharaan",
          "pendukung",
          "honor",
          "jasaMedis",
          "obat",
          "peralatan",
        ],
        source: rows,
      },
      series: [
        {
          name: "Operasional",
          type: "bar",
          itemStyle: glossyBar(colors[0]),
          emphasis: { focus: "series", itemStyle: { shadowColor: "rgba(255,215,0,0.6)", shadowBlur: 12 } },
          barGap: "10%",
          barCategoryGap: "25%",
          encode: { x: "month", y: "operasional" },
        },
        {
          name: "Pemeliharaan",
          type: "bar",
          itemStyle: glossyBar(colors[1]),
          emphasis: { focus: "series", itemStyle: { shadowColor: "rgba(255,215,0,0.6)", shadowBlur: 12 } },
          encode: { x: "month", y: "pemeliharaan" },
        },
        {
          name: "Pendukung",
          type: "bar",
          itemStyle: glossyBar(colors[2]),
          emphasis: { focus: "series", itemStyle: { shadowColor: "rgba(255,215,0,0.6)", shadowBlur: 12 } },
          encode: { x: "month", y: "pendukung" },
        },
        {
          name: "Honor Pegawai",
          type: "bar",
          itemStyle: glossyBar(colors[3]),
          emphasis: { focus: "series", itemStyle: { shadowColor: "rgba(255,215,0,0.6)", shadowBlur: 12 } },
          encode: { x: "month", y: "honor" },
        },
        {
          name: "Jasa Medis",
          type: "bar",
          itemStyle: glossyBar(colors[4]),
          emphasis: { focus: "series", itemStyle: { shadowColor: "rgba(255,215,0,0.6)", shadowBlur: 12 } },
          encode: { x: "month", y: "jasaMedis" },
        },
        {
          name: "Obat (Bekal Kesehatan)",
          type: "bar",
          itemStyle: glossyBar(colors[5]),
          emphasis: { focus: "series", itemStyle: { shadowColor: "rgba(255,215,0,0.6)", shadowBlur: 12 } },
          encode: { x: "month", y: "obat" },
        },
        {
          name: "Peralatan & Mesin",
          type: "bar",
          itemStyle: glossyBar(colors[6]),
          emphasis: { focus: "series", itemStyle: { shadowColor: "rgba(255,215,0,0.6)", shadowBlur: 12 } },
          encode: { x: "month", y: "peralatan" },
        },
      ],
    } as echarts.EChartsOption
  }

  // efek glossy 3D-look halus
  function glossyBar(color: string) {
    return {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color },
        { offset: 0.5, color: shade(color, -10) },
        { offset: 1, color: shade(color, -25) },
      ]),
      borderRadius: [8, 8, 0, 0],
      shadowColor: "rgba(0,0,0,0.4)",
      shadowBlur: 10,
      shadowOffsetY: 4,
    }
  }

  function shade(hex: string, percent: number) {
    // simple shade for hex color
    const f = parseInt(hex.slice(1), 16),
      t = percent < 0 ? 0 : 255,
      p = Math.abs(percent) / 100,
      R = f >> 16,
      G = (f >> 8) & 0x00ff,
      B = f & 0x0000ff
    const to = (c: number) => Math.round((t - c) * p) + c
    return `#${(0x1000000 + (to(R) << 16) + (to(G) << 8) + to(B)).toString(16).slice(1)}`
  }

  // onEvents untuk klik bar
  const chartEvents = {
    click: handleBarClick,
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#1a2732] via-[#2C3E50] to-[#1a2732] text-white overflow-x-hidden">
      <main className="flex-1 flex flex-col items-center justify-start px-4 md:px-8 pt-32 pb-20 w-full">
        
        {/* Container Utama - Diperlebar */}
        <div className="w-full max-w-[95vw] bg-gradient-to-br from-[#2b3b4b]/95 to-[#1f2a36]/90 backdrop-blur-xl rounded-[40px] shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 p-8 md:p-12 flex flex-col items-center">
          
          {/* Header - Diperbesar */}
          <h1 className="text-4xl md:text-6xl font-extrabold text-[#F4E1C1] text-center mb-12 drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD54F] to-[#F4E1C1]">Laporan Pengeluaran Tahunan</span>
            <br /> 
            <span className="text-2xl md:text-4xl font-serif font-normal mt-4 block text-[#EBD77A]/90">
              Rumah Sakit Bhayangkara M. Hasan Palembang {year}
            </span>
          </h1>

          {dataMonth.length === 0 ? (
            <div className="py-20 flex flex-col items-center gap-4">
              <div className="w-16 h-16 border-4 border-[#FFD54F] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xl text-[#F4E1C1]/70 animate-pulse">Sedang memuat data...</p>
            </div>
          ) : (
            <div className="flex justify-center w-full overflow-x-auto pb-4">
              <ReactECharts
                option={barOption(dataMonth)}
                style={{ width: chartSize.width, height: chartSize.height }}
                onEvents={chartEvents}
                opts={{ renderer: "svg" }}
              />
            </div>
          )}
        </div>

        {/* 🧾 Dialog Utama */}
        <Dialog 
          open={open} 
          onClose={handleClose}
          TransitionComponent={Transition}
          sx={{
            "& .MuiBackdrop-root": {
              backdropFilter: "blur(15px)",
              backgroundColor: "rgba(0,0,0,0.7)",
            },
            "& .MuiPaper-root": {
              width: "90vw",
              maxWidth: "1400px",
              borderRadius: "32px",
              background: "linear-gradient(145deg, rgba(25, 30, 40, 0.98), rgba(35, 45, 55, 0.98))",
              border: "1px solid rgba(255,215,0,0.3)",
              boxShadow: "0 25px 60px rgba(0,0,0,0.7)",
              color: "white",
              padding: "0",
              overflow: "hidden",
            },
          }}
        >
          <DialogTitle className="bg-[#1a2732]/50 p-6 border-b border-[#F4E1C1]/10">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="h-10 w-2 bg-[#FFD54F] rounded-full"></div>
                <div>
                  <p className="font-bold text-3xl text-[#FFD54F] capitalize tracking-wide">
                    {selectedItem?.category}
                  </p>
                  <p className="text-[#F4E1C1]/70 text-lg">
                    Detail Pengeluaran Bulan {selectedItem?.month}
                  </p>
                </div>
              </div>
              <IconButton 
                onClick={handleClose}
                className="!text-[#F4E1C1] hover:!bg-white/10 !p-2 !border !border-[#F4E1C1]/20"
              >
                <CloseIcon fontSize="large" />
              </IconButton>
            </div>
          </DialogTitle>
          
          <DialogContent className="p-8 bg-[#1a2732]/30">
            {selectedItem?.details?.length > 0 ? (
              <PaginationList details={selectedItem.details} onClickSpending={handleClickSpending} />
            ) : (
              <div className="text-[#F4E1C1]/50 text-center py-20 text-xl italic">
                🚫 Tidak ada data detail.
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* 💊 Dialog Detail Obat */}
        <Dialog 
          open={openMedicine} 
          onClose={() => setOpenMedicine(false)}
          TransitionComponent={Transition}
          sx={{
            "& .MuiBackdrop-root": {
              backdropFilter: "blur(10px)",
              backgroundColor: "rgba(0,0,0,0.6)",
            },
            "& .MuiPaper-root": {
              width: "80vw",
              maxWidth: "1000px",
              borderRadius: "24px",
              background: "linear-gradient(145deg, rgba(25, 30, 40, 0.98), rgba(35, 45, 55, 0.98))",
              border: "1px solid rgba(77, 182, 172, 0.3)", // Warna obat
              boxShadow: "0 25px 60px rgba(0,0,0,0.7)",
              color: "white",
              padding: "0",
              overflow: "hidden",
            },
          }}
        >
          <DialogTitle className="bg-[#1a2732]/50 p-6 border-b border-[#4DB6AC]/20">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="h-10 w-2 bg-[#4DB6AC] rounded-full"></div>
                <div>
                  <p className="font-bold text-2xl text-[#4DB6AC]">
                    Detail Obat
                  </p>
                  <p className="text-[#F4E1C1]/70 text-base">
                    {selectedSpending?.name_spending}
                  </p>
                </div>
              </div>
              <IconButton onClick={() => setOpenMedicine(false)} className="!text-[#F4E1C1]">
                <CloseIcon />
              </IconButton>
            </div>
          </DialogTitle>
          
          <DialogContent className="p-8 bg-[#1a2732]/30">
            {loadingMedicine ? (
              <div className="flex justify-center items-center py-20">
                <CircularProgress sx={{ color: "#4DB6AC" }} />
                <span className="ml-4 text-[#4DB6AC] text-lg">Memuat data obat...</span>
              </div>
            ) : medicineList.length > 0 ? (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {medicineList.map((m) => (
                  <li key={m.medicine_id} className="p-5 rounded-xl bg-[#2C3E50]/60 border border-[#4DB6AC]/20 hover:bg-[#34495E]/80 transition-all">
                    <div className="flex justify-between items-center">
                      <p className="font-bold text-[#4DB6AC] text-lg">{m.name_medicine}</p>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-white">
                          {m.quantity}
                        </p>
                        <p className="text-[#F4E1C1]/60 text-sm">{m.name_unit || "Unit"}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[#F4E1C1]/50 text-center py-10 italic">🚫 Tidak ada data obat untuk transaksi ini.</p>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}

/* 🔹 Komponen PaginationList - Diperbesar */
function PaginationList({
  details,
  onClickSpending,
}: {
  details: Spending[]
  onClickSpending: (item: Spending) => void
}) {
  const [page, setPage] = useState(1)
  const itemsPerPage = 6
  const totalPages = Math.ceil(details.length / itemsPerPage)
  const slice = details.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  const formatRp = (n: number) => "Rp " + (n || 0).toLocaleString("id-ID", { maximumFractionDigits: 0 })

  return (
    <div className="flex flex-col gap-8 h-full">
      <ul className="grid grid-cols-1 gap-4">
        {slice.map((d) => (
          <li
            key={d.id}
            onClick={() => onClickSpending(d)}
            className={`p-6 rounded-2xl bg-[#2C3E50]/60 hover:bg-[#34495E]/80 border border-[#F4E1C1]/10 transition-all duration-300 shadow-lg hover:shadow-[#FFD54F]/10 hover:scale-[1.01] cursor-pointer group ${
              d.category_id === 9 ? "hover:border-[#4DB6AC]/50" : ""
            }`}
            title={d.category_id === 9 ? "Klik untuk lihat detail obat" : undefined}
          >
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <p className="font-bold text-xl text-[#FFD54F] group-hover:text-[#FFCA28] transition-colors">
                    {d.name_spending}
                  </p>
                  {d.category_id === 9 && (
                    <span className="bg-[#4DB6AC]/20 text-[#4DB6AC] text-xs px-2 py-1 rounded-full border border-[#4DB6AC]/30">
                      💊 Obat
                    </span>
                  )}
                </div>
                <p className="text-[#F4E1C1]/60 text-base flex items-center gap-2">
                  📅 {new Date(d.date_spending).toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-extrabold text-[#F4E1C1] group-hover:text-white transition-colors">
                  {formatRp(d.amount_spending)}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <div className="flex justify-between items-center pt-6 border-t border-[#F4E1C1]/20 mt-auto">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`px-6 py-3 rounded-xl font-bold text-lg transition-all ${page === 1
              ? "bg-gray-700/50 text-gray-500 cursor-not-allowed"
              : "bg-[#2C3E50] hover:bg-[#34495E] text-[#F4E1C1] shadow-lg"
              }`}
          >
            ⬅️ Sebelumnya
          </button>
          <span className="text-[#F4E1C1] font-semibold text-lg bg-[#1a2732] px-4 py-2 rounded-lg border border-[#F4E1C1]/10">
            Halaman <span className="text-[#FFD54F]">{page}</span> dari {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className={`px-6 py-3 rounded-xl font-bold text-lg transition-all ${page === totalPages
              ? "bg-gray-700/50 text-gray-500 cursor-not-allowed"
              : "bg-[#2C3E50] hover:bg-[#34495E] text-[#F4E1C1] shadow-lg"
              }`}
          >
            Selanjutnya ➡️
          </button>
        </div>
      )}
    </div>
  )
}
