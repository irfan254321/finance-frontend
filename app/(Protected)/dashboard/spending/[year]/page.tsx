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

interface Spending {
  id: number
  name_spending: string
  amount_spending: number
  category_id: number
  date_spending: string
  created_at: string
}

interface Medicine {
  medicine_id: number
  name_medicine: string
  quantity: number
  name_unit?: string
  created_at: string
}

export default function SpendingDashboard() {
  const params = useParams()
  const year = params.year as string
  const [data, setData] = useState<Spending[]>([])
  const [dataMonth, setDataMonth] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [chartSize, setChartSize] = useState({ width: 1500, height: 480 })

  // 🔹 Dialog kedua (Detail Obat)
  const [openMedicine, setOpenMedicine] = useState(false)
  const [medicineList, setMedicineList] = useState<Medicine[]>([])
  const [selectedSpending, setSelectedSpending] = useState<Spending | null>(null)
  const [loadingMedicine, setLoadingMedicine] = useState(false)

  // 📏 Resize responsif
  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth
      const width = Math.min(screenWidth * 0.85, 1400)
      const height = Math.max(400, Math.round(width * 0.4))
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
          month: new Date(2024, Number(num) - 1).toLocaleString("id-ID", { month: "short" }),
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

    // tooltip formatter rupiah
    const formatRp = (n: number) => "Rp " + (n || 0).toLocaleString("id-ID", { maximumFractionDigits: 0 })

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
              return `${marker} <b>${p.seriesName}</b>: ${formatRp(val)}`
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
      grid: {
        top: 60,
        left: 60,
        right: 30,
        bottom: 60,
        containLabel: true,
      },
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
          emphasis: {
            focus: "series",
            itemStyle: {
              shadowColor: "rgba(255,215,0,0.6)",
              shadowBlur: 12,
            },
          },

          barGap: "10%",
          barCategoryGap: "25%",
          encode: { x: "month", y: "operasional" },
        },
        {
          name: "Pemeliharaan",
          type: "bar",
          itemStyle: glossyBar(colors[1]),
          emphasis: {
            focus: "series",
            itemStyle: {
              shadowColor: "rgba(255,215,0,0.6)",
              shadowBlur: 12,
            },
          },

          encode: { x: "month", y: "pemeliharaan" },
        },
        {
          name: "Pendukung",
          type: "bar",
          itemStyle: glossyBar(colors[2]),
          emphasis: {
            focus: "series",
            itemStyle: {
              shadowColor: "rgba(255,215,0,0.6)",
              shadowBlur: 12,
            },
          },

          encode: { x: "month", y: "pendukung" },
        },
        {
          name: "Honor Pegawai",
          type: "bar",
          itemStyle: glossyBar(colors[3]),
          emphasis: {
            focus: "series",
            itemStyle: {
              shadowColor: "rgba(255,215,0,0.6)",
              shadowBlur: 12,
            },
          },

          encode: { x: "month", y: "honor" },
        },
        {
          name: "Jasa Medis",
          type: "bar",
          itemStyle: glossyBar(colors[4]),
          emphasis: {
            focus: "series",
            itemStyle: {
              shadowColor: "rgba(255,215,0,0.6)",
              shadowBlur: 12,
            },
          },

          encode: { x: "month", y: "jasaMedis" },
        },
        {
          name: "Obat (Bekal Kesehatan)",
          type: "bar",
          itemStyle: glossyBar(colors[5]),
          emphasis: {
            focus: "series",
            itemStyle: {
              shadowColor: "rgba(255,215,0,0.6)",
              shadowBlur: 12,
            },
          },

          encode: { x: "month", y: "obat" },
        },
        {
          name: "Peralatan & Mesin",
          type: "bar",
          itemStyle: glossyBar(colors[6]),
          emphasis: {
            focus: "series",
            itemStyle: {
              shadowColor: "rgba(255,215,0,0.6)",
              shadowBlur: 12,
            },
          },

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
      borderRadius: [6, 6, 0, 0],
      shadowColor: "rgba(0,0,0,0.25)",
      shadowBlur: 6,
      shadowOffsetY: 3,
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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#1a2732] via-[#2C3E50] to-[#1a2732] text-white overflow-hidden">
      <main className="flex-1 flex flex-col items-center justify-center px-10 pt-40">
        <div className="w-full max-w-[1500px] bg-gradient-to-br from-[#2b3b4b]/90 to-[#1f2a36]/85 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/10 p-10 flex flex-col items-center">
          <h1 className="text-4xl font-bold text-[#F4E1C1] text-center mb-6 drop-shadow-md">
            <span className="text-yellow-400">Laporan Pengeluaran Tahunan</span>
            <br /> Rumah Sakit Bhayangkara M. Hasan Palembang {year}
          </h1>

          {dataMonth.length === 0 ? (
            <p className="py-10 text-gray-300 animate-pulse">Memuat data...</p>
          ) : (
            <div className="flex justify-center w-full px-4">
              <ReactECharts
                option={barOption(dataMonth)}
                style={{ width: chartSize.width, height: chartSize.height }}
                onEvents={chartEvents}
                opts={{ renderer: "svg" }} // svg biar crisp; ganti ke 'canvas' kalau prefer performa
              />
            </div>
          )}
        </div>

        {/* 🧾 Dialog Utama */}
        <Dialog open={open} onClose={handleClose}>
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
          <Divider />
          <DialogContent className="px-10 py-8">
            {selectedItem?.details?.length > 0 ? (
              <PaginationList details={selectedItem.details} onClickSpending={handleClickSpending} />
            ) : (
              <div className="text-gray-400 text-center py-10">
                🚫 Tidak ada data detail.
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* 💊 Dialog Detail Obat */}
        <Dialog open={openMedicine} onClose={() => setOpenMedicine(false)}>
          <DialogTitle>
            <div className="flex justify-between items-center">
              <p className="font-bold text-2xl text-yellow-400">
                Detail Obat — {selectedSpending?.name_spending}
              </p>
              <IconButton onClick={() => setOpenMedicine(false)}>
                <CloseIcon />
              </IconButton>
            </div>
          </DialogTitle>
          <Divider />
          <DialogContent className="px-10 py-8">
            {loadingMedicine ? (
              <div className="flex justify-center items-center py-20">
                <CircularProgress sx={{ color: "#FFD700" }} />
                <span className="ml-4 text-[#FFD700]">Memuat data obat...</span>
              </div>
            ) : medicineList.length > 0 ? (
              <ul className="space-y-3">
                {medicineList.map((m) => (
                  <li key={m.medicine_id} className="p-4 rounded-lg bg-[#2C3E50]/70 border border-[#FFD54F]/10">
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
              <p className="text-gray-400 text-center py-10">🚫 Tidak ada data obat untuk transaksi ini.</p>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}

/* 🔹 Komponen PaginationList */
function PaginationList({
  details,
  onClickSpending,
}: {
  details: Spending[]
  onClickSpending: (item: Spending) => void
}) {
  const [page, setPage] = useState(1)
  const itemsPerPage = 8
  const totalPages = Math.ceil(details.length / itemsPerPage)
  const slice = details.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  const formatRp = (n: number) => "Rp " + (n || 0).toLocaleString("id-ID", { maximumFractionDigits: 0 })

  return (
    <div className="flex flex-col gap-6">
      <ul className="space-y-4">
        {slice.map((d) => (
          <li
            key={d.id}
            onClick={() => onClickSpending(d)}
            className={`p-5 rounded-xl bg-[#2C3E50]/70 hover:bg-[#34495E]/70 border border-[#F4E1C1]/10 transition shadow cursor-pointer ${d.category_id === 9 ? "hover:ring-2 hover:ring-[#FFD700]" : ""
              }`}
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
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <div className="flex justify-between items-center pt-4 border-t border-[#F4E1C1]/20">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`px-5 py-2 rounded-lg transition ${page === 1 ? "bg-gray-700 text-gray-400" : "bg-[#2C3E50] hover:bg-[#34495E] text-[#F4E1C1]"
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
