"use client"

import { useState, useEffect } from "react"
import axiosInstance from "@/lib/axiosInstance"

export interface CategoryIncome {
  id: number
  name_category: string
}

export function useCategoryIncome() {
  const [categories, setCategories] = useState<CategoryIncome[]>([])
  const [categoryName, setCategoryName] = useState("")
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  })

  // ===============================
  // 🔹 GET CATEGORY
  // ===============================
  const getCategories = async () => {
    try {
      const res = await axiosInstance.get("/api/categoryIncome")
      setCategories(res.data)
    } catch (err) {
      console.error("❌ Gagal memuat kategori:", err)
    }
  }

  useEffect(() => {
    getCategories()
  }, [])

  // ===============================
  // 🔹 ADD CATEGORY
  // ===============================
  const handleSubmitCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!categoryName.trim()) {
      return setAlert({
        open: true,
        message: "Nama kategori tidak boleh kosong!",
        severity: "error",
      })
    }

    try {
      setLoading(true)
      const res = await axiosInstance.post("/api/inputCategoryIncome", {
        name_category: categoryName,
      })
      if (res.status === 200) {
        setAlert({
          open: true,
          message: "✅ Kategori berhasil disimpan!",
          severity: "success",
        })
        setCategoryName("")
        getCategories()
      }
    } catch (err) {
      console.error(err)
      setAlert({
        open: true,
        message: "❌ Gagal menyimpan kategori!",
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  return {
    categories,
    categoryName,
    setCategoryName,
    loading,
    alert,
    setAlert,
    getCategories,
    handleSubmitCategory,
  }
}
