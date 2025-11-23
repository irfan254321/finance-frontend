"use client"

import React from "react"
import { Card } from "@mui/material"
import ReactECharts from "echarts-for-react"
import { formatRp } from "@/lib/utils"

type SemesterViewProps = {
    semesterData: {
        s1: { income: number; spending: number; surplus: number }
        s2: { income: number; spending: number; surplus: number }
    }
    onSemesterZoom: (type: "income" | "spending", index: 1 | 2) => void
}

export default function SemesterView({ semesterData, onSemesterZoom }: SemesterViewProps) {
    return (
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
                onClick={() => onSemesterZoom("income", 1)}
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
                onClick={() => onSemesterZoom("income", 2)}
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
    )
}
