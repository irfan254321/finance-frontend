"use client"

import React from "react"
import { Dialog, DialogTitle, DialogContent, IconButton, Divider } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import ReactECharts from "echarts-for-react"
import Transition from "@/components/ui/Transition"
import { Income, Spending } from "@/types/finance"
import { formatRp, MONTHS_LABEL } from "@/lib/utils"

type MonthDetailDialogProps = {
    open: boolean
    onClose: () => void
    selectedMonth: number | null
    year: string
    monthly: Record<number, any>
    pieOption: (title: string, data: any[]) => any
    createPieEvents: (type: "income" | "spending", month: number) => any
}

export default function MonthDetailDialog({
    open,
    onClose,
    selectedMonth,
    year,
    monthly,
    pieOption,
    createPieEvents,
}: MonthDetailDialogProps) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth={false}
            fullWidth
            TransitionComponent={Transition}
            BackdropProps={{
                sx: {
                    backdropFilter: "blur(12px)",
                    backgroundColor: "rgba(0,0,0,0.6)",
                },
            }}
            sx={{
                "& .MuiDialog-paper": {
                    background: "rgba(25,30,40,0.98)",
                    borderRadius: "25px",
                    border: "1px solid rgba(255,215,0,0.3)",
                    padding: "20px",
                    color: "white",
                    margin: "5px auto",
                    maxHeight: "calc(100vh - 20px)",
                    overflowY: "auto",
                    boxShadow: "0 0 40px rgba(255,215,0,0.2)",
                },
            }}
        >
            {selectedMonth && (
                <>
                    <DialogTitle>
                        <div className="flex justify-between items-center">
                            <p className="font-bold text-3xl text-yellow-400 w-full text-center">
                                {MONTHS_LABEL[selectedMonth - 1]} — {year}
                            </p>
                            <IconButton onClick={onClose}>
                                <CloseIcon />
                            </IconButton>
                        </div>
                    </DialogTitle>
                    <Divider sx={{ borderColor: "rgba(255,215,0,0.2)", mb: 2 }} />

                    <DialogContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 justify-center">
                            {/* Pendapatan */}
                            <div className="flex flex-col items-center">
                                <h3 className="text-xl mb-2 text-[#F4E1C1]">Pendapatan</h3>
                                <ReactECharts
                                    option={pieOption("Pendapatan", monthly[selectedMonth]?.income.pie || [])}
                                    style={{ height: 500, width: "100%" }}
                                    onEvents={createPieEvents("income", selectedMonth)}
                                />
                            </div>

                            {/* Pengeluaran */}
                            <div className="flex flex-col items-center">
                                <h3 className="text-xl mb-2 text-[#F4E1C1]">Pengeluaran</h3>
                                <ReactECharts
                                    option={pieOption("Pengeluaran", monthly[selectedMonth]?.spending.pie || [])}
                                    style={{ height: 500, width: "100%" }}
                                    onEvents={createPieEvents("spending", selectedMonth)}
                                />
                            </div>
                        </div>
                    </DialogContent>
                </>
            )}
        </Dialog>
    )
}
