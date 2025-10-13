export default function DashboardPage() {
  return (
    <main className="px-8 md:px-20 py-16 bg-[#F9FAFB] font-serif text-[#2C3E50] leading-relaxed mt-20">
      {/* ===== HEADER ===== */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#2C3E50]">
          Dashboard Informasi Keuangan Negara 🇮🇩
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Menyajikan wawasan seputar pengelolaan keuangan negara, pajak, dan
          kebijakan fiskal Indonesia. Edukatif, transparan, dan mudah dipahami.
        </p>
      </section>

      {/* ===== PENGANTAR ===== */}
      <section className="bg-white p-8 rounded-2xl shadow-lg mb-16 border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 text-[#8B0000]">
          Apa Itu Keuangan Negara?
        </h2>
        <p className="text-gray-700 text-lg">
          Keuangan negara adalah semua hak dan kewajiban negara yang dapat
          dinilai dengan uang, serta segala sesuatu baik berupa uang maupun
          barang yang dapat dijadikan milik negara. Pengelolaan keuangan negara
          meliputi penerimaan, pengeluaran, pembiayaan, dan pengelolaan aset
          negara.
        </p>
        <p className="text-gray-700 text-lg mt-3">
          Tujuan utamanya adalah untuk mendukung penyelenggaraan pemerintahan
          yang efektif dan efisien, serta mewujudkan kesejahteraan rakyat melalui
          kebijakan fiskal yang berkeadilan.
        </p>
      </section>

      {/* ===== KOMPONEN UTAMA ===== */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-[#8B0000] mb-10 text-center">
          Komponen Utama Keuangan Negara
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Pendapatan Negara",
              desc: "Sumber utama penerimaan negara berasal dari pajak, bea dan cukai, penerimaan negara bukan pajak (PNBP), serta hibah dari pihak dalam dan luar negeri.",
              icon: "💰",
            },
            {
              title: "Belanja Negara",
              desc: "Pengeluaran negara untuk mendanai kegiatan pemerintahan, pembangunan infrastruktur, pendidikan, kesehatan, dan bantuan sosial.",
              icon: "📊",
            },
            {
              title: "Pembiayaan",
              desc: "Digunakan untuk menutup defisit APBN, bisa berasal dari penerbitan surat berharga negara (SBN) atau pinjaman.",
              icon: "📈",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl transition"
            >
              <div className="text-5xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold text-[#2C3E50] mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== PAJAK ===== */}
      <section className="bg-gradient-to-r from-[#FDF6E3] to-[#FFF9E5] p-10 rounded-2xl border border-yellow-200 mb-16 shadow-md">
        <h2 className="text-3xl font-bold mb-6 text-[#8B0000]">
          Peran Pajak dalam Pembangunan
        </h2>
        <p className="text-lg text-gray-700 mb-4">
          Pajak merupakan sumber pendapatan terbesar bagi negara. Lebih dari 70%
          penerimaan APBN berasal dari sektor perpajakan. Pajak berfungsi tidak
          hanya sebagai sumber dana pembangunan, tetapi juga sebagai alat untuk
          mengatur perekonomian.
        </p>
        <ul className="list-disc ml-8 text-gray-700 space-y-2">
          <li>Pajak digunakan untuk membiayai pendidikan, kesehatan, dan sosial.</li>
          <li>Pajak menjaga stabilitas ekonomi melalui pengendalian konsumsi.</li>
          <li>Pajak mendorong investasi melalui insentif fiskal.</li>
        </ul>
        <p className="mt-4 text-gray-700">
          Tanpa pajak, negara akan sulit menjalankan program pembangunan dan
          melindungi masyarakat.
        </p>
      </section>

      {/* ===== APBN ===== */}
      <section className="bg-white p-10 rounded-2xl shadow-lg border border-gray-200 mb-16">
        <h2 className="text-3xl font-bold mb-6 text-[#8B0000]">
          Struktur dan Fungsi APBN
        </h2>
        <p className="text-gray-700 text-lg mb-4">
          APBN (Anggaran Pendapatan dan Belanja Negara) merupakan rencana
          keuangan tahunan pemerintah yang disetujui oleh DPR. APBN mencerminkan
          prioritas pembangunan nasional dan kebijakan fiskal pemerintah.
        </p>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-[#F9F9F9] p-6 rounded-xl border border-gray-100">
            <h3 className="font-semibold text-[#2C3E50] text-xl mb-2">
              Pendapatan
            </h3>
            <ul className="list-disc ml-6 space-y-2 text-gray-700">
              <li>Pajak (PPh, PPN, Bea Cukai)</li>
              <li>PNBP (Dividen BUMN, royalti SDA, retribusi)</li>
              <li>Hibah luar negeri</li>
            </ul>
          </div>
          <div className="bg-[#F9F9F9] p-6 rounded-xl border border-gray-100">
            <h3 className="font-semibold text-[#2C3E50] text-xl mb-2">
              Belanja
            </h3>
            <ul className="list-disc ml-6 space-y-2 text-gray-700">
              <li>Belanja Pemerintah Pusat</li>
              <li>Transfer ke Daerah (Dana Alokasi, Dana Desa)</li>
              <li>Subsidi energi dan bantuan sosial</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ===== PENUTUP ===== */}
      <section className="text-center bg-[#8B0000] text-[#FFD700] py-10 px-6 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold mb-3">Transparansi dan Akuntabilitas</h2>
        <p className="max-w-3xl mx-auto text-lg text-yellow-100/90">
          Pemerintah Indonesia berkomitmen terhadap transparansi pengelolaan
          keuangan negara melalui laporan keuangan publik, audit BPK, dan
          digitalisasi sistem keuangan. Tujuannya adalah menciptakan tata kelola
          yang bersih, profesional, dan berkeadilan.
        </p>
      </section>
    </main>
  )
}
