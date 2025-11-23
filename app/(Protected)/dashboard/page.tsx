"use client"
import React from "react"
import { InfiniteMovingCards } from "../../../components/ui/infinite-moving-cards"
import { HoverEffect } from "../../../components/ui/card-hover-effect"
import { TextGenerateEffect } from "../../../components/ui/text-generate-effect"


export default function DashboardPage() {
  return (
    <main className="relative px-6 md:px-20 py-20 mt-10 font-serif text-[#ECECEC] leading-relaxed min-h-screen bg-gradient-to-b from-[#0f141a]/70 via-[#1c2430]/80 to-[#12171d]/90 backdrop-blur-xl">
      {/* ===== HERO INTRO ===== */}
      <section className="relative text-center mb-24">
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent rounded-3xl blur-2xl" />
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#FFD700] drop-shadow-[0_2px_8px_rgba(255,215,0,0.2)]">
            KEUANGAN RUMAH SAKIT BHAYANGKARA M HASAN PALEMBANG 🇮🇩
          </h1>
          <p className="text-gray-300 text-base md:text-lg max-w-3xl mx-auto leading-relaxed mb-8">
            Menyajikan wawasan seputar pengelolaan keuangan negara, pajak, dan kebijakan fiskal Indonesia —
            dengan pendekatan edukatif, transparan, dan modern.
          </p>

          {/* 🌀 Text Generate Effect */}
          <div className="max-w-2xl mx-auto mt-10 uppercase">
            <TextGenerateEffect
              words="Transparansi bukan hanya angka — tapi cerita tentang bagaimana bangsa ini membangun masa depannya."
            />
          </div>
        </div>
      </section>

      {/* ===== APA ITU KEUANGAN NEGARA ===== */}
      <section className="relative bg-white/8 backdrop-blur-2xl border border-white/15 p-8 rounded-3xl shadow-[inset_0_0_25px_rgba(255,255,255,0.05),0_0_25px_rgba(255,215,0,0.05)] mb-20 hover:shadow-[0_0_25px_rgba(255,215,0,0.2)] transition">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl" />
        <div className="relative z-10">
          <h2 className="text-2xl font-semibold mb-3 text-[#FFD700]">
            Apa Itu Keuangan Negara?
          </h2>
          <p className="text-gray-200 text-base md:text-lg">
            Keuangan negara mencakup semua hak dan kewajiban negara yang dapat dinilai dengan uang, serta aset yang
            dimiliki atau dikelola oleh negara. Pengelolaannya meliputi penerimaan, pengeluaran, pembiayaan, dan
            pengelolaan aset nasional.
          </p>
          <p className="text-gray-200 text-base md:text-lg mt-3">
            Tujuannya: mendukung pemerintahan yang efisien serta meningkatkan kesejahteraan rakyat melalui kebijakan
            fiskal yang berkeadilan.
          </p>
        </div>
      </section>

      {/* ===== KOMPONEN UTAMA ===== */}
      <section className="mb-28">
        <h2 className="text-3xl font-bold text-[#FFD700] mb-10 text-center drop-shadow-[0_2px_6px_rgba(255,215,0,0.2)]">
          Komponen Utama Keuangan Negara
        </h2>
        <div className="max-w-5xl mx-auto">
          <HoverEffect
            items={[
              {
                title: "Pendapatan Negara",
                description:
                  "Sumber utama penerimaan negara berasal dari pajak, bea cukai, dan PNBP.",
                link: "#",
              },
              {
                title: "Belanja Negara",
                description:
                  "Dana untuk kegiatan pemerintahan, pembangunan infrastruktur, pendidikan, dan kesehatan.",
                link: "#",
              },
              {
                title: "Pembiayaan",
                description:
                  "Menutup defisit APBN melalui penerbitan surat berharga negara (SBN) atau pinjaman resmi.",
                link: "#",
              },
            ]}
          />
        </div>
      </section>

      {/* ===== PERAN PAJAK ===== */}
      <section className="relative bg-white/10 backdrop-blur-2xl border border-[#FFD700]/20 p-10 rounded-3xl shadow-[0_4px_25px_rgba(255,215,0,0.1)] mb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-20 rounded-3xl" />
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-6 text-[#FFD700]">
            Peran Pajak dalam Pembangunan
          </h2>
          <p className="text-gray-200 mb-4 text-base md:text-lg">
            Pajak merupakan sumber pendapatan terbesar negara — lebih dari 70% penerimaan APBN berasal dari perpajakan.
            Pajak berfungsi sebagai sumber dana pembangunan sekaligus alat untuk mengatur perekonomian nasional.
          </p>
          <ul className="list-disc ml-8 text-gray-300 space-y-2 text-sm md:text-base">
            <li>Pembiayaan pendidikan, kesehatan, dan kesejahteraan sosial.</li>
            <li>Menjaga stabilitas ekonomi melalui pengendalian konsumsi.</li>
            <li>Mendorong investasi dengan kebijakan fiskal yang strategis.</li>
          </ul>
        </div>
      </section>

      {/* ===== STRUKTUR APBN ===== */}
      <section className="bg-white/10 backdrop-blur-2xl border border-white/15 p-10 rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.3)] mb-28">
        <h2 className="text-3xl font-bold mb-6 text-[#FFD700]">Struktur dan Fungsi APBN</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white/5 border border-white/20 p-6 rounded-xl">
            <h3 className="font-semibold text-[#FFD700] text-lg mb-2">Pendapatan</h3>
            <ul className="list-disc ml-6 space-y-2 text-gray-200 text-sm md:text-base">
              <li>Pajak (PPh, PPN, Bea Cukai)</li>
              <li>PNBP (Dividen BUMN, royalti SDA, retribusi)</li>
              <li>Hibah luar negeri</li>
            </ul>
          </div>
          <div className="bg-white/5 border border-white/20 p-6 rounded-xl">
            <h3 className="font-semibold text-[#FFD700] text-lg mb-2">Belanja</h3>
            <ul className="list-disc ml-6 space-y-2 text-gray-200 text-sm md:text-base">
              <li>Belanja Pemerintah Pusat</li>
              <li>Transfer ke Daerah (Dana Alokasi, Dana Desa)</li>
              <li>Subsidi energi dan bantuan sosial</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIAL / QUOTES ===== */}
      <section className="relative mb-28">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#FFD700] mb-3 drop-shadow-[0_2px_8px_rgba(255,215,0,0.3)]">
            Kata Bijak Ekonomi & Inspirasi Fiskal
          </h2>
          <p className="text-gray-400 text-base max-w-2xl mx-auto">
            Nilai-nilai fiskal dan transparansi keuangan yang membangun kepercayaan bangsa.
          </p>
        </div>
        <div className="relative h-[25rem] rounded-3xl border border-[#FFD700]/20 bg-gradient-to-br from-[#141a22]/80 via-[#1d2532]/80 to-[#0f141a]/80 backdrop-blur-2xl shadow-[0_0_30px_rgba(255,215,0,0.12)] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-[#FFD700]/5 to-transparent rounded-3xl" />
          <InfiniteMovingCards
            items={[
              {
                quote:
                  "Pengelolaan keuangan negara yang baik bukan sekadar efisiensi, tapi keberlanjutan masa depan bangsa.",
                name: "Sri Mulyani Indrawati",
                title: "Menteri Keuangan RI",
              },
              {
                quote:
                  "Setiap rupiah pajak adalah bentuk gotong royong warga negara untuk membangun negeri.",
                name: "Presiden Joko Widodo",
                title: "Kepala Negara",
              },
              {
                quote:
                  "Transparansi fiskal adalah pondasi kepercayaan publik terhadap pemerintah.",
                name: "OECD Report",
                title: "Fiscal Transparency 2024",
              },
            ]}
            direction="right"
            speed="slow"
          />
        </div>
      </section>

      {/* ===== PENUTUP ===== */}
      <section className="text-center bg-gradient-to-r from-[#FFD700]/10 via-[#FFD700]/15 to-[#FFD700]/10 border border-[#FFD700]/25 text-[#FFD700] py-10 px-6 rounded-3xl shadow-[0_0_25px_rgba(255,215,0,0.1)] backdrop-blur-2xl">
        <h2 className="text-3xl font-bold mb-3">Transparansi dan Akuntabilitas</h2>
        <p className="max-w-3xl mx-auto text-base md:text-lg text-yellow-100/90 leading-relaxed">
          Pemerintah Indonesia berkomitmen terhadap transparansi keuangan negara
          melalui laporan publik, audit BPK, dan digitalisasi sistem keuangan nasional.
          Tujuannya: menciptakan tata kelola yang bersih, profesional, dan berkeadilan.
        </p>
      </section>
    </main>
  )
}