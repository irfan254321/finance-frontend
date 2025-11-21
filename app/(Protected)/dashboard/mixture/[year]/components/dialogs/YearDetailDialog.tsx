"use client"

import React from "react"
import { Dialog, DialogTitle, DialogContent, IconButton, Divider } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import Transition from "@/components/ui/Transition"
import { formatRp } from "@/lib/utils"
import DynamicYearlyChart from "../DynamicYearlyChart"

type YearDetailDialogProps = {
    open: boolean
    onClose: () => void
    type: "income" | "spending" | null
    year: string
    yearlyData: {
        totalIncome: number
        totalSpending: number
    }
    calcYearlyBreakdown: (type: "income" | "spending") => any[]
    onCategoryClick: (type: "income" | "spending", catId: number, catName: string) => void
}

export default function YearDetailDialog({
    open,
    onClose,
    type,
    year,
    yearlyData,
    calcYearlyBreakdown,
    onCategoryClick,
}: YearDetailDialogProps) {
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
                    width: "95%",
                    maxWidth: "1800px",
                    maxHeight: "calc(100vh - 20px)",
                    overflowY: "auto",
                    boxShadow: "0 0 40px rgba(255,215,0,0.25)",
                },
            }}
        >
            {type && (
                <>
                    <DialogTitle>
                        <div className="flex justify-between items-center">
                            <div className="flex flex-col w-full text-center">
                                <p className="font-bold text-4xl text-yellow-400 uppercase tracking-wide mb-2">
                                    {type === "income"
                                        ? `Pendapatan Tahunan — ${year}`
                                        : `Pengeluaran Tahunan — ${year}`}
                                </p>

                                <p className="text-lg text-[#F4E1C1]">
                                    Total:&nbsp;
                                    <b
                                        className={
                                            type === "income"
                                                ? "text-[#FFD700]"
                                                : "text-[#FF7F50]"
                                        }
                                    >
                                        {type === "income"
                                            ? formatRp(yearlyData.totalIncome)
                                            : formatRp(yearlyData.totalSpending)}
                                    </b>
                                </p>
                            </div>

                            <IconButton onClick={onClose}>
                                <CloseIcon />
                            </IconButton>
                        </div>
                    </DialogTitle>

                    <Divider sx={{ borderColor: "rgba(255,215,0,0.2)", mb: 2 }} />

                    <DialogContent>
                        <div className="flex justify-center">
                            <div className="max-w-[1500px] w-full">
                                <DynamicYearlyChart
                                    title=""
                                    color={type === "income" ? "#FFD700" : "#FF7F50"}
                                    data={calcYearlyBreakdown(type)}
                                    onClick={(catId, catName) =>
                                        onCategoryClick(type, catId, catName)
                                    }
                                />
                            </div>
                        </div>
                    </DialogContent>
                </>
            )}
        </Dialog>
    )
}
