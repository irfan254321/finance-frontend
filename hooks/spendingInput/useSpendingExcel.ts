"use client"
import { useState } from "react"
import * as XLSX from "xlsx"
import axiosInstance from "@/lib/axiosInstance"

// ======================================================
// 🧹 CLEAN ALL SYMBOL AND SPACE FIRST AND LAST WORD
// ======================================================

function cleanName(str: string) {
  if (!str) return str;

  str = str.trim();

  // hapus simbol non huruf/angka di AWAL
  str = str.replace(/^[^A-Za-z0-9]+/, "");

  // hapus simbol non huruf/angka di AKHIR
  str = str.replace(/[^A-Za-z0-9]+$/, "");

  return str;
}

// ======================================================
// 🧹 SANITASI NILAI EXCEL
// ======================================================
function sanitizeValue(v: any) {
  if (v === null || v === undefined) return null;

  // buang spasi awal/akhir kalau string
  if (typeof v === "string") v = v.trim();

  // kosong / "-" → null
  if (v === "" || v === "-") return null;

  // 🎯 1. Excel serial date (40000-an)
  if (typeof v === "number" && v > 30000 && v < 60000) {
    const excelDate = new Date((v - 25569) * 86400 * 1000);
    return excelDate.toISOString().slice(0, 10);
  }

  // 🎯 2. Format tanggal dd/mm/yyyy
  if (typeof v === "string" && v.includes("/")) {
    const [d, m, y] = v.split("/");
    if (d && m && y) {
      return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
    }
  }

  // 🎯 3. Jika angka (string atau number)
  if (!isNaN(Number(v))) {
    return Number(v);
  }

  // 🎯 4. Bersihkan nama/string lain
  if (typeof v === "string") {
    v = cleanName(v);
    v = v.replace(/^\-+/, ""); // buang '-' di awal
    v = v.trim();
  }

  return v;
}


function sanitizePriceObat(v: any) {
  if (v === null || v === undefined) return 0
  if (v === "-" || v === "" || v === " ") return 0

  // Excel NaN / Invalid Number
  if (typeof v === "number" && isNaN(v)) return 0

  // Hapus format ribuan
  if (typeof v === "string") {
    const clean = v.replace(/[^0-9]/g, "")
    if (clean === "") return 0
    if (isNaN(Number(clean))) return null
    return Number(clean)
  }

  if (typeof v === "number") return v

  return null
}


// ======================================================
// 🧹 SANITASI ROW UMUM
// ======================================================
function sanitizeRowGeneral(r: any) {
  return {
    name_spending: sanitizeValue(r.name_spending),
    amount_spending: sanitizeValue(r.amount_spending),
    category_id: sanitizeValue(r.category_id),
    date_spending: sanitizeValue(r.date_spending),
  }
}



// ======================================================
// 🧹 SANITASI ROW OBAT
// ======================================================
function sanitizeMedicineRow(r: any) {
  return {
    name_spending: sanitizeValue(r.name_spending),
    category_id: sanitizeValue(r.category_id),
    date_spending: sanitizeValue(r.date_spending),
    company_id: sanitizeValue(r.company_id),
    name_medicine: sanitizeValue(r.name_medicine),
    quantity: sanitizeValue(r.quantity),
    unit_id: sanitizeValue(r.unit_id),
    price_per_item: sanitizePriceObat(r.price_per_item),
  }
}

// ======================================================
// ✔ VALIDATE UMUM
// ======================================================
function isValidRowGeneral(r: any) {
  return (
    r.name_spending &&
    typeof r.name_spending === "string" &&
    r.amount_spending &&
    typeof r.amount_spending === "number" &&
    r.amount_spending > 0 &&
    r.category_id &&
    typeof r.category_id === "number" &&
    r.date_spending
  )
}

// ======================================================
// ✔ VALIDATE OBAT
// ======================================================
function isValidMedicine(r: any) {
  return (
    r.name_spending &&
    r.category_id === 9 &&
    r.company_id &&
    r.date_spending &&
    r.name_medicine &&
    r.quantity > 0 &&
    typeof r.unit_id === "number" && r.unit_id >= 0 &&
    typeof r.price_per_item === "number"
  )
}

