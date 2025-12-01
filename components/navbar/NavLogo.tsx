import Link from "next/link";

export default function NavLogo() {
  return (
    <div className="flex flex-row items-center w-5/12">
      <div className="mt-9">
        <Link href="/dashboard">
          <img
            src="/logo-rs.png"
            alt="Logo RS"
            className="drop-shadow-[0_0_12px_rgba(255,215,0,0.4)] cursor-pointer w-12 h-12 md:w-20 md:h-20"
          />
        </Link>
      </div>
      <div className="ml-5 text-2xl font-bold mt-9">
        <h1 className="hidden md:block text-2xl font-bold leading-tight text-[#EBD77A]">
          RUMAH SAKIT BHAYANGKARA M HASAN PALEMBANG
        </h1>
      </div>
    </div>
  );
}