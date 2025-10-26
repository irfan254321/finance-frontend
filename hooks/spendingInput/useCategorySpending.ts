"use client"
import { useState } from "react"
import axiosInstance from "@/lib/axiosInstance"

export function useCategorySpending() {
  const [categoryName, setCategoryName] = useState("")
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState({ open: false, message: "", severity: "success" as "success" | "error" })

  const getCategories = async () => {
    try {
      const res = await axiosInstance.get("/api/CategorySpending")
      setCategories(res.data)
    } catch {
      setAlert({ open: true, message: "Gagal memuat kategori!", severity: "error" })
    }
  }

  const handleSubmitCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      await axiosInstance.post("/api/inputCategorySpending", { name_category: categoryName })
      setAlert({ open: true, message: "✅ Kategori tersimpan!", severity: "success" })
      setCategoryName("")
      getCategories()
    } catch {
      setAlert({ open: true, message: "Gagal simpan kategori!", severity: "error" })
    } finally {
      setLoading(false)
    }
  }

  return { categoryName, setCategoryName, categories, loading, alert, setAlert, handleSubmitCategory, getCategories }
}
