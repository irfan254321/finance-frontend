"use client"

import { useEffect, useState } from "react"
import axiosInstance from "@/lib/axiosInstance"
import Cookies from "js-cookie"
import {
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material"

export default function AdminSlidePage() {
  const [slides, setSlides] = useState<any[]>([])
  const [form, setForm] = useState({ title: "", image_url: "" })
  const [editId, setEditId] = useState<number | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const token = Cookies.get("token")

  const fetchSlides = async () => {
    const res = await axiosInstance.get("/admin/slide", {
      headers: { Authorization: `Bearer ${token}` },
    })
    setSlides(res.data)
  }

  useEffect(() => {
    fetchSlides()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editId) {
      await axiosInstance.put(`/admin/slide/${editId}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setSuccess("✅ Slide berhasil diperbarui!")
    } else {
      await axiosInstance.post("/admin/slide", form, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setSuccess("✅ Slide berhasil ditambahkan!")
    }
    setForm({ title: "", image_url: "" })
    setEditId(null)
    fetchSlides()
  }

  const handleEdit = (slide: any) => {
    setForm({ title: slide.title, image_url: slide.image_url })
    setEditId(slide.id)
  }

  const handleDelete = async (id: number) => {
    await axiosInstance.delete(`/admin/slide/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    setSuccess("🗑️ Slide berhasil dihapus!")
    fetchSlides()
  }

  return (
    <div className="p-10 bg-[#f4f6f9] min-h-screen">
      <h1 className="text-4xl font-bold text-[#2C3E50] mb-10">🖼️ Kelola Slide Rumah Sakit</h1>

      {/* ➕ FORM Tambah/Edit */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 flex flex-col gap-6 max-w-2xl mb-12"
      >
        <TextField
          label="Judul Slide"
          name="title"
          value={form.title}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="URL Gambar"
          name="image_url"
          value={form.image_url}
          onChange={handleChange}
          fullWidth
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          sx={{
            backgroundColor: editId ? "#f39c12" : "#2C3E50",
            "&:hover": { backgroundColor: editId ? "#d68910" : "#1A252F" },
            fontSize: "1.2rem",
            padding: "12px 32px",
            borderRadius: "12px",
            textTransform: "none",
          }}
        >
          {editId ? "✏️ Perbarui Slide" : "➕ Tambah Slide"}
        </Button>
      </form>

      {/* 📋 TABEL SLIDE */}
      <Paper className="shadow-xl rounded-2xl overflow-hidden">
        <Table>
          <TableHead sx={{ backgroundColor: "#2C3E50" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontSize: "1.2rem" }}>Judul</TableCell>
              <TableCell sx={{ color: "white", fontSize: "1.2rem" }}>Gambar</TableCell>
              <TableCell sx={{ color: "white", fontSize: "1.2rem" }}>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {slides.map((slide) => (
              <TableRow key={slide.id}>
                <TableCell>{slide.title}</TableCell>
                <TableCell>
                  <img src={slide.image_url} alt={slide.title} className="w-40 rounded-xl" />
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleEdit(slide)}>✏️ Edit</Button>
                  <Button color="error" onClick={() => handleDelete(slide.id)}>
                    🗑️ Hapus
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* ✅ Snackbar Notif */}
      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success">{success}</Alert>
      </Snackbar>
    </div>
  )
}
