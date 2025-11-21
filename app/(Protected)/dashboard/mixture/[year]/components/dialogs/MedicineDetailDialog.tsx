"use client"

import React from "react"
import { Dialog, DialogTitle, DialogContent, IconButton, Divider, CircularProgress, Button } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import Transition from "@/components/ui/Transition"
import { Medicine } from "@/types/finance"

type MedicineDetailDialogProps = {
    open: boolean
    onClose: () => void
    spendingName?: string
    loading: boolean
    list: Medicine[]
    page: number
    totalPages: number
    onPageChange: (newPage: number) => void
    currentData: Medicine[]
}

export default function MedicineDetailDialog({
    open,
    onClose,
    spendingName,
    loading,
    list,
    page,
    totalPages,
    onPageChange,
    currentData,
}: MedicineDetailDialogProps) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            TransitionComponent={Transition}
            sx={{
                "& .MuiDialog-paper": {
                    width: "800px",
                    maxWidth: "95vw",
                    borderRadius: "22px",
                    background: "rgba(25,30,40,0.95)",
                    border: "1px solid rgba(255,215,0,0.3)",
                    color: "white",
                },
            }}
        >
            <DialogTitle>
                <div className="flex justify-between items-center">
                    <p className="font-bold text-2xl text-yellow-400">
                        Detail Obat — {spendingName}
                    </p>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </div>
            </DialogTitle>
            <Divider sx={{ borderColor: "rgba(255,215,0,0.2)" }} />
            <DialogContent className="px-8 py-6">
                {loading ? (
                    <div className="flex justify-center items-center py-16">
                        <CircularProgress sx={{ color: "#FFD700" }} />
                        <span className="ml-3 text-[#FFD700]">Memuat data obat...</span>
                    </div>
                ) : list.length ? (
                    <>
                        <ul className="space-y-3">
                            {currentData.map((m) => (
                                <li
                                    key={m.medicine_id}
                                    className="p-4 rounded-lg bg-[#2C3E50]/70 border border-[#FFD54F]/10"
                                >
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold text-[#FFD54F]">{m.name_medicine}</p>
                                        <p className="text-[#F4E1C1]">
                                            {m.quantity} {m.name_unit || "Unit"}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        {/* Pagination Obat */}
                        {totalPages > 1 && (
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

                                <span className="text-[#F4E1C1]">Halaman {page} dari {totalPages}</span>

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
                    <p className="text-gray-400 text-center py-10">
                        🚫 Tidak ada data obat untuk transaksi ini.
                    </p>
                )}
            </DialogContent>
        </Dialog>
    )
}
