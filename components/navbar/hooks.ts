// components/navbar/hooks.ts
import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";

export function useNavData() {
  const [years, setYears] = useState<number[]>([]);

  useEffect(() => {
    axiosInstance
      .get("/api/year")
      .then((res) => {
        const list = res.data.map((item: any) => item.year);
        setYears(list);
      })
      .catch((err) => console.error("Gagal ambil tahun:", err));
  }, []);

  return { years };
}

export function useNavState() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [openSub, setOpenSub] = useState<string | null>(null);

  const toggleMobile = () => setMobileOpen(!mobileOpen);
  
  const toggleMenu = (menu: string) =>
    setOpenMenu(openMenu === menu ? null : menu);
  
  const toggleSub = (key: string) => 
    setOpenSub(openSub === key ? null : key);

  const closeAll = () => {
    setOpenMenu(null);
    setOpenSub(null);
    setMobileOpen(false);
  };

  return {
    mobileOpen,
    setMobileOpen,
    openMenu,
    openSub,
    toggleMobile,
    toggleMenu,
    toggleSub,
    closeAll
  };
}