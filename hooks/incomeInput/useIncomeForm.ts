"use client"

import { useState } from "react"
import axiosInstance from "@/lib/axiosInstance"

export interface IncomeFormData {
  name_income: string
  amount_income: string
  category_id: string
  date_income: string
}

export function useIncomeForm() {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<IncomeFormData>({
    name_income: "",
    amount_income: "",
    category_id: "",
    date_income: "",
  })

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  })

  // 🔹 Handle input form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  // 🔹 Simpan income
  const handleSubmitIncome = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.name_income || !form.amount_income || !form.category_id || !form.date_income) {
      return setAlert({
        open: true,
        message: "Semua kolom wajib diisi!",
        severity: "error",
      })
    }

    try {
      setLoading(true)
      const res = await axiosInstance.post("/api/inputIncomeDetail", form)
      if (res.status === 200) {
        setAlert({
          open: true,
          message: "✅ Data income berhasil disimpan!",
          severity: "success",
        })
        setForm({
          name_income: "",
          amount_income: "",
          category_id: "",
          date_income: "",
        })
      }
    } catch (err) {
      console.error(err)
      setAlert({
        open: true,
        message: "❌ Gagal menyimpan data!",
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    form,
    setForm,
    alert,
    setAlert,
    handleChange,
    handleSubmitIncome,
  }
}
