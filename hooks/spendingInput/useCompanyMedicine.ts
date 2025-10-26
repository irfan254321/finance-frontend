"use client"
import { useState, useEffect, useMemo } from "react"
import axiosInstance from "@/lib/axiosInstance"

export function useCompanyMedicine() {
  const [companies, setCompanies] = useState<any[]>([])
  const [formCompany, setFormCompany] = useState("")
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [alert, setAlert] = useState({ open: false, message: "", severity: "success" as "success" | "error" })
  const [page, setPage] = useState(1)
  const rowsPerPage = 10

  const getCompanies = async () => {
    try {
      const res = await axiosInstance.get("/api/CompanyMedicine", { params: { search } })
      setCompanies(res.data)
    } catch {
      setAlert({ open: true, message: "Gagal memuat company!", severity: "error" })
    }
  }

  useEffect(() => { getCompanies() }, [search])

  const pageCount = Math.max(1, Math.ceil(companies.length / rowsPerPage))
  const pagedCompanies = useMemo(() => {
    const start = (page - 1) * rowsPerPage
    return companies.slice(start, start + rowsPerPage)
  }, [companies, page])

  const handleSubmitCompany = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      await axiosInstance.post("/api/inputCompanyMedicine", { name_company: formCompany })
      setFormCompany("")
      getCompanies()
      setAlert({ open: true, message: "✅ Company tersimpan!", severity: "success" })
    } catch {
      setAlert({ open: true, message: "Gagal simpan company!", severity: "error" })
    } finally {
      setLoading(false)
    }
  }

  return { companies, formCompany, setFormCompany, loading, alert, setAlert, page, setPage, pageCount, pagedCompanies, search, setSearch, handleSubmitCompany }
}
