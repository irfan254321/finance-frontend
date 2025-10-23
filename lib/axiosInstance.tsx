import axios from "axios"
import Cookies from "js-cookie"

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:3100",
  withCredentials: true, // ✅ kirim cookie JWT otomatis
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
})

// 🧠 Interceptor untuk setiap request: tambahkan Authorization header dari cookie
axiosInstance.interceptors.request.use((config) => {
  const token = Cookies.get("token")
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ⚠️ Deteksi otomatis kalau token expired
axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      console.warn("⚠️ Unauthorized — kemungkinan token expired.")
      Cookies.remove("token") // biar logout otomatis
    }
    return Promise.reject(err)
  }
)

export default axiosInstance
