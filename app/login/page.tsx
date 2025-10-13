  "use client"

  import { useState } from "react"
  import axiosInstance from "@/lib/axiosInstance"
  import { useRouter } from "next/navigation"
  import Cookies from "js-cookie"

  export default function LoginPage() {
    const router = useRouter()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleLogin = async (e : any) => {
      e.preventDefault()
      try {
        const res = await axiosInstance.post("/login", { username, password })
        Cookies.set("token", res.data.token, { expires: 1 })
        router.push("/dashboard")
      } catch (err : any) {
        setError(err.response?.data?.message || "Login failed")
      }
    }

    return (
      <div className="flex justify-center items-center h-[70vh]">
        <form
          onSubmit={handleLogin}
          className="bg-white shadow-2xl rounded-2xl p-10 w-[400px] space-y-6 border border-gray-200"
        >
          <h2 className="text-2xl font-bold text-center text-[#2C3E50]">
            Login
          </h2>

          <div>
            <label className="block mb-2 text-gray-600">Username</label>
            <input
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 ring-[#2C3E50]"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-600">Password</label>
            <input
              type="password"
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 ring-[#2C3E50]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full py-2 bg-[#2C3E50] text-white rounded-lg hover:bg-[#34495E] transition"
          >
            Sign In
          </button>
        </form>
      </div>
    )
  }
