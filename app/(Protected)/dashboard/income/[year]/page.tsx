"use client"


import Footer from "../../../../../components/footer"
import { useEffect, useMemo, useState } from "react"
import axiosInstance from "@/lib/axiosInstance"
import { useParams } from "next/navigation"
import { BarChart } from "@mui/x-charts"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Divider,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"

interface income {
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
  const [data, setData] = useState<income[]>([])
  const [dataMonth, setDataMonth] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [chartSize, setChartSize] = useState({ width: 1500, height: 480 })

  // 🆕 Total tahunan
  const [totalYear, setTotalYear] = useState<number>(0)

  // 🆕 Zoom Bulan (Opsi A)
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null)

  // 📏 Resize otomatis
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

  // 🔹 Klik bar chart (tetap seperti semula)
  const handleBarClick = (_: any, item: any) => {
    const monthIndex = item.dataIndex
    const categoryKey = item.seriesId ?? item.seriesLabel ?? item.dataKey

    const mapId: Record<string, number> = {
      klaimBPJS: 1,
      pasienUmum: 2,
      bungaDeposito: 3,
      kerjaSamaSewa: 4,
    }

    const categoryId = mapId[categoryKey]
    const monthName = dataMonth[monthIndex]?.month
    const filtered = data.filter((d) => {
      const month = new Date(d.date_income).getMonth() + 1
      return month === monthIndex + 1 && d.category_id === categoryId
    })

    setSelectedItem({ month: monthName, category: categoryKey, details: filtered })
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setSelectedItem(null)
  }

  // 🔹 Ambil data API (tetap, + hitung total tahunan)
  useEffect(() => {
    if (!year) return

    const map: Record<number, string> = {
      1: "klaimBPJS",
      2: "pasienUmum",
      3: "bungaDeposito",
      4: "kerjaSamaSewa",
    }

    const monthly: Record<string, any> = {}

    axiosInstance.get<income[]>(`/api/income/${year}`).then((res) => {
      let total = 0

      res.data.forEach((d) => {
        total += d.amount_income
        const m = new Date(d.date_income).getMonth() + 1
        const key = map[d.category_id]
        if (!monthly[m]) {
          monthly[m] = { klaimBPJS: 0, pasienUmum: 0, bungaDeposito: 0, kerjaSamaSewa: 0 }
        }
        monthly[m][key as keyof typeof monthly[string]] += d.amount_income
      })

      const sorted = Object.entries(monthly)
        .sort((a, b) => Number(a[0]) - Number(b[0]))
        .map(([num, val]) => ({
          month: new Date(Number(year) || 2024, Number(num) - 1).toLocaleString("id-ID", { month: "short" }),
          ...val,
        }))

      setTotalYear(total) // 🆕 total tahunan
      setData(res.data)
      setDataMonth(sorted)
    })
  }, [year])

  // 🆕 Dataset yang ditampilkan (zoom bulan vs semua bulan)
  const displayedData = useMemo(() => {
    if (!selectedMonth) return dataMonth
    return dataMonth.filter((m) => m.month === selectedMonth)
  }, [dataMonth, selectedMonth])

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#1a2732] via-[#2C3E50] to-[#1a2732] text-white overflow-hidden">

      <main className="flex-1 flex flex-col items-center justify-center px-10 pt-40">
        <div className="w-full max-w-[1500px] bg-gradient-to-br from-[#2b3b4b]/90 to-[#1f2a36]/85 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/10 p-10 flex flex-col items-center">
          <h1 className="text-4xl font-bold text-[#F4E1C1] text-center mb-6 drop-shadow-md">
            <span className="text-yellow-400">Laporan Pendapatan Tahunan</span>
            <br /> Rumah Sakit Bhayangkara M. Hasan Palembang {year}
          </h1>

          {/* 🆕 Total tahunan */}
          <p className="text-2xl font-bold text-[#F4E1C1] mb-6">
            💰 Total Pendapatan Tahun {year}:{" "}
            <span className="text-yellow-400 ml-2">Rp {totalYear.toLocaleString("id-ID")}</span>
          </p>

          {dataMonth.length === 0 ? (
            <p className="py-10 text-gray-300 animate-pulse">Memuat data...</p>
          ) : (
            <div className="flex flex-col items-center w-full px-4">
              {/* 🆕 Strip bulan yang bisa diklik untuk Zoom */}
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                {dataMonth.map((m: any) => (
                  <button
                    key={m.month}
                    onClick={() => setSelectedMonth(m.month)}
                    className={`px-3 py-1 rounded-full border text-sm transition ${
                      selectedMonth === m.month
                        ? "bg-yellow-500/20 border-yellow-400 text-yellow-300"
                        : "bg-[#2C3E50]/60 border-[#F4E1C1]/20 text-[#F4E1C1]/90 hover:bg-[#34495E]/70"
                    }`}
                    title={`Fokuskan ke bulan ${m.month}`}
                  >
                    {m.month}
                  </button>
                ))}
              </div>

              {/* Tombol kembali ke semua bulan */}
              {selectedMonth && (
                <button
                  onClick={() => setSelectedMonth(null)}
                  className="mb-4 px-4 py-2 rounded-lg bg-[#34495E] hover:bg-[#2C3E50] border border-[#F4E1C1]/20 text-[#F4E1C1] transition"
                >
                  🔙 Tampilkan Semua Bulan
                </button>
              )}

              <div className="flex justify-center w-full">
                <BarChart
                  dataset={displayedData}
                  xAxis={[{ dataKey: "month", scaleType: "band" }]}
                  yAxis={[{ position: "none" }]}
                  series={[
                    { id: "klaimBPJS", dataKey: "klaimBPJS", label: "Klaim BPJS", color: "#4FC3F7" },
                    { id: "pasienUmum", dataKey: "pasienUmum", label: "Pasien Umum", color: "#FFD54F" },
                    { id: "bungaDeposito", dataKey: "bungaDeposito", label: "Bunga Deposito", color: "#BA68C8" },
                    { id: "kerjaSamaSewa", dataKey: "kerjaSamaSewa", label: "Kerja Sama & Sewa", color: "#81C784" },
                  ]}
                  onItemClick={handleBarClick}
                  width={chartSize.width}
                  height={chartSize.height}
                  margin={{ bottom: 90, top: 30 }}
                  grid={{ vertical: true, horizontal: true }}
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
              <IconButton
                onClick={handleClose}
                className="text-gray-400 hover:bg-gray-700 rounded-full"
              >
                <CloseIcon />
              </IconButton>
            </div>
          </DialogTitle>

          <Divider sx={{ borderColor: "rgba(255,215,0,0.2)" }} />

          {/* ⬇️ Konten langsung tampil, gak scroll */}
          <DialogContent className="px-10 py-8">
            {selectedItem?.details?.length > 0 ? (
              <PaginationList details={selectedItem.details} />
            ) : (
              <div className="text-gray-400 text-center py-10">
                🚫 Tidak ada data detail.
              </div>
            )}
          </DialogContent>
        </Dialog>

      </main>
    </div>
  )
}

/* 🔹 Komponen PaginationList */
function PaginationList({ details }: { details: income[] }) {
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
              <p className="text-[#F4E1C1] font-bold">
                Rp {d.amount_income.toLocaleString("id-ID")}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <div className="flex justify-between items-center pt-4 border-t border-[#F4E1C1]/20">
          <button
            onClick={() => setPage(page - 1)}
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
            onClick={() => setPage(page + 1)}
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
