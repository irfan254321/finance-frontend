"use client"
import { motion } from "framer-motion"
import { Tabs } from "@/components/ui/tabs"
import { Snackbar, Alert, CircularProgress } from "@mui/material"

// 🔹 Hooks
import { useSpendingForm } from "@/hooks/spendingInput/useSpendingForm"
import { useCategorySpending } from "@/hooks/spendingInput/useCategorySpending"
import { useSpendingExcel } from "@/hooks/spendingInput/useSpendingExcel"
import { useCompanyMedicine } from "@/hooks/spendingInput/useCompanyMedicine"

// 🔹 Components
import TabSpending from "@/components/tabSpending/TabSpending"
import TabCategory from "@/components/tabSpending/TabCategory"
import TabExcel from "@/components/tabSpending/TabExcel"
import TabCompany from "@/components/tabSpending/TabCompany"

export default function InputSpendingPage() {
    const spending = useSpendingForm()
    const category = useCategorySpending()
    const excel = useSpendingExcel()
    const company = useCompanyMedicine()

    const activeAlert =
        spending.alert.open ? spending :
            category.alert.open ? category :
                excel.alert.open ? excel :
                    company.alert.open ? company : null

    const tabs = [
        { title: "Input Spending", value: "spending", content: <TabSpending {...spending} /> },
        { title: "Kategori", value: "category", content: <TabCategory {...category} /> },
        { title: "Import Excel", value: "excel", content: <TabExcel {...excel} /> },
        { title: "Company Medicine", value: "company", content: <TabCompany {...company} /> },
    ]

    return (
        <main className="min-h-screen font-serif text-[#ECECEC] px-6 md:px-20 py-24 bg-gradient-to-b from-[#0f141a]/70 via-[#1c2430]/80 to-[#12171d]/90 backdrop-blur-xl">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-16">
                <h1 className="text-5xl md:text-6xl font-extrabold text-[#FFD700]">INPUT PENGELUARAN RUMAH SAKIT</h1>
                <p className="text-gray-300 mt-4 text-lg max-w-3xl mx-auto">Kelola dan catat setiap pengeluaran dengan efisien dan transparan.</p>
            </motion.div>

            <div className="flex flex-col items-center">
                <Tabs tabs={tabs} />
            </div>

            {activeAlert && (
                <Snackbar
                    open={activeAlert.alert.open}
                    autoHideDuration={3000}
                    onClose={() =>
                        activeAlert.setAlert((prev: any) => ({
                            ...prev,
                            open: false,
                        }))
                    }>
                    <Alert severity={activeAlert.alert.severity} variant="filled">{activeAlert.alert.message}</Alert>
                </Snackbar>
            )
            }

            {
                excel.uploading && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-md">
                        <div className="flex flex-col items-center gap-4 px-8 py-6 bg-[#12171d]/80 rounded-2xl border border-[#FFD700]/30 shadow-[0_0_20px_rgba(255,215,0,0.2)]">
                            <CircularProgress size={44} sx={{ color: "#FFD700" }} />
                            <p className="text-lg text-[#FFD700]">Mengimpor data Excel…</p>
                        </div>
                    </div>
                )
            }
        </main >
    )
}
