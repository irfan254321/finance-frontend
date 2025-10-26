"use client"

import { useState } from "react"
import axiosInstance from "@/lib/axiosInstance"
import * as XLSX from "xlsx"
import { CategoryIncome } from "./useCategoryIncome"

export function useIncomeExcel(categories: CategoryIncome[]) {
  const [file, setFile] = useState<File | null>(null)
  const [previewData, setPreviewData] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  })

  // ===============================
  // 🔹 PILIH & PREVIEW FILE EXCEL
  // ===============================
  const handleExcelSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return
    setFile(selectedFile)

    const reader = new FileReader()
    reader.onload = (event: any) => {
      const workbook = XLSX.read(event.target.result, { type: "binary" })
      const sheet = workbook.SheetNames[0]
      const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
      setPreviewData(data)
    }
    reader.readAsBinaryString(selectedFile)
  }

  // ===============================
  // 🔹 UPLOAD FILE KE BACKEND
  // ===============================
  const handleUploadExcel = async () => {
    if (!file)
      return setAlert({
        open: true,
        message: "Pilih file terlebih dahulu!",
        severity: "error",
      })

    try {
      setUploading(true)
      const formData = new FormData()
      formData.append("file", file)

      const res = await axiosInstance.post("/api/uploadIncomeExcel", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      if (res.status === 200) {
        setAlert({
          open: true,
          message: `✅ ${res.data.inserted} baris berhasil diimport!`,
          severity: "success",
        })
        // optional reload
        setTimeout(() => window.location.reload(), 1200)
      }
    } catch (err) {
      console.error(err)
      setAlert({
        open: true,
        message: "❌ Gagal upload file!",
        severity: "error",
      })
    } finally {
      setUploading(false)
    }
  }

  // ===============================
  // 🔹 DOWNLOAD TEMPLATE EXCEL
  // ===============================
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
    setAlert,
    handleExcelSelect,
    handleUploadExcel,
    handleDownloadTemplate,
  }
}
