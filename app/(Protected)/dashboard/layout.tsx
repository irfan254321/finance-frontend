import ProtectedRoute from "@/components/ProtectedRoute"
import TransitionOverlay from "@/components/TransitionOverlay"
import PageWrapper from "@/components/PageWrapper"
import Footer from "@/components/footer"
import NavbarSwitcher from "@/components/navbarSwitcher"


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#1a2732] text-white min-h-screen">
      <TransitionOverlay />
        <PageWrapper>
          <ProtectedRoute>
            <NavbarSwitcher />
            {children}
            <Footer />
          </ProtectedRoute>
        </PageWrapper>
    </div>
  )
}
