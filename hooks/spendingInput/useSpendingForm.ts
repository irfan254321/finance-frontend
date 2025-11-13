"use client"
import { useState, useMemo, useEffect } from "react"
import axiosInstance from "@/lib/axiosInstance"

const OBAT_CATEGORY_ID = 9

// 🧩 Tipe bantu
type FieldName = "name_medicine" | "quantity" | "name_unit_id" | "price"

interface MedicineItem {
  name_medicine: string
  quantity: string
  name_unit_id: string
  price: string
}

interface AlertState {
  open: boolean
  message: string
  severity: "success" | "error" | "info"
}

export function useSpendingForm() {
  const [form, setForm] = useState({
    name_spending: "",
    amount_spending: "",
    category_id: "",
    date_spending: "",
    company_id: "",
  })

  const [categories, setCategories] = useState<any[]>([])
  const [companies, setCompanies] = useState<any[]>([])
  const [units, setUnits] = useState<any[]>([])

  // ✅ Sekarang tiap item medicine punya tipe yang jelas
  const [medicines, setMedicines] = useState<MedicineItem[]>([
    { name_medicine: "", quantity: "", name_unit_id: "", price: "" },
  ])

  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState<AlertState>({
    open: false,
    message: "",
    severity: "success",
  })

  // =====================
  // 📦 Fetchers
  // =====================
  const getCategories = async () => {
    try {
      const res = await axiosInstance.get("/api/CategorySpending")
      setCategories(res.data)
    } catch {
      setAlert({ open: true, message: "Gagal memuat kategori.", severity: "error" })
    }
  }

  const getCompanies = async () => {
    try {
      const res = await axiosInstance.get("/api/CompanyMedicine")
      setCompanies(res.data)
    } catch {
      setAlert({ open: true, message: "Gagal memuat company.", severity: "error" })
    }
  }

  const getUnits = async () => {
    try {
      const res = await axiosInstance.get("/api/unitMedicine")
      setUnits(res.data)
    } catch {
      setAlert({ open: true, message: "Gagal memuat unit obat.", severity: "error" })
    }
  }

  useEffect(() => {
    getCategories()
    getCompanies()
    getUnits()
  }, [])

  // =====================
  // 💰 Hitung Total Obat
  // =====================
  const totalObat = useMemo(
    () =>
      medicines.reduce((sum, r) => {
        const clean = String(r.price ?? "").replace(/[^0-9]/g, "")
        const val = clean ? Number(clean) : 0
        return sum + val
      }, 0),
    [medicines]
  )

  // =====================
  // 🧠 Handlers
  // =====================
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleMedicineChange = (index: number, field: FieldName, val: string) => {
    setMedicines((prev) => {
      const next = [...prev]
      // ✅ TypeScript tahu bahwa field valid di sini
      next[index][field] = field === "price" ? val.replace(/[^0-9]/g, "") : val
      return next
    })
  }

  const addMedicine = () =>
    setMedicines((prev) => [...prev, { name_medicine: "", quantity: "", name_unit_id: "", price: "" }])

  const removeMedicine = (i: number) =>
    setMedicines((prev) => (prev.length > 1 ? prev.filter((_, x) => x !== i) : prev))

  // =====================
  // 💾 Submit
  // =====================
  const handleSubmitSpending = async (e: React.FormEvent) => {
    e.preventDefault()
    const isObat = String(form.category_id) === String(OBAT_CATEGORY_ID)

    try {
      setLoading(true)
      const payload: any = {
        ...form,
        amount_spending: isObat ? Number(totalObat) : Number(form.amount_spending),
        category_id: Number(form.category_id),
      }

      if (isObat) {
        payload.medicines = medicines.map((m) => ({
          name_medicine: m.name_medicine,
          quantity: Number(m.quantity),
          name_unit_id: Number(m.name_unit_id),
          price_per_item: Number(m.price),
        }))
      }

      await axiosInstance.post("/api/inputSpendingDetail", payload)
      setAlert({ open: true, message: "✅ Data spending tersimpan!", severity: "success" })
      setForm({ name_spending: "", amount_spending: "", category_id: "", date_spending: "", company_id: "" })
      setMedicines([{ name_medicine: "", quantity: "", name_unit_id: "", price: "" }])
    } catch (err: any) {
      setAlert({ open: true, message: err?.response?.data || "Gagal simpan data!", severity: "error" })
    } finally {
      setLoading(false)
    }
  }

  return {
    form,
    setForm,
    categories,
    companies,
    units,
    medicines,
    totalObat,
    loading,
    alert,
    setMedicines,
    setAlert,
    handleChange,
    handleMedicineChange,
    addMedicine,
    removeMedicine,
    handleSubmitSpending,
  }
}