// ======================================================
// 🔥 GROUPING OBAT
// ======================================================
function groupMedicines(rows: any[]) {
  const groups: any = {}

  rows.forEach(r => {
    const key = `${r.name_spending}_${r.company_id}_${r.date_spending}`

    if (!groups[key]) {
      groups[key] = {
        name_spending: r.name_spending,
        category_id: r.category_id,
        date_spending: r.date_spending,
        company_id: r.company_id,
        items: []
      }
    }

    groups[key].items.push({
      name_medicine: r.name_medicine,
      quantity: r.quantity,
      unit_id: r.unit_id,
      price_per_item: r.price_per_item
    })
  })

  return Object.values(groups)
}

// ======================================================
// 🚀 MAIN HOOK
// ======================================================
export function useSpendingExcel() {
  const [file, setFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState("")
  const [previewData, setPreviewData] = useState<any[]>([])
  const [jenisUpload, setJenisUpload] = useState<"umum" | "obat">("umum")
  const [uploading, setUploading] = useState(false)
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  })

  // ======================================================
  // 📥 PILIH FILE EXCEL (AUTO SANITASI)
  // ======================================================
  const handleExcelSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return

    setFile(f)
    setFileName(f.name)

    const reader = new FileReader()
    reader.onload = (event: any) => {
      const wb = XLSX.read(event.target.result, { type: "binary" })
      const sheet = wb.SheetNames[0]
      let data = XLSX.utils.sheet_to_json(wb.Sheets[sheet])

      // OBAT MODE
      if (jenisUpload === "obat") {
        data = data.map(r => sanitizeMedicineRow(r))
        data = data.filter(r => isValidMedicine(r))
        setPreviewData(data)
        return
      }

      // UMUM MODE
      data = data.map(r => sanitizeRowGeneral(r))
      data = data.filter(r => isValidRowGeneral(r))
      setPreviewData(data)
    }

    reader.readAsBinaryString(f)
  }

  // ======================================================
  // 🚀 UPLOAD DATA GENERAL / NON OBAT
  // ======================================================
  const uploadGeneral = async () => {
    const res = await axiosInstance.post(
      "/api/uploadSpendingExcelGeneral",
      { rows: previewData },
      { headers: { "Content-Type": "application/json" } }
    )
    return res
  }

  // ======================================================
  // 🚀 UPLOAD DATA OBAT (GROUPED)
  // ======================================================
  const uploadObat = async () => {
    const grouped = groupMedicines(previewData)

    const res = await axiosInstance.post(
      "/api/uploadSpendingExcelObat",
      { data: grouped },
      { headers: { "Content-Type": "application/json" } }
    )
    return res
  }

  // ======================================================
  // 🚀 HANDLE UPLOAD FINAL
  // ======================================================
  const handleUploadExcel = async () => {
    if (previewData.length === 0) {
      setAlert({
        open: true,
        message: "Tidak ada data valid untuk diupload!",
        severity: "error",
      })
      return
    }

    try {
      setUploading(true)

      const res =
        jenisUpload === "obat"
          ? await uploadObat()
          : await uploadGeneral()

      setAlert({
        open: true,
        message: res.data.message ?? "Berhasil upload!",
        severity: "success",
      })

      setFileName("")
      setPreviewData([])

    } catch (err: any) {
      setAlert({
        open: true,
        message: err.response?.data?.message ?? "Gagal upload!",
        severity: "error",
      })
    } finally {
      setUploading(false)
    }
  }

  // ======================================================
  // 📄 DOWNLOAD TEMPLATE
  // ======================================================
  const handleDownloadTemplate = (type: "spending" | "company" | "unit") => {
    let url = "";
    let filename = "";

    switch (type) {
      case "spending":
        url = "/template/template_spendingobat.xlsx";
        filename = "template_spendingobat.xlsx";
        break;
      case "company":
        url = "/template/template_name_company.xlsx";
        filename = "template_name_company.xlsx";
        break;
      case "unit":
        url = "/template/template_name_unit.xlsx";
        filename = "template_name_unit.xlsx";
        break;
    }

    if (!url) return;

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    file,
    setFile,
    fileName,
    setFileName,
    previewData,
    setPreviewData,
    jenisUpload,
    setJenisUpload,
    uploading,
    alert,
    setAlert,
    handleExcelSelect,
    handleUploadExcel,
    handleDownloadTemplate, // Export function
  }

}
