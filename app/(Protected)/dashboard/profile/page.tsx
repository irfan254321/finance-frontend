"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { Button, Snackbar, Alert, Avatar, Divider } from "@mui/material";
import { motion } from "framer-motion";
import InputForm from "@/components/InputForm";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);

  const [form, setForm] = useState({
    name_users: "",
    username: "",
    password: "",
  });

  const [search, setSearch] = useState("");

  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  const [adminForm, setAdminForm] = useState({
    name_users: "",
    username: "",
    password: "",
  });

  const filteredUsers = allUsers.filter((u) =>
    u.name_users.toLowerCase().includes(search.toLowerCase())
  );

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMe();
    loadUsers();
  }, []);

  const loadMe = async () => {
    try {
      const res = await axiosInstance.get("/me");
      const data = res.data.data;
      setUser(data);
      setForm({
        name_users: data.name_users,
        username: data.username,
        password: "",
      });
    } catch {
      setError("Gagal memuat profil");
    }
  };

  const loadUsers = async () => {
    try {
      const res = await axiosInstance.get("/users");
      setAllUsers(res.data.data);
    } catch {
      // ignore kalau bukan admin
    }
  };

  const handleChange = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdminChange = (e: any) =>
    setAdminForm({ ...adminForm, [e.target.name]: e.target.value });

  const updateMe = async (e: any) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.put("/me/update", form);
      setUser(res.data.user);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal update profil");
    }
  };

  const updateOther = async (e: any) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/users/${selectedUser.id}`, adminForm);
      setSuccess(true);
      loadUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal update user lain");
    }
  };

  if (!user)
    return (
      <div className="flex items-center justify-center h-screen text-gray-400">
        Memuat profil...
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b0f16] via-[#1a2732] to-[#0b0f16] text-white px-6">
      {/* WRAPPER SAMA PERSIS FORMAT LOGIN */}
      <div className="w-full max-w-7xl min-h-[900px] bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* =========================== */}
        {/*   KIRI: PROFIL SAYA         */}
        {/* =========================== */}
        <div className="flex flex-col justify-center px-10 py-16 bg-white/5 border-r border-white/10">
          <div className="flex flex-col items-center mb-10">
            <Avatar
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name_users}`}
              sx={{
                width: 120,
                height: 120,
                border: "3px solid #FFD700",
              }}
            />
            <h1 className="text-3xl font-bold mt-4 uppercase">Profil</h1>
          </div>

          <form onSubmit={updateMe} className="flex flex-col gap-6">
            <InputForm
              label="Nama Lengkap"
              name="name_users"
              value={form.name_users}
              onChange={handleChange}
            />

            <InputForm
              label="Username"
              name="username"
              value={form.username}
              onChange={handleChange}
            />

            <InputForm
              label="Password (kosongkan jika tidak ubah)"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
            />

            <Button
              type="submit"
              variant="contained"
              sx={{
                mt: 2,
                background: "#FFD700",
                color: "#222",
                fontWeight: "bold",
              }}
            >
              💾 Simpan Perubahan
            </Button>
          </form>

          <Divider sx={{ my: 6, borderColor: "rgba(255,255,255,0.1)" }} />

          <div className="space-y-2 text-lg">
            <p>
              <strong className="text-yellow-400">📌 Role:</strong> {user.role}
            </p>
            <p>
              <strong className="text-yellow-400">🕒 Terakhir Login:</strong>{" "}
              {new Date(user.last_login).toLocaleString("id-ID")}
            </p>
            <p>
              <strong className="text-yellow-400">🆔 ID User:</strong> {user.id}
            </p>
          </div>
        </div>

        {/* =========================== */}
        {/*   KANAN: ADMIN PANEL        */}
        {/* =========================== */}

        {user.role === "admin" && (
          <div className="flex flex-col justify-center px-10 py-16">
            <h2 className="text-3xl font-bold mb-6">🧑‍💼 Kelola User Lain</h2>

            {/* 🔍 SEARCH BAR */}
            <InputForm
              label="Cari user…"
              name="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {/* 📋 LIST USER */}
            <div className="max-h-60 overflow-y-auto mt-4 mb-6 bg-white/5 border border-white/10 rounded-lg p-4">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      setSelectedUser(u);
                      setAdminForm({
                        name_users: u.name_users,
                        username: u.username,
                        password: "",
                      });
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-white/10 rounded-md"
                  >
                    {u.name_users}{" "}
                    <span className="text-yellow-300">({u.role})</span>
                  </button>
                ))
              ) : (
                <p className="text-gray-400 px-4 py-2">
                  Tidak ada user ditemukan…
                </p>
              )}
            </div>

            {/* FORM EDIT */}
            {selectedUser && (
              <form onSubmit={updateOther} className="flex flex-col gap-6 mt-4">
                <h3 className="text-2xl font-semibold mb-3">
                  ✏️ Edit: {selectedUser.name_users}
                </h3>

                <InputForm
                  label="Nama"
                  name="name_users"
                  value={adminForm.name_users}
                  onChange={handleAdminChange}
                />

                <InputForm
                  label="Username"
                  name="username"
                  value={adminForm.username}
                  onChange={handleAdminChange}
                />

                <InputForm
                  label="Password baru (opsional)"
                  name="password"
                  type="password"
                  value={adminForm.password}
                  onChange={handleAdminChange}
                />

                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    mt: 2,
                    background: "#FFD700",
                    color: "#222",
                    fontWeight: "bold",
                  }}
                >
                  💾 Perbarui User
                </Button>
              </form>
            )}
          </div>
        )}
      </div>

      {/* SUCCESS */}
      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ zIndex: 999999 }}
      >
        <Alert severity="success" variant="filled">
          Berhasil disimpan!
        </Alert>
      </Snackbar>

      {/* ERROR */}
      <Snackbar
        open={!!error}
        autoHideDuration={3000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ zIndex: 999999 }}
      >
        <Alert severity="error" variant="filled">
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
}
