"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { useParams } from "next/navigation";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Income } from "@/app/(Protected)/dashboard/mixture/[year]/components/types";
import Transition from "@/components/ui/Transition";
import { useCategoryIncome } from "@/hooks/incomeInput/useCategoryIncome";

export default function IncomeDashboard() {
  const params = useParams();
  const year = params.year as string;
  const [data, setData] = useState<Income[]>([]);
  const [dataMonth, setDataMonth] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [chartSize, setChartSize] = useState({ width: 1800, height: 600 });

  // Ambil categories untuk mapping ID -> Name
  const { categories } = useCategoryIncome();

  // 📏 Resize responsif
  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      const width = Math.min(screenWidth * 0.95, 2000);
      const height = Math.max(600, Math.round(width * 0.45));
      setChartSize({ width, height });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🔹 Ambil data API Income
  useEffect(() => {
    if (!year || categories.length === 0) return;

    // Buat mapping ID -> Nama Kategori (lowercase key untuk dataMonth)
    // Contoh: "Klaim BPJS" -> "klaimBpjs" (untuk key object)
    // Tapi biar simpel kita pakai ID saja sebagai key, atau pakai nama kategori langsung jika bersih.
    // Spending dashboard pakai key map manual. Kita coba generate dynamic key.

    // Tapi chart butuh dimension fix.
    // Kita asumsi kategorinya bisa apa aja.
    // Kita kumpulkan semua kategori yg ada di DB.

    // Map Category ID -> Clean Key
    const idToKey: Record<number, string> = {};
    const keyToName: Record<string, string> = {};

    categories.forEach((cat) => {
      // Buat key safe (remove spasi dll)
      const key = cat.name_category.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
      idToKey[cat.id] = key;
      keyToName[key] = cat.name_category;
    });

    const monthly: Record<string, any> = {};

    axiosInstance.get<Income[]>(`/api/income/${year}`).then((res) => {
      res.data.forEach((d) => {
        const m = new Date(d.date_income).getMonth() + 1;
        const key = idToKey[d.category_id];

        if (!key) return;

        if (!monthly[m]) {
          monthly[m] = {};
          // init semua key dgn 0 value
          Object.values(idToKey).forEach((k) => (monthly[m][k] = 0));
        }

        if (!monthly[m][key]) monthly[m][key] = 0;
        monthly[m][key] += d.amount_income;
      });

      // Fill missing months or just sort existing
      const sorted = Object.entries(monthly)
        .sort((a, b) => Number(a[0]) - Number(b[0]))
        .map(([num, val]) => ({
          month: new Date(2024, Number(num) - 1).toLocaleString("id-ID", {
            month: "long",
          }),
          ...val,
        }));

      setData(res.data);
      setDataMonth(sorted);
    });
  }, [year, categories]);

  // 🔹 Klik bar chart
  const handleBarClick = (paramsEvt: any) => {
    const monthIndex = paramsEvt?.dataIndex;
    const seriesName = paramsEvt?.seriesName as string; // Nama Kategori (bukan key)

    // Reverse lookup Name -> ID
    const cat = categories.find((c) => c.name_category === seriesName);
    if (!cat) return;

    const categoryId = cat.id;
    const monthName = dataMonth[monthIndex]?.month;

    const filtered = data.filter((d) => {
      const m = new Date(d.date_income).getMonth() + 1;
      return m === monthIndex + 1 && d.category_id === categoryId;
    });

    setSelectedItem({
      month: monthName,
      category: seriesName,
      details: filtered,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedItem(null);
  };

  // ===================== ECHARTS: OPTION =====================
  const barOption = (rows: any[]) => {
    // Generate colors dynamically if many categories, or use standard palette
    const palette = [
      "#4FC3F7",
      "#FFD54F",
      "#BA68C8",
      "#81C784",
      "#E57373",
      "#4DB6AC",
      "#9575CD",
      "#F06292",
      "#64B5F6",
      "#AED581",
    ];

    // Buat Series berdasarkan Categories yang ada
    const seriesList = categories.map((cat, idx) => {
      const key = cat.name_category.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
      return {
        name: cat.name_category, // Label di Legend
        type: "bar",
        itemStyle: glossyBar(palette[idx % palette.length]),
        emphasis: {
          focus: "series",
          itemStyle: { shadowColor: "rgba(255,215,0,0.6)", shadowBlur: 12 },
        },
        // Gap logic standard
        barGap: "10%",
        barCategoryGap: "25%",
        encode: { x: "month", y: key },
      };
    });

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
          if (!params?.length) return "";
          const title = params[0].axisValue;
          const formatRp = (n: number) =>
            "Rp " +
            (n || 0).toLocaleString("id-ID", { maximumFractionDigits: 0 });

          const lines = params
            .map((p) => {
              const marker = p.marker || "•";
              const val = p.value[p.dimensionNames[p.encode.y[0]]]; // Ambil value dari dataset berdasarkan encode y
              return `<div style="display:flex; justify-content:space-between; gap:20px; margin-top:4px">
                        <span>${marker} ${p.seriesName}</span>
                        <span style="font-weight:bold; color:#FFD970">${formatRp(
                          val
                        )}</span>
                      </div>`;
            })
            .join("");

          return `<div style="margin-bottom:8px; font-size:18px; font-weight:bold; border-bottom:1px solid rgba(255,255,255,0.2); padding-bottom:4px">${title}</div>${lines}`;
        },
        confine: true,
      },
      legend: {
        top: 0,
        textStyle: { color: "#F4E1C1", fontSize: 16, fontWeight: "bold" },
        itemWidth: 20,
        itemHeight: 14,
        itemGap: 20,
        type: "scroll", // Handle banyak category
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
        axisLabel: {
          color: "#F4E1C1",
          fontSize: 14,
          fontWeight: "bold",
          margin: 16,
        },
        axisLine: { lineStyle: { color: "rgba(255,215,0,0.4)", width: 2 } },
        axisTick: { show: false },
      },
      yAxis: {
        type: "value",
        axisLabel: {
          color: "#F4E1C1",
          fontSize: 14,
          fontWeight: "bold",
          formatter: (v: number) =>
            v >= 1000000000
              ? `${(v / 1000000000).toFixed(1)}M`
              : v >= 1000000
              ? `${(v / 1000000).toFixed(0)}jt`
              : v,
        },
        splitLine: { lineStyle: { color: "rgba(255,215,0,0.1)", width: 1 } },
      },
      dataset: {
        // Dimensions otomatis akan terdeteksi kalau source shape konsisten,
        // tapi sebaiknya define 'month' dan key category
        source: rows,
      },
      series: seriesList,
    } as echarts.EChartsOption;
  };

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
    };
  }

  function shade(hex: string, percent: number) {
    const f = parseInt(hex.slice(1), 16),
      t = percent < 0 ? 0 : 255,
      p = Math.abs(percent) / 100,
      R = f >> 16,
      G = (f >> 8) & 0x00ff,
      B = f & 0x0000ff;
    const to = (c: number) => Math.round((t - c) * p) + c;
    return `#${(0x1000000 + (to(R) << 16) + (to(G) << 8) + to(B))
      .toString(16)
      .slice(1)}`;
  }

  const chartEvents = {
    click: handleBarClick,
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#1a2732] via-[#2C3E50] to-[#1a2732] text-white overflow-x-hidden">
      <main className="flex-1 flex flex-col items-center justify-start px-4 md:px-8 pt-32 pb-20 w-full">
        {/* Container Utama */}
        <div className="w-full max-w-[95vw] bg-gradient-to-br from-[#2b3b4b]/95 to-[#1f2a36]/90 backdrop-blur-xl rounded-[40px] shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 p-8 md:p-12 flex flex-col items-center">
          {/* Header */}
          <h1 className="text-4xl md:text-6xl font-extrabold text-[#F4E1C1] text-center mb-12 drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD54F] to-[#F4E1C1]">
              Laporan Pemasukan Tahunan
            </span>
            <br />
            <span className="text-2xl md:text-4xl font-serif font-normal mt-4 block text-[#EBD77A]/90">
              Rumah Sakit Bhayangkara M. Hasan Palembang {year}
            </span>
          </h1>

          {dataMonth.length === 0 ? (
            <div className="py-20 flex flex-col items-center gap-4">
              <div className="w-16 h-16 border-4 border-[#FFD54F] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xl text-[#F4E1C1]/70 animate-pulse">
                Sedang memuat data...
              </p>
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

        {/* Dialog Detail */}
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
              background:
                "linear-gradient(145deg, rgba(25, 30, 40, 0.98), rgba(35, 45, 55, 0.98))",
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
                    Detail Pemasukan Bulan {selectedItem?.month}
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
              <PaginationList details={selectedItem.details} />
            ) : (
              <div className="text-[#F4E1C1]/50 text-center py-20 text-xl italic">
                🚫 Tidak ada data detail.
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}

function PaginationList({ details }: { details: Income[] }) {
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(details.length / itemsPerPage);
  const slice = details.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const formatRp = (n: number) =>
    "Rp " + (n || 0).toLocaleString("id-ID", { maximumFractionDigits: 0 });

  return (
    <div className="flex flex-col gap-8 h-full">
      <ul className="grid grid-cols-1 gap-4">
        {slice.map((d) => (
          <li
            key={d.id}
            className="p-6 rounded-2xl bg-[#2C3E50]/60 hover:bg-[#34495E]/80 border border-[#F4E1C1]/10 transition-all duration-300 shadow-lg hover:shadow-[#FFD54F]/10 hover:scale-[1.01] group"
          >
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="font-bold text-xl text-[#FFD54F] group-hover:text-[#FFCA28] transition-colors">
                  {d.name_income}
                </p>
                <p className="text-[#F4E1C1]/60 text-base flex items-center gap-2">
                  📅{" "}
                  {new Date(d.date_income).toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-extrabold text-[#F4E1C1] group-hover:text-white transition-colors">
                  {formatRp(d.amount_income)}
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
            className={`px-6 py-3 rounded-xl font-bold text-lg transition-all ${
              page === 1
                ? "bg-gray-700/50 text-gray-500 cursor-not-allowed"
                : "bg-[#2C3E50] hover:bg-[#34495E] text-[#F4E1C1] shadow-lg"
            }`}
          >
            ⬅️ Sebelumnya
          </button>
          <span className="text-[#F4E1C1] font-semibold text-lg bg-[#1a2732] px-4 py-2 rounded-lg border border-[#F4E1C1]/10">
            Halaman <span className="text-[#FFD54F]">{page}</span> dari{" "}
            {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className={`px-6 py-3 rounded-xl font-bold text-lg transition-all ${
              page === totalPages
                ? "bg-gray-700/50 text-gray-500 cursor-not-allowed"
                : "bg-[#2C3E50] hover:bg-[#34495E] text-[#F4E1C1] shadow-lg"
            }`}
          >
            Selanjutnya ➡️
          </button>
        </div>
      )}
    </div>
  );
}
