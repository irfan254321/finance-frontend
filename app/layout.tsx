import NavbarPublic from "@/components/navbarLogout"
import FooterLogout from "@/components/footer"
import "./globals.css"
import { ReactNode } from "react"


export const metadata = { title: "Finance System" }

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NavbarPublic />
        <main>{children}</main>
      </body>
    </html>
  )
}
