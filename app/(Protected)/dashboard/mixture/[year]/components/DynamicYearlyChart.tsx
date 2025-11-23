"use client"

import React, { useEffect, useRef, useState } from "react"
import ReactECharts from "echarts-for-react"
import { Card } from "@mui/material"
import { formatRp } from "@/lib/utils"
import * as echarts from "echarts"

type DynamicYearlyChartProps = {
    title: string
    color: string
    data: { id: number; name: string; value: number; catId?: number }[]
    onClick: (catId: number, catName: string) => void
}

export default function DynamicYearlyChart({
    title,
    color,
    data,
    onClick,
}: DynamicYearlyChartProps) {
    const chartRef = useRef<any>(null)
    const [fadeState, setFadeState] = useState<"icon" | "bar">("icon")

    const makeSeries = (type: "icon" | "bar"): echarts.PictorialBarSeriesOption => ({
        name: type === "icon" ? "Ikon" : "Bar",
        type: "pictorialBar",
        symbolRepeat: true,
        symbolSize: type === "icon" ? [40, 40] : [20, 20],
        barCategoryGap: "70%",
        symbolMargin: 4,
        animationDuration: 1000,
        animationDurationUpdate: 1200,
        animationEasingUpdate: "cubicInOut",

        label: {
            show: true,
            position: "top",
            distance: 10,
            color,
            fontWeight: "bold",
            fontSize: 16,
            opacity: type === fadeState ? 1 : 0,
            formatter: (p: any) => formatRp(p.value),
        },

        itemStyle: {
            opacity: type === fadeState ? 1 : 0,
            shadowBlur: 10,
            shadowColor:
                color === "#FFD700"
                    ? "rgba(255,215,0,0.3)"
                    : "rgba(255,127,80,0.3)",
        },

        data:
            type === "icon"
                ? data.map((d) => ({
                    value: d.value,
                    name: d.name,
                    catId: d.catId,
                    symbol: "diamond",
                }))
                : data.map((d) => ({
                    value: d.value,
                    name: d.name,
                    catId: d.catId,
                    symbol: "rect",
                })),
    })

    const makeOption = (): echarts.EChartsOption => ({
        backgroundColor: "transparent",
        tooltip: {
            trigger: "item",
            formatter: (p: any) => `${p.name}<br/><b>${formatRp(p.value)}</b>`,
        },
        title: {
            text: title,
            left: "center",
            textStyle: { color, fontSize: 18, fontWeight: 700 },
        },
        grid: { left: 20, right: 20, top: 60, bottom: 120 },
        xAxis: {
            type: "category",
            data: data.map((d) => d.name),
            axisLabel: { color: "#F4E1C1", fontWeight: 600, rotate: 15 },
            axisTick: { show: false },
            axisLine: { show: false },
        },
        yAxis: { show: false },
        series: [makeSeries("icon"), makeSeries("bar")],
    })

    useEffect(() => {
        if (!chartRef.current) return
        const chart = chartRef.current.getEchartsInstance()
        chart.setOption(makeOption())

        const timer = setInterval(() => {
            setFadeState((prev) => (prev === "icon" ? "bar" : "icon"))
        }, 3000)

        return () => clearInterval(timer)
    }, [data])

    useEffect(() => {
        if (!chartRef.current) return
        const chart = chartRef.current.getEchartsInstance()
        chart.setOption(makeOption(), { notMerge: true })
    }, [fadeState])

    return (
        <Card
            sx={{
                background: "rgba(43,59,75,0.9)",
                border: "1px solid rgba(255,215,0,0.2)",
                borderRadius: "20px",
                p: "1.5rem",
            }}
        >
            <ReactECharts
                ref={chartRef}
                option={makeOption()}
                style={{ height: 500 }}
                opts={{ renderer: "svg" }}
                onEvents={{
                    click: (params: any) => {
                        const catName = params?.data?.name
                        const catId = params?.data?.catId
                        if (catName && catId) onClick(catId, catName)
                    },
                }}
            />
        </Card>
    )
}
