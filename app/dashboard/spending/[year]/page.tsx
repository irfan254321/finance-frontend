"use client"

import NavbarLogin from "../../../../components/navbarLogin"
import Footer from "../../../../components/footer"
import { useEffect, useState } from "react"
import axiosInstance from "@/lib/axiosInstance"
import { useParams } from "next/navigation"
import { BarChart } from "@mui/x-charts"
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
  const year = params.year
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
      const height = Math.max(400, width * 0.4)
      setChartSize({ width, height })
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // 🔹 Klik bar chart
  const handleBarClick = (_: any, item: any) => {
    const monthIndex = item.dataIndex
    const categoryKey = item.seriesId ?? item.seriesLabel ?? item.dataKey

    const mapId: Record<string, number> = {
      operasional: 4,
      pemeliharaan: 5,
      pendukung: 6,
      honor: 7,
      jasaMedis: 8,
      obat: 9,
      peralatan: 10,
    }

    const categoryId = mapId[categoryKey]
    const monthName = dataMonth[monthIndex]?.month
    const filtered = data.filter((d) => {
      const month = new Date(d.date_spending).getMonth() + 1
      return month === monthIndex + 1 && d.category_id === categoryId
    })

    setSelectedItem({ month: monthName, category: categoryKey, details: filtered })
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setSelectedItem(null)
  }

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
        monthly[m][key] += d.amount_spending
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
              <BarChart
                dataset={dataMonth}
                xAxis={[{ dataKey: "month", scaleType: "band" }]}
                yAxis={[{ position: "none" }]}
                series={[
                  { id: "operasional", dataKey: "operasional", label: "Operasional", color: "#4FC3F7" },
                  { id: "pemeliharaan", dataKey: "pemeliharaan", label: "Pemeliharaan", color: "#FFD54F" },
                  { id: "pendukung", dataKey: "pendukung", label: "Pendukung", color: "#BA68C8" },
                  { id: "honor", dataKey: "honor", label: "Honor Pegawai", color: "#81C784" },
                  { id: "jasaMedis", dataKey: "jasaMedis", label: "Jasa Medis", color: "#E57373" },
                  { id: "obat", dataKey: "obat", label: "Obat (Bekal Kesehatan)", color: "#4DB6AC" },
                  { id: "peralatan", dataKey: "peralatan", label: "Peralatan & Mesin", color: "#9575CD" },
                ]}
                onItemClick={handleBarClick}
                width={chartSize.width}
                height={chartSize.height}
                grid={{ vertical: true, horizontal: true }}
                sx={{
                  "& .MuiChartsLegend-root": {
                    marginTop: "30px",
                  },
                  "& .MuiChartsLegend-label": {
                    fill: "#F4E1C1",
                    fontSize: "20px",
                    color : "#FFD700",
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
function PaginationList({ details, onClickSpending }: { details: Spending[]; onClickSpending: (item: Spending) => void }) {
  const [page, setPage] = useState(1)
  const itemsPerPage = 8
  const totalPages = Math.ceil(details.length / itemsPerPage)
  const slice = details.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  return (
    <div className="flex flex-col gap-6">
      <ul className="space-y-4">
        {slice.map((d) => (
          <li
            key={d.id}
            onClick={() => onClickSpending(d)}
            className={`p-5 rounded-xl bg-[#2C3E50]/70 hover:bg-[#34495E]/70 border border-[#F4E1C1]/10 transition shadow cursor-pointer ${
              d.category_id === 9 ? "hover:ring-2 hover:ring-[#FFD700]" : ""
            }`}
          >
            <div className="flex justify-between">
              <div>
                <p className="font-semibold text-[#FFD54F]">{d.name_spending}</p>
                <p className="text-gray-400 text-sm">{new Date(d.date_spending).toLocaleDateString("id-ID")}</p>
              </div>
              <p className="text-[#F4E1C1] font-bold">Rp {d.amount_spending.toLocaleString("id-ID")}</p>
            </div>
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <div className="flex justify-between items-center pt-4 border-t border-[#F4E1C1]/20">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className={`px-5 py-2 rounded-lg transition ${
              page === 1 ? "bg-gray-700 text-gray-400" : "bg-[#2C3E50] hover:bg-[#34495E] text-[#F4E1C1]"
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
            className={`px-5 py-2 rounded-lg transition ${
              page === totalPages
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
