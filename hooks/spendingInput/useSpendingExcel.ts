"use client"
import { useState } from "react"
import * as XLSX from "xlsx"
import axiosInstance from "@/lib/axiosInstance"

export function useSpendingExcel() {
  const [file, setFile] = useState<File | null>(null)
  const [previewData, setPreviewData] = useState<any[]>([])
  const [jenisUpload, setJenisUpload] = useState<"umum" | "obat">("umum")
  const [uploading, setUploading] = useState(false)
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  })

  // 📥 Preview file Excel
  const handleExcelSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)

    const reader = new FileReader()
    reader.onload = (event: any) => {
      const wb = XLSX.read(event.target.result, { type: "binary" })
      const sheet = wb.SheetNames[0]
      const raw = XLSX.utils.sheet_to_json(wb.Sheets[sheet])
      setPreviewData(raw)
    }
    reader.readAsBinaryString(f)
  }

  // 🚀 Upload ke backend
  const handleUploadExcel = async () => {
    if (!file) {
      setAlert({ open: true, message: "Pilih file dulu!", severity: "error" })
      return
    }

    try {
      setUploading(true)

      const formData = new FormData()
      formData.append("file", file) // ⚠️ harus sama dengan upload.single("file")
      formData.append("jenisUpload", jenisUpload)

      const url =
        jenisUpload === "umum"
          ? "/api/uploadSpendingExcelGeneral"
          : "/api/uploadSpendingExcelObat"

      const res = await axiosInstance.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      // kalau backend balikin preview data
      if (res.data?.preview) setPreviewData(res.data.preview)

      setAlert({
        open: true,
        message: "✅ Upload Excel berhasil!",
        severity: "success",
      })
      setFile(null)
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "❌ Gagal upload Excel!"
      setAlert({ open: true, message: msg, severity: "error" })
    } finally {
      setUploading(false)
    }
  }

  return {
    file,
    setFile,
    previewData,
    setPreviewData,
    jenisUpload,
    setJenisUpload,
    uploading,
    alert,
    setAlert,
    handleExcelSelect,
    handleUploadExcel,
  }
}
