"use client"

import { motion } from "framer-motion"
import { Tabs } from "@/components/ui/tabs"
import { Snackbar, Alert, CircularProgress } from "@mui/material"

// 🧩 Modular Hooks
import { useIncomeForm } from "@/hooks/incomeInput/useIncomeForm"
import { useCategoryIncome } from "@/hooks/incomeInput/useCategoryIncome"
import { useIncomeExcel } from "@/hooks/incomeInput/useIncomeExcel"

// 🧩 Import komponen tab
import TabIncome from "@/components/tabIncome/TabIncome"
import TabCategory from "@/components/tabIncome/TabCategory"
import TabExcel from "@/components/tabIncome/TabExcel"

/**
 * ==========================================================
 * 📄 InputIncomePage
 * ----------------------------------------------------------
 * Halaman utama untuk input pemasukan.
 * Semua logika disiapkan di sini lewat hooks,
 * lalu dikirim ke masing-masing komponen Tab:
 *  - TabIncome   → form pemasukan manual
 *  - TabCategory → input kategori pemasukan
 *  - TabExcel    → upload & import data Excel
 * ==========================================================
 */
export default function InputIncomePage() {
  // ====== HOOK KATEGORI ======
  const {
    categories,
    categoryName,
    setCategoryName,
    loading: catLoading,
    alert: catAlert,
    setAlert: setCatAlert,
    handleSubmitCategory,
  } = useCategoryIncome()

  // ====== HOOK FORM PEMASUKAN ======
  const {
    form,
    handleChange,
    handleSubmitIncome,
    loading: formLoading,
    alert: formAlert,
    setAlert: setFormAlert,
  } = useIncomeForm()

  // ====== HOOK EXCEL ======
  const {
    file,
    previewData,
    uploading,
    alert: excelAlert,
    setAlert: setExcelAlert,
    handleExcelSelect,
    handleUploadExcel,
    handleDownloadTemplate,
  } = useIncomeExcel(categories)

  // ====== GABUNG ALERT ======
  const activeAlert =
    formAlert.open
      ? { ...formAlert, setAlert: setFormAlert }
      : catAlert.open
      ? { ...catAlert, setAlert: setCatAlert }
      : excelAlert.open
      ? { ...excelAlert, setAlert: setExcelAlert }
      : null

  // ====== KONFIGURASI TAB ======
  const tabs = [
    {
      title: "Input Income",
      value: "income",
      content: (
        <TabIncome
          form={form}
          handleChange={handleChange}
          handleSubmitIncome={handleSubmitIncome}
          loading={formLoading}
          categories={categories}
        />
      ),
    },
    {
      title: "Input Kategori",
      value: "category",
      content: (
        <TabCategory
          categoryName={categoryName}
          setCategoryName={setCategoryName}
          handleSubmitCategory={handleSubmitCategory}
          loading={catLoading}
          categories={categories}
        />
      ),
    },
    {
      title: "Import Excel",
      value: "excel",
      content: (
        <TabExcel
          file={file}
          previewData={previewData}
          uploading={uploading}
          handleExcelSelect={handleExcelSelect}
          handleUploadExcel={handleUploadExcel}
          handleDownloadTemplate={handleDownloadTemplate}
        />
      ),
    },
  ]

  // ====== RENDER HALAMAN ======
  return (
    <main className="min-h-screen font-serif text-[#ECECEC] px-6 md:px-20 py-24 bg-gradient-to-b from-[#0f141a]/70 via-[#1c2430]/80 to-[#12171d]/90 backdrop-blur-xl">
      {/* 🏷️ HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold text-[#FFD700] drop-shadow-[0_2px_10px_rgba(255,215,0,0.2)]">
          INPUT PEMASUKAN RUMAH SAKIT
        </h1>
        <p className="text-gray-300 mt-4 text-lg max-w-3xl mx-auto">
          Kelola dan catat setiap sumber pendapatan dengan efisien, transparan, dan modern.
        </p>
      </motion.div>

      {/* 🧩 TAB NAVIGATION */}
      <div className="relative flex flex-col items-center">
        <Tabs tabs={tabs} />
      </div>

      {/* 🌀 LOADING OVERLAY (IMPORT EXCEL) */}
      {uploading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-md">
          <div className="flex flex-col items-center gap-4 px-8 py-6 bg-[#12171d]/80 rounded-2xl border border-[#FFD700]/30 shadow-[0_0_20px_rgba(255,215,0,0.2)]">
            <CircularProgress size={44} sx={{ color: "#FFD700" }} />
            <p className="text-lg text-[#FFD700]">Mengimpor data Excel…</p>
            <p className="text-sm text-gray-400">Tunggu sebentar ya</p>
          </div>
        </div>
      )}

      {/* 🔔 SNACKBAR ALERT */}
      {activeAlert && (
        <Snackbar
          open={activeAlert.open}
          autoHideDuration={3000}
          onClose={() => activeAlert.setAlert({ ...activeAlert, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            severity={activeAlert.severity}
            variant="filled"
            sx={{ fontSize: "1rem", borderRadius: "10px" }}
          >
            {activeAlert.message}
          </Alert>
        </Snackbar>
      )}
    </main>
  )
}
