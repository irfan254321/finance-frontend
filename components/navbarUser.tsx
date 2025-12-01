// NavbarUser.tsx (atau NavbarLogin.tsx sesuai nama filemu)
"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

// REUSE: Komponen yang sudah dibuat sebelumnya
import NavLogo from "@/components/navbar/NavLogo";
import NavMobile from "@/components/navbar/NavMobile";
import {
  DesktopDropdown,
  DropdownSubItem,
  MenuLink,
  MenuButton, // MenuButton yang sudah di-update di atas
} from "@/components/navbar/NavDesktop";
import { useNavData, useNavState } from "@/components/navbar/hooks";
import { financeItems, manageItems } from "@/components/navbar/config";

export default function NavbarUser() {
  const router = useRouter();
  const { user, logout, isLogoutLoading } = useAuth(); // Ambil isLogoutLoading

  // REUSE: Logic State & Data Fetching
  const { years } = useNavData();
  const {
    mobileOpen,
    openMenu,
    openSub,
    // toggleMobile, // Jika ada tombol hamburger di luar snippet
    toggleMenu,
    toggleSub,
    closeAll,
  } = useNavState();

  // Construct Data Menu Manage Khusus User (hanya Logout, tanpa Edit User)
  const userManageItems = [
    ...manageItems,
    {
      label: "👤 User",
      routes: [
        { 
          name: "🚪 Logout", 
          path: logout, // function reference
          isLogout: true // marker logic
        }, 
      ],
    },
  ];

  return (
    <nav className="sticky top-0 w-full z-[9999] min-h-28 text-[#EBD77A] font-serif bg-gradient-to-br from-[#1a2732]/97 via-[#2C3E50]/95 to-[#1a2732]/97 backdrop-blur-lg border-b border-[#EBD77A]/15 shadow-[0_2px_25px_rgba(0,0,0,0.4)]">
      <div className="flex justify-between items-center px-6 md:px-16 h-20">
        
        {/* 1. LOGO (REUSE) */}
        <NavLogo />

        {/* 2. DESKTOP MENU */}
        <div className="hidden md:flex items-center space-x-36 text-2xl relative mt-9 mr-72">
          
          {/* Dropdown: FINANCE (Sama persis dengan Admin) */}
          <DesktopDropdown
            label="Finance"
            isOpen={openMenu === "finance"}
            onToggle={() => toggleMenu("finance")}
          >
            {financeItems.map((item) => (
              <DropdownSubItem
                key={item.label}
                label={item.label}
                isOpen={openSub === item.label}
                onToggle={() => toggleSub(item.label)}
              >
                {years.map((year) => (
                  <MenuLink
                    key={year}
                    href={`${item.route}/${year}`}
                    onClick={closeAll}
                  >
                    📆 {year}
                  </MenuLink>
                ))}
              </DropdownSubItem>
            ))}
          </DesktopDropdown>

          {/* Dropdown: MANAGE (Khusus User: Logout ada Loadingnya) */}
          <DesktopDropdown
            label="Manage"
            isOpen={openMenu === "manage"}
            onToggle={() => toggleMenu("manage")}
          >
            {userManageItems.map((section) => (
              <DropdownSubItem
                key={section.label}
                label={section.label}
                isOpen={openSub === section.label}
                onToggle={() => toggleSub(section.label)}
              >
                {section.routes.map((r: any) =>
                  typeof r.path === "string" ? (
                    <MenuLink key={r.name} href={r.path} onClick={closeAll}>
                      {r.name}
                    </MenuLink>
                  ) : (
                    <MenuButton
                      key={r.name}
                      onClick={() => {
                        r.path(); // Jalankan logout
                        closeAll();
                      }}
                      // Inject props loading khusus Logout
                      disabled={isLogoutLoading}
                      isLoading={r.isLogout ? isLogoutLoading : false}
                    >
                      {r.name}
                    </MenuButton>
                  )
                )}
              </DropdownSubItem>
            ))}
          </DesktopDropdown>
        </div>
      </div>

      {/* 3. MOBILE PANEL (REUSE) */}
      {/* Kita reuse NavMobile. Walaupun di snippet asli User Navbar tidak ada loading indicator di mobile,
          kita tetap passing fungsi logout. NavMobile yang kita buat sebelumnya sudah cukup generic. */}
      <NavMobile
        isOpen={mobileOpen}
        openMenu={openMenu}
        toggleMenu={toggleMenu}
        onClose={closeAll}
        financeItems={financeItems}
        manageItems={userManageItems}
        years={years}
        user={user}
        logout={logout}
      />
    </nav>
  );
}