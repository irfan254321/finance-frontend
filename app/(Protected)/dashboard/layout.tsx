import ProtectedRoute from "@/components/ProtectedRoute"
import TransitionOverlay from "@/components/TransitionOverlay"
import PageWrapper from "@/components/PageWrapper"
import Footer from "@/components/footer"


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#1a2732] text-white min-h-screen">
      <TransitionOverlay />
        <PageWrapper>
          <ProtectedRoute>
            {children}
            <Footer />
          </ProtectedRoute>
        </PageWrapper>
    </div>
  )
}
