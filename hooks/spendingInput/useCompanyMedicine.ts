"use client"
import { useState, useEffect, useMemo } from "react"
import axiosInstance from "@/lib/axiosInstance"

export function useCompanyMedicine() {
  const [companies, setCompanies] = useState<any[]>([])
  const [formCompany, setFormCompany] = useState("")
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  })

  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("") // 🔥 Untuk debounce
  const [page, setPage] = useState(1)
  const rowsPerPage =
  typeof window !== "undefined"
    ? window.innerWidth < 600
      ? 6          // mobile = 6
      : window.innerWidth < 1024
      ? 12         // tablet = 12
      : 15         // desktop = 15
    : 15


  // ======================================================
  // 🔥 SEARCH DEBOUNCE — supaya API ga spam
  // ======================================================
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1) // Reset ke page 1 kalau search berubah
    }, 300)

    return () => clearTimeout(timer)
  }, [search])

  // ======================================================
  // 🔥 FETCH COMPANY (dipanggil hanya saat debounce)
  // ======================================================
  const getCompanies = async () => {
    try {
      setLoading(true)
      const res = await axiosInstance.get("/api/CompanyMedicine", {
        params: { search: debouncedSearch },
      })
      setCompanies(res.data)
    } catch {
      setAlert({
        open: true,
        message: "Gagal memuat company!",
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getCompanies()
  }, [debouncedSearch])

  // ======================================================
  // 🔥 PAGINATION PROCESSING
  // ======================================================
  const pageCount = Math.max(1, Math.ceil(companies.length / rowsPerPage))

  const pagedCompanies = useMemo(() => {
    const start = (page - 1) * rowsPerPage
    return companies.slice(start, start + rowsPerPage)
  }, [companies, page])

  // ======================================================
  // 🔥 SUBMIT NEW COMPANY
  // ======================================================
  const handleSubmitCompany = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)

      await axiosInstance.post("/api/inputCompanyMedicine", {
        name_company: formCompany,
      })

      setFormCompany("")
      setSearch("")   // Reset search supaya data full
      setDebouncedSearch("")
      setPage(1)

      await getCompanies()

      setAlert({
        open: true,
        message: "✅ Company tersimpan!",
        severity: "success",
      })
    } catch {
      setAlert({
        open: true,
        message: "Gagal simpan company!",
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  return {
    companies,
    formCompany,
    setFormCompany,
    loading,
    alert,
    setAlert,

    search,
    setSearch,

    page,
    setPage,
    pageCount,
    pagedCompanies,
    handleSubmitCompany,
  }
}
