export default function FooterLogout() {
  return (
    <footer
      className="w-full bg-gradient-to-r from-[#6B3F69] via-[#8E588A] to-[#6B3F69]
                 text-[#F4E1C1] text-center py-10 mt-20
                 shadow-[0_-6px_20px_rgba(0,0,0,0.25)] border-t border-[#F4E1C1]/30"
    >
      <div className="flex flex-col items-center justify-center space-y-2">
        <p className="text-2xl md:text-3xl font-serif font-semibold tracking-wide">
          Rumah Sakit Bhayangkara M. Hasan Palembang
        </p>
        <p className="text-lg md:text-xl text-[#f9eede]/90 font-medium">
          © 2025 IT Bhayangkara — All Rights Reserved
        </p>
        <p className="text-sm text-[#f9eede]/70">
          Jl. Jendral Sudirman No.123, Palembang, Sumatera Selatan
        </p>
      </div>
    </footer>
  )
}
