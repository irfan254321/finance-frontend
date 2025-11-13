export default function TabWrapper({ children }: any) {
  return (
    <div
      className="
      bg-white/10 backdrop-blur-xl border border-[#FFD700]/25 rounded-3xl
      w-full max-w-5xl mx-auto
      p-10 md:p-12
      min-h-[70vh]       /* tinggi besar */
      shadow-[0_0_35px_rgba(255,215,0,0.10)]
      flex flex-col
      "
    >
      {children}
    </div>
  )
}
