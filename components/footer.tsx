// components/Footer.tsx
"use client"

import Link from "next/link"
import { useMemo } from "react"
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube } from "lucide-react"
import { YouTube } from "@mui/icons-material"

type NavItem = { label: string; href: string }
type NavSection = { title: string; items: NavItem[] }

interface FooterProps {
  brand?: { name: string; tagline?: string; logoSrc?: string; href?: string }
  nav?: NavSection[]
  contact?: { address?: string; email?: string; phone?: string }
  socials?: { facebook?: string; instagram?: string; youtube?: string }
  containerClassName?: string
}

export default function Footer({
  brand = {
    name: "RS Bhayangkara M. Hasan Palembang",
    tagline: "Transparan • Cepat • Terintegrasi",
    href: "/",
  },
  nav = [
    {
      title: "Produk", items: [
        { label: "Dashboard Keuangan", href: "/dashboard" },
        { label: "Spending", href: "/dashboard/spending/2025" },
        { label: "Income", href: "/dashboard/income/2025" },
      ]
    },
    {
      title: "Modul", items: [
        { label: "SIMRS Bhayangkara Palembang", href: "https://simrs.rsbhayangkarapalembang.id/simrs/" },
      ]
    },
    {
      title: "Perusahaan", items: [
        { label: "Tentang", href: "/about" },
        { label: "Kebijakan Privasi", href: "/privacy" },
        { label: "Syarat Layanan", href: "/terms" },
      ]
    },
  ],
  contact = {
    address: "Jl. Jenderal Sudirman KM. 4.5.",
    email: "rs.bhayangkara.palembang@gmail.com",
    phone: "0711-414855",
  },
  socials = {
    facebook: "https://www.facebook.com/RSBhyPLG",
    instagram: "https://www.instagram.com/rsbhayangkaraplg/",
    youtube: "https://www.youtube.com/@rsbhayangkaraplg"
  },
  containerClassName = "",
}: FooterProps) {
  const year = useMemo(() => new Date().getFullYear(), [])

  return (
    <footer className="relative mt-24 border-t border-white/10 shadow-[0_-6px_25px_rgba(0,0,0,0.35)]">
      {/* 🔷 SAMAIN persis sama NAVBAR */}
      <div className="bg-gradient-to-b from-[#0f141a] via-[#1c2430] to-[#12171d] backdrop-blur-2xl">
        <div className={`mx-auto max-w-7xl px-6 py-14 ${containerClassName}`}>
          {/* Brand + Contact */}
          <div className="grid gap-10 md:grid-cols-3 text-gray-100 font-serif">
            {/* Brand */}
            <div className="space-y-4">
              <Link href={brand.href ?? "/"} className="inline-flex items-center gap-3">
                {brand.logoSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={brand.logoSrc}
                    alt={brand.name}
                    className="h-10 w-10 rounded-xl ring-1 ring-white/20 object-cover"
                  />
                ) : (
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#FFD700]/10 ring-1 ring-[#FFD700]/30">
                    <span className="font-semibold text-[#FFD700]">RS</span>
                  </div>
                )}
                <div>
                  <p className="text-lg font-semibold tracking-wide">{brand.name}</p>
                  {brand.tagline && (
                    <p className="text-sm text-gray-300">{brand.tagline}</p>
                  )}
                </div>
              </Link>

              <p className="text-sm leading-relaxed text-gray-300">
                Sistem informasi & keuangan terintegrasi untuk operasional yang lebih efisien,
                transparan, dan akuntabel.
              </p>

              {/* Contact quick */}
              <div className="space-y-2 text-sm">
                {contact.address && (
                  <p className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                    <span className="text-gray-200">{contact.address}</span>
                  </p>
                )}
                {contact.email && (
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <a href={`mailto:${contact.email}`} className="hover:underline text-gray-200">
                      {contact.email}
                    </a>
                  </p>
                )}
                {contact.phone && (
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <a href={`tel:${contact.phone}`} className="hover:underline text-gray-200">
                      {contact.phone}
                    </a>
                  </p>
                )}
              </div>
            </div>

            {/* Navigation */}
            <div className="md:col-span-2 grid grid-cols-2 gap-10 md:grid-cols-3">
              {nav.map((section) => (
                <div key={section.title}>
                  <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-300">
                    {section.title}
                  </h4>
                  <ul className="space-y-2">
                    {section.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="text-gray-300 hover:text-[#FFD700] transition"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="my-10 h-px w-full bg-white/10" />

          {/* Bottom bar */}
          <div className="flex flex-col-reverse items-center justify-between gap-6 md:flex-row">
            <p className="text-xs text-gray-300">
              © {year} {brand.name}. All rights reserved.
            </p>

            <div className="flex items-center gap-4">
              {socials.facebook && (
                <a href={socials.facebook} aria-label="Facebook" className="rounded-lg p-2 ring-1 ring-white/10 hover:bg-white/5">
                  <Facebook className="h-4 w-4" />
                </a>
              )}
              {socials.instagram && (
                <a href={socials.instagram} aria-label="Instagram" className="rounded-lg p-2 ring-1 ring-white/10 hover:bg-white/5">
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              {socials.youtube && (
                <a href={socials.youtube} aria-label="Instagram" className="rounded-lg p-1 ring-1 ring-white/10 hover:bg-white/5">
                  <YouTube className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
