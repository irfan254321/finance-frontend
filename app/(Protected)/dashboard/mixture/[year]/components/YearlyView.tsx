"use client"

import React from "react"
import { formatRp } from "@/lib/utils"
import DynamicYearlyChart from "./DynamicYearlyChart"

type YearlyViewProps = {
    year: string
    yearlyData: {
        totalIncome: number
        totalSpending: number
        surplus: number
    }
    calcYearlyBreakdown: (type: "income" | "spending") => any[]
    onYearDetailClick: (type: "income" | "spending") => void
    onCategoryClick: (type: "income" | "spending", catId: number, catName: string) => void
}

export default function YearlyView({
    year,
    yearlyData,
    calcYearlyBreakdown,
    onYearDetailClick,
    onCategoryClick,
}: YearlyViewProps) {
    return (
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
                <h2
                    className="text-2xl font-bold text-[#FFD700] uppercase text-center mb-1 cursor-pointer"
                    onClick={() => onYearDetailClick("income")}
                >
                    Pendapatan Tahunan — {year}
                </h2>
                <p className="text-center text-lg text-[#F4E1C1] mb-4">
                    Total: <b className="text-[#FFD700]">{formatRp(yearlyData.totalIncome)}</b>
                </p>
                <DynamicYearlyChart
                    title=""
                    color="#FFD700"
                    data={calcYearlyBreakdown("income")}
                    onClick={(catId, catName) => onCategoryClick("income", catId, catName)}
                />
            </div>

            {/* Pengeluaran Tahunan */}
            <div>
                <h2
                    className="text-2xl font-bold text-[#FF7F50] uppercase text-center mb-1 cursor-pointer"
                    onClick={() => onYearDetailClick("spending")}
                >
                    Pengeluaran Tahunan — {year}
                </h2>
                <p className="text-center text-lg text-[#F4E1C1] mb-4">
                    Total: <b className="text-[#FF7F50]">{formatRp(yearlyData.totalSpending)}</b>
                </p>
                <DynamicYearlyChart
                    title=""
                    color="#FF7F50"
                    data={calcYearlyBreakdown("spending")}
                    onClick={(catId, catName) => onCategoryClick("spending", catId, catName)}
                />
            </div>
        </div>
    )
}
