"use client"

import React from "react"
import { Dialog, DialogTitle, DialogContent, IconButton, Divider } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import ReactECharts from "echarts-for-react"
import Transition from "@/components/ui/Transition"
import { formatRp } from "@/lib/utils"

type SemesterDetailDialogProps = {
    open: boolean
    onClose: () => void
    type: "income" | "spending" | null
    index: 1 | 2 | null
    semesterData: {
        s1: { income: number; spending: number; surplus: number }
        s2: { income: number; spending: number; surplus: number }
    }
    onSliceClick: (type: "income" | "spending", index: 1 | 2) => void
}

export default function SemesterDetailDialog({
    open,
    onClose,
    type,
    index,
    semesterData,
    onSliceClick,
}: SemesterDetailDialogProps) {
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
                    maxWidth: "1500px",
                    maxHeight: "calc(100vh - 20px)",
                    overflowY: "auto",
                    boxShadow: "0 0 40px rgba(255,215,0,0.25)",
                },
            }}
        >
            {type && index && (
                <>
                    <DialogTitle>
                        <div className="flex justify-between items-center">
                            <div className="flex flex-col w-full text-center">
                                <p className="font-bold text-4xl text-yellow-400 uppercase tracking-wide mb-2">
                                    {index === 1
                                        ? `Semester 1 (Jan–Jun)`
                                        : `Semester 2 (Jul–Des)`}
                                </p>

                                <p className="text-lg text-[#F4E1C1]">
                                    💰 Pendapatan:&nbsp;
                                    <b className="text-[#FFD700]">
                                        {formatRp(
                                            index === 1
                                                ? semesterData.s1.income
                                                : semesterData.s2.income
                                        )}
                                    </b>
                                    &nbsp; | 💸 Pengeluaran:&nbsp;
                                    <b className="text-[#FF7F50]">
                                        {formatRp(
                                            index === 1
                                                ? semesterData.s1.spending
                                                : semesterData.s2.spending
                                        )}
                                    </b>
                                    <br />
                                    {index === 1
                                        ? semesterData.s1.surplus >= 0
                                            ? `📈 Surplus: ${formatRp(semesterData.s1.surplus)}`
                                            : `📉 Defisit: ${formatRp(
                                                Math.abs(semesterData.s1.surplus)
                                            )}`
                                        : semesterData.s2.surplus >= 0
                                            ? `📈 Surplus: ${formatRp(semesterData.s2.surplus)}`
                                            : `📉 Defisit: ${formatRp(
                                                Math.abs(semesterData.s2.surplus)
                                            )}`}
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
                            <div className="max-w-[1300px] w-full">
                                <ReactECharts
                                    option={{
                                        tooltip: { trigger: "item" },
                                        legend: {
                                            top: "5%",
                                            left: "center",
                                            textStyle: { color: "#F4E1C1" },
                                        },
                                        series: [
                                            {
                                                name:
                                                    index === 1
                                                        ? "Semester 1"
                                                        : "Semester 2",
                                                type: "pie",
                                                radius: ["45%", "75%"],
                                                data: [
                                                    {
                                                        value:
                                                            index === 1
                                                                ? semesterData.s1.income
                                                                : semesterData.s2.income,
                                                        name: "Pendapatan",
                                                    },
                                                    {
                                                        value:
                                                            index === 1
                                                                ? semesterData.s1.spending
                                                                : semesterData.s2.spending,
                                                        name: "Pengeluaran",
                                                    },
                                                ],
                                            },
                                        ],
                                    }}
                                    style={{ height: 600 }}
                                    onEvents={{
                                        click: (params: { name: string }) => {
                                            if (params.name === "Pendapatan") {
                                                onSliceClick("income", index);
                                            } else if (params.name === "Pengeluaran") {
                                                onSliceClick("spending", index);
                                            }
                                        },
                                    }}
                                />
                            </div>
                        </div>
                    </DialogContent>
                </>
            )}
        </Dialog>
    )
}
