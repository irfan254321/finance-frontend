"use client"

import Footer from "../../../../../components/footer"
import { useEffect, useMemo, useState } from "react"
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
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"

interface Income {
  id: number
  name_income: string
  amount_income: number
  category_id: number
  date_income: string
  created_at: string
}

export default function IncomeLogin() {
  const params = useParams()
  const year = params.year as string
  const [data, setData] = useState<Income[]>([])
  const [dataMonth, setDataMonth] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [chartSize, setChartSize] = useState({ width: 1500, height: 480 })

  const [totalYear, setTotalYear] = useState<number>(0)
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null)

  // 📏 Resize responsif
  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth
      const baseWidth = Math.min(screenWidth * 0.85, 1400)
      const width = selectedMonth ? Math.min(screenWidth * 0.9, 1600) : baseWidth
      const height = selectedMonth ? Math.max(520, width * 0.45) : Math.max(400, baseWidth * 0.4)
      setChartSize({ width, height })
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [selectedMonth])

  // 🔹 Fetch data
  useEffect(() => {
    if (!year) return

    const map: Record<number, string> = {
      1: "klaimBPJS",
      2: "pasienUmum",
      3: "bungaDeposito",
      4: "kerjaSamaSewa",
    }

    const monthly: Record<string, any> = {}

    axiosInstance.get<Income[]>(`/api/income/${year}`).then((res) => {
      let total = 0
      res.data.forEach((d) => {
        total += d.amount_income
        const m = new Date(d.date_income).getMonth() + 1
        const key = map[d.category_id]
        if (!monthly[m]) {
          monthly[m] = { klaimBPJS: 0, pasienUmum: 0, bungaDeposito: 0, kerjaSamaSewa: 0 }
        }
        if (key) monthly[m][key] += d.amount_income
      })

      const sorted = Object.entries(monthly)
        .sort((a, b) => Number(a[0]) - Number(b[0]))
        .map(([num, val]) => ({
          month: new Date(Number(year) || 2024, Number(num) - 1).toLocaleString("id-ID", {
            month: "short",
          }),
          ...val,
        }))

      setTotalYear(total)
      setData(res.data)
      setDataMonth(sorted)
    })
  }, [year])

  // 🔹 Zoom bulan
  const displayedData = useMemo(() => {
    if (!selectedMonth) return dataMonth
    return dataMonth.filter((m) => m.month === selectedMonth)
  }, [dataMonth, selectedMonth])

  // 🔹 Klik bar chart
  const handleBarClick = (paramsEvt: any) => {
    const monthIndex = paramsEvt?.dataIndex
    const seriesName = paramsEvt?.seriesName as string

    const nameToKey: Record<string, string> = {
      "Klaim BPJS": "klaimBPJS",
      "Pasien Umum": "pasienUmum",
      "Bunga Deposito": "bungaDeposito",
      "Kerja Sama & Sewa": "kerjaSamaSewa",
    }

    const keyToCatId: Record<string, number> = {
      klaimBPJS: 1,
      pasienUmum: 2,
      bungaDeposito: 3,
      kerjaSamaSewa: 4,
    }

    const categoryKey = nameToKey[seriesName]
    if (!categoryKey) return

    const categoryId = keyToCatId[categoryKey]
    const monthName = dataMonth[monthIndex]?.month

    const filtered = data.filter((d) => {
      const m = new Date(d.date_income).getMonth() + 1
      return m === monthIndex + 1 && d.category_id === categoryId
    })

    setSelectedItem({ month: monthName, category: seriesName, details: filtered })
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setSelectedItem(null)
  }

  // ===================== ECHARTS =====================
  const barOption = (rows: any[]) => {
    const colors = ["#4FC3F7", "#FFD54F", "#BA68C8", "#81C784"]
    const formatRp = (n: number) =>
      "Rp " + (n || 0).toLocaleString("id-ID", { maximumFractionDigits: 0 })

    return {
      backgroundColor: "transparent",
      animationDuration: 700,
      animationEasing: "cubicOut",
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        backgroundColor: "rgba(20,20,30,0.9)",
        borderColor: "rgba(255,215,0,0.4)",
        borderWidth: 1,
        textStyle: { color: "#F4E1C1" },
        formatter: (params: any[]) => {
          if (!params?.length) return ""
          const title = params[0].axisValue
          const lines = params
            .map((p) => {
              const marker = p.marker || "•"

              // ✅ Ambil langsung dari source berdasarkan nama series
              const val =
                rows[p.dataIndex]?.[
                p.seriesName === "Klaim BPJS"
                  ? "klaimBPJS"
                  : p.seriesName === "Pasien Umum"
                    ? "pasienUmum"
                    : p.seriesName === "Bunga Deposito"
                      ? "bungaDeposito"
                      : p.seriesName === "Kerja Sama & Sewa"
                        ? "kerjaSamaSewa"
                        : ""
                ] ?? 0

              return `${marker} <b>${p.seriesName}</b>: Rp ${Number(val).toLocaleString("id-ID")}`
            })
            .join("<br/>")
          return `<div style="margin-bottom:4px"><b>${title}</b></div>${lines}`
        },
        confine: true,
      },
      legend: {
        top: 0,
        textStyle: { color: "#F4E1C1", fontSize: 14, fontWeight: 600 },
        itemWidth: 16,
        itemHeight: 10,
      },
      grid: { top: 60, left: 60, right: 30, bottom: 60, containLabel: true },
      xAxis: {
        type: "category",
        axisLabel: { color: "#F4E1C1", fontSize: 12 },
        axisLine: { lineStyle: { color: "rgba(255,215,0,0.35)" } },
      },
      yAxis: {
        type: "value",
        axisLabel: {
          color: "#F4E1C1",
          formatter: (v: number) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v),
        },
        splitLine: { lineStyle: { color: "rgba(255,215,0,0.15)" } },
      },
      dataset: {
        dimensions: ["month", "klaimBPJS", "pasienUmum", "bungaDeposito", "kerjaSamaSewa"],
        source: rows,
      },
      series: [
        { name: "Klaim BPJS", type: "bar", itemStyle: glossyBar(colors[0]), encode: { x: "month", y: "klaimBPJS" } },
        { name: "Pasien Umum", type: "bar", itemStyle: glossyBar(colors[1]), encode: { x: "month", y: "pasienUmum" } },
        { name: "Bunga Deposito", type: "bar", itemStyle: glossyBar(colors[2]), encode: { x: "month", y: "bungaDeposito" } },
        { name: "Kerja Sama & Sewa", type: "bar", itemStyle: glossyBar(colors[3]), encode: { x: "month", y: "kerjaSamaSewa" } },
      ],
    } as echarts.EChartsOption
  }

  function glossyBar(color: string) {
    return {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color },
        { offset: 0.5, color: shade(color, -10) },
        { offset: 1, color: shade(color, -25) },
      ]),
      borderRadius: [6, 6, 0, 0],
      shadowColor: "rgba(0,0,0,0.25)",
      shadowBlur: 6,
      shadowOffsetY: 3,
    }
  }

  function shade(hex: string, percent: number) {
    const f = parseInt(hex.slice(1), 16),
      t = percent < 0 ? 0 : 255,
      p = Math.abs(percent) / 100,
      R = f >> 16,
      G = (f >> 8) & 0x00ff,
      B = f & 0x0000ff
    const to = (c: number) => Math.round((t - c) * p) + c
    return `#${(0x1000000 + (to(R) << 16) + (to(G) << 8) + to(B)).toString(16).slice(1)}`
  }

  const chartEvents = { click: handleBarClick }

  // ===================== RENDER =====================
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#1a2732] via-[#2C3E50] to-[#1a2732] text-white overflow-hidden">
      <main className="flex-1 flex flex-col items-center justify-center px-10 pt-40">
        <div className="w-full max-w-[1500px] bg-gradient-to-br from-[#2b3b4b]/90 to-[#1f2a36]/85 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/10 p-10 flex flex-col items-center">
          <h1 className="text-4xl font-bold text-[#F4E1C1] text-center mb-6 drop-shadow-md">
            <span className="text-yellow-400">Laporan Pendapatan Tahunan</span>
            <br /> Rumah Sakit Bhayangkara M. Hasan Palembang {year}
          </h1>

          <p className="text-2xl font-bold text-[#F4E1C1] mb-6">
            💰 Total Pendapatan Tahun {year}:{" "}
            <span className="text-yellow-400 ml-2">Rp {totalYear.toLocaleString("id-ID")}</span>
          </p>

          {dataMonth.length === 0 ? (
            <p className="py-10 text-gray-300 animate-pulse">Memuat data...</p>
          ) : (
            <div className="flex flex-col items-center w-full px-4">
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                {dataMonth.map((m: any) => (
                  <button
                    key={m.month}
                    onClick={() => setSelectedMonth(m.month)}
                    className={`px-3 py-1 rounded-full border text-sm transition ${selectedMonth === m.month
                      ? "bg-yellow-500/20 border-yellow-400 text-yellow-300"
                      : "bg-[#2C3E50]/60 border-[#F4E1C1]/20 text-[#F4E1C1]/90 hover:bg-[#34495E]/70"
                      }`}
                    title={`Fokuskan ke bulan ${m.month}`}
                  >
                    {m.month}
                  </button>
                ))}
              </div>

              {selectedMonth && (
                <button
                  onClick={() => setSelectedMonth(null)}
                  className="mb-4 px-4 py-2 rounded-lg bg-[#34495E] hover:bg-[#2C3E50] border border-[#F4E1C1]/20 text-[#F4E1C1] transition"
                >
                  🔙 Tampilkan Semua Bulan
                </button>
              )}

              <div className="flex justify-center w-full">
                <ReactECharts
                  option={barOption(displayedData)}
                  style={{ width: chartSize.width, height: chartSize.height }}
                  onEvents={chartEvents}
                  opts={{ renderer: "svg" }}
                />
              </div>
            </div>
          )}
        </div>

        {/* 💬 Dialog */}
        <Dialog
          open={open}
          onClose={handleClose}
          sx={{
            "& .MuiBackdrop-root": {
              backdropFilter: "blur(20px)",
              backgroundColor: "rgba(0,0,0,0.55)",
            },
            "& .MuiPaper-root": {
              width: "85vw",
              maxWidth: "1600px",
              height: "auto",
              maxHeight: "90vh",
              borderRadius: "28px",
              background: "rgba(25, 30, 40, 0.95)",
              border: "1px solid rgba(255,215,0,0.2)",
              boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
              color: "white",
              paddingBottom: "2rem",
              overflow: "visible",
            },
          }}
        >
          <DialogTitle>
            <div className="flex justify-between items-center">
              <p className="font-bold text-2xl text-yellow-400 capitalize">
                {selectedItem?.category} — {selectedItem?.month}
              </p>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </div>
          </DialogTitle>
          <Divider sx={{ borderColor: "rgba(255,215,0,0.2)" }} />
          <DialogContent className="px-10 py-8">
            {selectedItem?.details?.length > 0 ? (
              <PaginationList details={selectedItem.details} />
            ) : (
              <div className="text-gray-400 text-center py-10">🚫 Tidak ada data detail.</div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}

/* 🔹 Komponen PaginationList */
function PaginationList({ details }: { details: Income[] }) {
  const [page, setPage] = useState(1)
  const itemsPerPage = 8
  const totalPages = Math.ceil(details.length / itemsPerPage)
  const slice = details.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  return (
    <div className="flex flex-col gap-6">
      <ul className="space-y-4">
        {slice.map((d) => (
          <li key={d.id} className="p-5 rounded-xl bg-[#2C3E50]/70 hover:bg-[#34495E]/70 border border-[#F4E1C1]/10 transition shadow">
            <div className="flex justify-between">
              <div>
                <p className="font-semibold text-[#FFD54F]">{d.name_income}</p>
                <p className="text-gray-400 text-sm">
                  {new Date(d.date_income).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <p className="text-[#F4E1C1] font-bold">Rp {d.amount_income.toLocaleString("id-ID")}</p>
            </div>
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <div className="flex justify-between items-center pt-4 border-t border-[#F4E1C1]/20">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`px-5 py-2 rounded-lg transition ${page === 1
              ? "bg-gray-700 text-gray-400"
              : "bg-[#2C3E50] hover:bg-[#34495E] text-[#F4E1C1]"
              }`}
          >
            ⬅️ Sebelumnya
          </button>
          <p className="text-[#F4E1C1]/80 text-sm">
            Halaman {page} dari {totalPages}
          </p>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className={`px-5 py-2 rounded-lg transition ${page === totalPages
              ? "bg-gray-700 text-gray-400"
              : "bg-[#2C3E50] hover:bg-[#34495E] text-[#F4E1C1]"
              }`}
          >
            Selanjutnya ➡️
          </button>
        </div>
      )}
    </div>
  )
}
