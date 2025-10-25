import ProtectedRoute from "@/components/ProtectedRoute"


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#1a2732] text-white min-h-screen">
      <ProtectedRoute>{children}</ProtectedRoute>
    </div>
  )
}
