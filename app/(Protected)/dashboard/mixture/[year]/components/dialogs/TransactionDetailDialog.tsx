"use client"

import React from "react"
import { Dialog, DialogTitle, DialogContent, IconButton, Divider, Button } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import Transition from "@/components/ui/Transition"
import { Income, Spending } from "@/types/finance"
import { formatRp } from "@/lib/utils"

type TransactionDetailDialogProps = {
    open: boolean
    onClose: () => void
    title: string
    list: any[]
    type: "income" | "spending" | null
    page: number
    totalPages: number
    onPageChange: (newPage: number) => void
    paginatedList: any[]
    onMedicineClick: (sp: Spending) => void
}

export default function TransactionDetailDialog({
    open,
    onClose,
    title,
    list,
    type,
    page,
    totalPages,
    onPageChange,
    paginatedList,
    onMedicineClick,
}: TransactionDetailDialogProps) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            TransitionComponent={Transition}
            sx={{
                "& .MuiDialog-paper": {
                    width: "900px",
                    maxWidth: "95vw",
                    borderRadius: "22px",
                    background: "rgba(25,30,40,0.95)",
                    border: "1px solid rgba(255,215,0,0.2)",
                    color: "white",
                },
            }}
        >
            <DialogTitle>
                <div className="flex justify-between items-center">
                    <p className="font-bold text-2xl text-yellow-400">{title}</p>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </div>
            </DialogTitle>
            <Divider sx={{ borderColor: "rgba(255,215,0,0.2)" }} />
            <DialogContent className="px-8 py-6">
                {list.length ? (
                    <>
                        <ul className="space-y-3">
                            {/* === VIEW TAHUNAN PER BULAN === */}
                            {title.includes("per Bulan") ? (
                                list.map((d) => (
                                    <li
                                        key={d.id}
                                        className="p-4 rounded-lg bg-[#2C3E50]/70 border border-[#F4E1C1]/10"
                                    >
                                        <div className="flex justify-between">
                                            <p className="font-semibold text-[#FFD54F]">{d.month}</p>
                                            <p className="text-[#F4E1C1] font-bold">{formatRp(d.total)}</p>
                                        </div>
                                    </li>
                                ))
                            ) : title.includes("Semester") ? (
                                list.map((d) => (
                                    <li
                                        key={d.id}
                                        className="p-4 rounded-lg bg-[#2C3E50]/70 border border-[#F4E1C1]/10"
                                    >
                                        <div className="flex justify-between">
                                            <p className="font-semibold text-[#FFD54F]">{d.name}</p>
                                            <p className="text-[#F4E1C1] font-bold">{formatRp(d.value)}</p>
                                        </div>
                                    </li>
                                ))
                            ) : type === "income" ? (
                                paginatedList.map((d: Income) => (
                                    <li
                                        key={d.id}
                                        className="p-4 rounded-lg bg-[#2C3E50]/70 border border-[#F4E1C1]/10"
                                    >
                                        <div className="flex justify-between">
                                            <div>
                                                <p className="font-semibold text-[#FFD54F]">{d.name_income}</p>
                                                <p className="text-gray-400 text-sm">
                                                    {new Date(d.date_income).toLocaleDateString("id-ID")}
                                                </p>
                                            </div>
                                            <p className="text-[#F4E1C1] font-bold">{formatRp(d.amount_income)}</p>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                paginatedList.map((d: Spending) => (
                                    <li
                                        key={d.id}
                                        className={`p-4 rounded-lg bg-[#2C3E50]/70 border border-[#F4E1C1]/10 ${d.category_id === 9 ? "hover:ring-2 hover:ring-[#FFD700] cursor-pointer" : ""
                                            }`}
                                        onClick={() => {
                                            if (d.category_id === 9) onMedicineClick(d)
                                        }}
                                    >
                                        <div className="flex justify-between">
                                            <div>
                                                <p className="font-semibold text-[#FFD54F]">{d.name_spending}</p>
                                                <p className="text-gray-400 text-sm">
                                                    {new Date(d.date_spending).toLocaleDateString("id-ID")}
                                                </p>
                                            </div>
                                            <p className="text-[#F4E1C1] font-bold">{formatRp(d.amount_spending)}</p>
                                        </div>
                                    </li>
                                ))
                            )}
                        </ul>

                        {/* Pagination */}
                        {!title.includes("per Bulan") &&
                            !title.includes("Semester") &&
                            totalPages > 1 && (
                                <div className="flex justify-center items-center gap-3 mt-6">
                                    <Button
                                        type="button"
                                        variant="outlined"
                                        disabled={page === 1}
                                        onClick={() => onPageChange(page - 1)}
                                        sx={{
                                            borderColor: "#FFD700",
                                            color: "#FFD700",
                                            "&:hover": { borderColor: "#E6BE00", background: "rgba(255,215,0,0.1)" },
                                        }}
                                    >
                                        ◀ Prev
                                    </Button>

                                    <span className="text-[#F4E1C1]">
                                        Halaman {page} dari {totalPages}
                                    </span>

                                    <Button
                                        type="button"
                                        variant="outlined"
                                        disabled={page === totalPages}
                                        onClick={() => onPageChange(page + 1)}
                                        sx={{
                                            borderColor: "#FFD700",
                                            color: "#FFD700",
                                            "&:hover": { borderColor: "#E6BE00", background: "rgba(255,215,0,0.1)" },
                                        }}
                                    >
                                        Next ▶
                                    </Button>
                                </div>
                            )}

                    </>
                ) : (
                    <p className="text-gray-400 text-center py-10">🚫 Tidak ada data.</p>
                )}
            </DialogContent>
        </Dialog>
    )
}
