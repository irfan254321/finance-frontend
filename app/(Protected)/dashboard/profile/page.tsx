"use client"

import { useEffect, useState } from "react"
import axiosInstance from "@/lib/axiosInstance"
import Cookies from "js-cookie"
import { TextField, Button, Snackbar, Alert, Avatar, Divider } from "@mui/material"
import { motion } from "framer-motion"

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null)
    const [form, setForm] = useState({ name_users: "", username: "", password: "" })
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const token = Cookies.get("token")
        axiosInstance
            .get("/me", { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => {
                setUser(res.data.user)
                setForm({
                    name_users: res.data.user.name_users,
                    username: res.data.user.username,
                    password: "",
                })
            })
            .catch(() => setError("Gagal memuat profil"))
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const token = Cookies.get("token")
            const res = await axiosInstance.put("/me/update", form, {
                headers: { Authorization: `Bearer ${token}` },
            })
            setUser(res.data.user)
            setSuccess(true)
        } catch (err: any) {
            setError(err.response?.data?.message || "Gagal update profil")
        } finally {
            setLoading(false)
        }
    }

    if (!user) return <div className="text-center text-gray-500 mt-32">Loading...</div>

    return (
        <div className="flex flex-col items-center justify-start min-h-screen pt-32 bg-gradient-to-b from-[#f9f9fb] to-[#eaecef]">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-3xl bg-white shadow-2xl rounded-3xl p-10 border border-gray-200"
            >
                {/* 🧑‍💼 Avatar + Judul */}
                <div className="flex flex-col items-center mb-10">
                    <Avatar
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name_users}`}
                        sx={{ width: 120, height: 120, border: "4px solid #FFD700" }}
                    />
                    <h1 className="text-4xl font-bold mt-4 text-[#2C3E50]">👤 Profil Saya</h1>
                    <p className="text-gray-500 text-lg">Kelola informasi akun Anda di bawah ini</p>
                </div>

                {/* ✏️ Form Edit (pakai flex + gap) */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-6">
                    <TextField
                        label="Nama Lengkap"
                        name="name_users"
                        value={form.name_users}
                        onChange={handleChange}
                        fullWidth
                        size="medium"
                        InputLabelProps={{ style: { fontSize: "1.1rem" } }}
                        inputProps={{ style: { fontSize: "1.2rem", padding: "14px" } }}
                    />

                    <TextField
                        label="Username"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        fullWidth
                        size="medium"
                        InputLabelProps={{ style: { fontSize: "1.1rem" } }}
                        inputProps={{ style: { fontSize: "1.2rem", padding: "14px" } }}
                    />

                    <TextField
                        label="Password (kosongkan jika tidak ingin ubah)"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        fullWidth
                        size="medium"
                        InputLabelProps={{ style: { fontSize: "1.1rem" } }}
                        inputProps={{ style: { fontSize: "1.2rem", padding: "14px" } }}
                    />

                    <div className="flex justify-center mt-4">
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={loading || success}
                            sx={{
                                background: success
                                    ? "linear-gradient(135deg, #4CAF50, #2E7D32)"
                                    : "linear-gradient(135deg, #2C3E50, #34495E)",
                                "&:hover": {
                                    background: success
                                        ? "linear-gradient(135deg, #43A047, #1B5E20)"
                                        : "linear-gradient(135deg, #1A252F, #2C3E50)",
                                    transform: "scale(1.03)",
                                    transition: "all 0.3s ease",
                                },
                                fontSize: "1.3rem",
                                padding: "14px 40px",
                                borderRadius: "16px",
                                textTransform: "none",
                                boxShadow: success
                                    ? "0 0 20px rgba(76, 175, 80, 0.5)"
                                    : "0 0 20px rgba(44, 62, 80, 0.4)",
                                transition: "all 0.3s ease-in-out",
                            }}
                        >
                            {loading ? (
                                <div className="flex items-center gap-3">
                                    <svg
                                        className="animate-spin h-6 w-6 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="white"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="white"
                                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                        ></path>
                                    </svg>
                                    Menyimpan...
                                </div>
                            ) : success ? (
                                <div className="flex items-center gap-3">
                                    ✅ <span>Tersimpan!</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    💾 <span>Simpan Perubahan</span>
                                </div>
                            )}
                        </Button>
                    </div>

                </form>

                <Divider sx={{ my: 6 }} />

                {/* 📊 Info Tambahan */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xl text-gray-700">
                    <p>
                        <strong>📌 Role:</strong> {user.role}
                    </p>
                    <p>
                        <strong>🕒 Terakhir Login:</strong>{" "}
                        {new Date(user.last_login).toLocaleString("id-ID")}
                    </p>
                    <p>
                        <strong>📅 Akun Dibuat:</strong>{" "}
                        {new Date(user.created_at).toLocaleDateString("id-ID")}
                    </p>
                    <p>
                        <strong>🆔 ID User:</strong> {user.id}
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
