"use client"

import { useEffect, useState } from "react"
import axiosInstance from "@/lib/axiosInstance"
import { TextField, Button, Snackbar, Alert, Avatar, Divider } from "@mui/material"
import { motion } from "framer-motion"

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [form, setForm] = useState({ name_users: "", username: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get("/me")
        const userData = res.data.data
        setUser(userData)
        setForm({
          name_users: userData.name_users,
          username: userData.username,
          password: "",
        })
      } catch (err: any) {
        setError("Gagal memuat profil (token invalid atau belum login)")
      }
    }
    fetchUser()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axiosInstance.put("/me/update", form)
      setUser(res.data.user)
      setSuccess(true)
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal update profil")
    } finally {
      setLoading(false)
    }
  }

  if (!user)
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-[#0f141a] to-[#1c2430] text-gray-400 text-lg">
        Memuat profil...
      </div>
    )

  return (
    <div className="relative flex flex-col items-center justify-start min-h-screen pt-32 overflow-hidden bg-gradient-to-br from-[#0f141a] via-[#1a2028] to-[#12171d]">
      {/* ✨ background decorative lights */}
      <div className="absolute top-0 left-0 w-[700px] h-[700px] bg-[radial-gradient(circle_at_top_left,rgba(255,215,0,0.12),transparent_70%)] blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.06),transparent_70%)] blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-3xl bg-gradient-to-br from-[#0f141a]/70 via-[#1c2430]/70 to-[#12171d]/70 backdrop-blur-2xl border border-white/10 shadow-[0_8px_35px_rgba(0,0,0,0.6)] rounded-3xl p-10"
      >
        {/* 🧑‍💼 Avatar + Judul */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative">
            <Avatar
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name_users}`}
              sx={{
                width: 130,
                height: 130,
                border: "3px solid rgba(255,215,0,0.7)",
                boxShadow: "0 0 30px rgba(255,215,0,0.3)",
              }}
            />
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(255,215,0,0.2),transparent_60%)] blur-lg"></div>
          </div>

          <h1 className="text-4xl font-bold mt-5 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] flex items-center gap-2">
            👤 Profil Saya
          </h1>
          <p className="text-gray-300 text-lg">
            Kelola informasi akun Anda di bawah ini
          </p>
        </div>

        {/* ✏️ Form Edit */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-6">
          <TextField
            label="Nama Lengkap"
            name="name_users"
            value={form.name_users}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ style: { color: "#ccc" } }}
            InputProps={{
              sx: {
                color: "white",
                borderRadius: "12px",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255,255,255,0.2)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#FFD700",
                },
              },
            }}
          />

          <TextField
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ style: { color: "#ccc" } }}
            InputProps={{
              sx: {
                color: "white",
                borderRadius: "12px",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255,255,255,0.2)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#FFD700",
                },
              },
            }}
          />

          <TextField
            label="Password (kosongkan jika tidak ingin ubah)"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ style: { color: "#ccc" } }}
            InputProps={{
              sx: {
                color: "white",
                borderRadius: "12px",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255,255,255,0.2)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#FFD700",
                },
              },
            }}
          />

          <div className="flex justify-center mt-6">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading || success}
                sx={{
                  background:
                    success
                      ? "linear-gradient(135deg, #4CAF50, #2E7D32)"
                      : "linear-gradient(135deg, #FFD700, #C19A00)",
                  color: "#111",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  px: 5,
                  py: 1.8,
                  borderRadius: "14px",
                  textTransform: "none",
                  boxShadow:
                    success
                      ? "0 0 25px rgba(76,175,80,0.4)"
                      : "0 0 25px rgba(255,215,0,0.3)",
                }}
              >
                {loading ? "Menyimpan..." : success ? "✅ Tersimpan!" : "💾 Simpan Perubahan"}
              </Button>
            </motion.div>
          </div>
        </form>

        <Divider sx={{ my: 6, borderColor: "rgba(255,255,255,0.1)" }} />

        {/* 📊 Info Tambahan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg text-gray-300">
          <p>
            <strong className="text-[#FFD700]">📌 Role:</strong> {user.role}
          </p>
          <p>
            <strong className="text-[#FFD700]">🕒 Terakhir Login:</strong>{" "}
            {new Date(user.last_login).toLocaleString("id-ID")}
          </p>
          <p>
            <strong className="text-[#FFD700]">📅 Akun Dibuat:</strong>{" "}
            {new Date(user.created_at).toLocaleDateString("id-ID")}
          </p>
          <p>
            <strong className="text-[#FFD700]">🆔 ID User:</strong> {user.id}
          </p>
        </div>
      </motion.div>

      {/* ✅ ALERT */}
      <Snackbar
        open={success}
        autoHideDuration={4000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setSuccess(false)}>
          Profil berhasil diperbarui ✅
        </Alert>
      </Snackbar>

      {error && (
        <Snackbar
          open={!!error}
          autoHideDuration={4000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        </Snackbar>
      )}
    </div>
  )
}
