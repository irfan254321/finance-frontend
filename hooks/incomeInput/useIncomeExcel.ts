"use client"

import { useState } from "react"
import axiosInstance from "@/lib/axiosInstance"
import * as XLSX from "xlsx"
import { CategoryIncome } from "./useCategoryIncome"

// ======================================================
// 🧹 SANITASI NILAI EXCEL
// ======================================================
function sanitizeValue(v: any) {
  if (v === null || v === undefined) return null

  // skip tanda -, kosong, spasi
  if (v === "-" || v === "" || v === " ") return null

  // kalau string angka → jadikan number
  if (typeof v === "string" && !isNaN(Number(v))) {
    v = Number(v)
  }

  // EXCEL SERIAL DATE → convert jadi YYYY-MM-DD
  if (typeof v === "number" && v > 30000 && v < 60000) {
    const excelEpoch = new Date((v - 25569) * 86400 * 1000)
    return excelEpoch.toISOString().slice(0, 10)
  }

  return v
}


// ======================================================
// 🧹 SANITASI 1 ROW
// ======================================================
function sanitizeRow(row: any) {
  const cleaned: any = {}
  Object.entries(row).forEach(([key, value]) => {
    cleaned[key] = sanitizeValue(value)
  })
  return cleaned
}

// ======================================================
// ✔ Row valid kalau ada minimal 1 isi meaningful
// ======================================================
function isValidRow(row: any) {
  return Object.values(row).some((v) => v !== null && v !== "")
}

// ======================================================
// 🚀 MAIN HOOK
// ======================================================
export function useIncomeExcel(categories: CategoryIncome[]) {
  const [file, setFile] = useState<File | null>(null)
  const [previewData, setPreviewData] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  })

  // ======================================================
  // 📥 PILIH FILE + AUTO CLEAN + SKIP INVALID ROW
  // ======================================================
  const handleExcelSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return
    setFile(selectedFile)

    const reader = new FileReader()
    reader.onload = (event: any) => {
      const workbook = XLSX.read(event.target.result, { type: "binary" })
      const sheet = workbook.SheetNames[0]

      let data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet])

      // 1️⃣ SANITASI VALUE
      data = data.map((row) => sanitizeRow(row))

      // 2️⃣ VALIDATE ROW (FILTER KETAT)
      data = data.filter((r: any) => {
        // name_income wajib ada
        if (!r.name_income || typeof r.name_income !== "string") return false

        // amount_income wajib > 0
        if (typeof r.amount_income !== "number" || r.amount_income <= 0)
          return false

        // category_id wajib ada
        if (!r.category_id || typeof r.category_id !== "number") return false

        // date_income wajib valid
        if (!r.date_income) return false
        const d = new Date(r.date_income)
        if (isNaN(d.getTime())) return false

        return true
      })

      // 3️⃣ SIMPAN PREVIEW YANG SUDAH BERSIH
      setPreviewData(data)
    }

    reader.readAsBinaryString(selectedFile)
  }


  // ======================================================
  // 📤 UPLOAD EXCEL KE BACKEND
  // ======================================================
  const handleUploadExcel = async () => {
    if (previewData.length === 0)
      return setAlert({
        open: true,
        message: "Tidak ada data valid yang bisa diupload!",
        severity: "error",
      })

    try {
      setUploading(true)

      const res = await axiosInstance.post(
        "/api/uploadIncomeExcel",
        { rows: previewData }, // ⬅ KIRIM DATA BERSIH
        { headers: { "Content-Type": "application/json" } }
      )

      setAlert({
        open: true,
        message: `✅ ${res.data.inserted} baris berhasil diimport!`,
        severity: "success",
      })

      setTimeout(() => window.location.reload(), 1200)
    } catch (err) {
      console.error(err)
      setAlert({
        open: true,
        message: "❌ Gagal upload data!",
        severity: "error",
      })
    } finally {
      setUploading(false)
    }
  }

  // ======================================================
  // 📄 DOWNLOAD TEMPLATE
  // ======================================================
  const handleDownloadTemplate = () => {
    const exampleRows = categories.length
      ? categories.map((cat) => ({
        name_income: `Contoh ${cat.name_category}`,
        amount_income: 100000,
        category_id: cat.id,
        date_income: "2025-01-01",
        kategori: cat.name_category,
      }))
      : [
        {
          name_income: "Klaim BPJS Januari",
          amount_income: 72000000,
          category_id: 1,
          date_income: "2025-01-01",
          kategori: "Klaim BPJS",
        },
      ]

    const worksheet = XLSX.utils.json_to_sheet(exampleRows)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template Income")
    XLSX.writeFile(workbook, "template_income.xlsx")
  }

  return {
    file,
    previewData,
    uploading,
    alert,
    setFile,
    setPreviewData,
    setAlert,
    handleExcelSelect,
    handleUploadExcel,
    handleDownloadTemplate,
  }
}
