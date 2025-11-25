"use client";

import { useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import InputForm from "@/components/InputForm";

export default function RegisterPage() {
  const router = useRouter();
  const [nameUsers, setNameUsers] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e: any) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("❌ Konfirmasi password tidak cocok");
      return;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password)) {
      setError(
        "⚠️ Password minimal 8 karakter dan wajib mengandung huruf besar, kecil, angka, dan simbol"
      );
      return;
    }

    try {
      await axiosInstance.post("/register", {
        name_users: nameUsers,
        username,
        password,
      });
      setSuccess("✅ Registrasi berhasil! Silakan login.");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Registrasi gagal");
    }
  };

  return (
    <div className=" flex items-center justify-center px-4">
      <div className=" w-full max-w-7xl min-h-[900px] bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 justify-center">
        {/* KIRI – BRANDING */}
        <div className="hidden md:flex flex-col items-center justify-center px-10 py-16 text-center bg-white/5 border-r border-white/10">
          <img
            src="/logo-rs.png"
            alt="Logo"
            className="w-28 h-28 mb-6 drop-shadow-[0_0_15px_rgba(255,215,0,0.4)]"
          />
          <h1 className="text-3xl font-bold text-white leading-snug">
            Sistem Informasi
            <br />
            Keuangan RS Bhayangkara
          </h1>
        </div>

        {/* KANAN – FORM LOGIN */}
        <div className="p-10 md:p-14">
          <h2 className="text-7xl font-semibold text-[#FFD700] mb-8 mt-20 text-center uppercase">
            sign up
          </h2>
          <form onSubmit={handleRegister} className="flex flex-col">
            {/* Full Name */}
            <div className="mb-5">
              <InputForm
                label="Full Name"
                name="fullname"
                value={nameUsers}
                onChange={(e) => setNameUsers(e.target.value)}
              />
            </div>

            {/* Username */}
            <div className="mb-5">
              <InputForm
                label="User Name"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="relative mb-5">
              <InputForm
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-[50px] text-gray-400 hover:text-[#FFD700] transition"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative mb-8">
              <InputForm
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-[50px] text-gray-400 hover:text-[#FFD700] transition"
              >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Alerts */}
            {error && (
              <p className="text-red-400 text-sm text-center mb-2">{error}</p>
            )}
            {success && (
              <p className="text-green-400 text-sm text-center mb-2">
                {success}
              </p>
            )}

            {/* Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              type="submit"
              className="w-full py-3.5 font-semibold rounded-xl bg-gradient-to-r from-[#FFD700] via-[#F6E27F] to-[#C9A800] text-[#1C1C1C] shadow-[0_0_35px_rgba(255,215,0,0.35)] hover:shadow-[0_0_50px_rgba(255,215,0,0.55)] transition-all duration-300 text-[1.2rem]"
            >
              Sign Up
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
}
