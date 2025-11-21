"use client"

import React from "react"
import { Card, Divider, Button } from "@mui/material"
import ReactECharts from "echarts-for-react"
import { MONTHS_ID, MONTHS_LABEL, formatRp } from "@/lib/utils"

type MonthlyViewProps = {
    monthly: Record<
        number,
        {
            income: { byCat: Record<number, number>; total: number; pie: any[] }
            spending: { byCat: Record<number, number>; total: number; pie: any[] }
            surplus: number
        }
    >
    onMonthClick: (month: number) => void
    onViewAllClick: (monthIndex: number, type: "income" | "spending") => void
    onSliceClick: (type: "income" | "spending", month: number, params: any) => void
}

export default function MonthlyView({
    monthly,
    onMonthClick,
    onViewAllClick,
    onSliceClick,
}: MonthlyViewProps) {
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
            if (params?.event?.event) {
                params.event.event.preventDefault()
                params.event.event.stopPropagation()
            }
            onSliceClick(type, month, params)
        },
    })

    return (
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
                                onClick={() => onMonthClick(m)}
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
                                    onClick={() => onViewAllClick(m - 1, "income")}
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
                                    onClick={() => onViewAllClick(m - 1, "spending")}
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
    )
}
