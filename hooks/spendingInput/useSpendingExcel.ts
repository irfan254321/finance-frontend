"use client"
import { useState } from "react"
import * as XLSX from "xlsx"
import axiosInstance from "@/lib/axiosInstance"

export function useSpendingExcel() {
  const [file, setFile] = useState<File | null>(null)
  const [previewData, setPreviewData] = useState<any[]>([])
  const [jenisUpload, setJenisUpload] = useState<"umum" | "obat">("umum")
  const [uploading, setUploading] = useState(false)
  const [alert, setAlert] = useState({ open: false, message: "", severity: "success" as "success" | "error" })

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

  const handleUploadExcel = async () => {
    if (!file) return setAlert({ open: true, message: "Pilih file dulu!", severity: "error" })
    try {
      setUploading(true)
      const formData = new FormData()
      formData.append("file", file)
      const url = jenisUpload === "umum" ? "/api/uploadSpendingExcelGeneral" : "/api/uploadSpendingExcelObat"
      await axiosInstance.post(url, formData)
      setAlert({ open: true, message: "✅ Upload berhasil!", severity: "success" })
      setFile(null)
      setPreviewData([])
    } catch {
      setAlert({ open: true, message: "Gagal upload!", severity: "error" })
    } finally {
      setUploading(false)
    }
  }

  return { file, previewData, jenisUpload, setJenisUpload, uploading, alert, setAlert, handleExcelSelect, handleUploadExcel }
}
