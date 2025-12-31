"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

// Imports Refactored Components
import NavLogo from "@/components/navbar/NavLogo";
import NavMobile from "@/components/navbar/NavMobile";
import {
  DesktopDropdown,
  DropdownSubItem,
  MenuLink,
  MenuButton,
} from "@/components/navbar/NavDesktop";
import { useNavData, useNavState } from "@/components/navbar/hooks";
import {
  financeItems,
  manageItems,
  staticNavButtons,
} from "@/components/navbar/config";

export default function Navbar() {
  const router = useRouter();
  const { user, logout, isLogoutLoading, loading } = useAuth();

  // Custom hooks handling logic & data
  const { years } = useNavData();
  const { mobileOpen, openMenu, openSub, toggleMenu, toggleSub, closeAll } =
    useNavState();

  // Return null if loading or not authenticated (handled by protection usually, but good for safety)
  if (loading) return null;
  if (!user) return null;

  const isAdmin = user.role === "admin";

  // Combine Manage Items
  // Shared: Input, Edit, Year (from config)
  // User Section: Edit User, Logout (for everyone)
  const finalManageItems = [
    ...manageItems,
    {
      label: "👤 User",
      routes: [
        { name: "🛠️ Edit User", path: "/dashboard/profile" },
        {
          name: "🚪 Logout",
          path: logout,
          isLogout: true,
        },
      ],
    },
  ];

  // Filter Static Buttons
  // Register: Admin only
  // Tutorial: Everyone
  const filteredStaticButtons = staticNavButtons.filter((btn) => {
    if (btn.label === "Register") return isAdmin;
    return true;
  });

  return (
    <nav className="sticky top-0 w-full z-[9999] min-h-28 text-[#EBD77A] font-serif bg-gradient-to-br from-[#1a2732]/97 via-[#2C3E50]/95 to-[#1a2732]/97 backdrop-blur-lg border-b border-[#EBD77A]/15 shadow-[0_2px_25px_rgba(0,0,0,0.4)]">
      <div className="flex justify-between items-center px-6 md:px-16 h-20">
        {/* 1. LOGO */}
        <NavLogo />

        {/* 2. DESKTOP MENU */}
        <div className="hidden md:flex items-center space-x-36 text-2xl relative mt-9 mr-28">
          {/* Dropdown: FINANCE */}
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

          {/* Dropdown: MANAGE */}
          <DesktopDropdown
            label="Manage"
            isOpen={openMenu === "manage"}
            onToggle={() => toggleMenu("manage")}
          >
            {finalManageItems.map((section) => (
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
                        r.path(); // Execute generic function (logout)
                        closeAll();
                      }}
                      disabled={r.isLogout ? isLogoutLoading : false}
                      isLoading={r.isLogout ? isLogoutLoading : false}
                    >
                      {r.name}
                    </MenuButton>
                  )
                )}
              </DropdownSubItem>
            ))}
          </DesktopDropdown>

          {/* Static Buttons (Register, Tutorial) */}
          {filteredStaticButtons.map((btn) => (
            <Link
              key={btn.label}
              href={btn.route}
              className="relative group font-semibold text-[#EBD77A] hover:text-[#FFD970]"
            >
              {btn.label}
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#FFD970] rounded-full transition-all duration-300 ease-out group-hover:w-full"></span>
            </Link>
          ))}
        </div>
      </div>

      {/* 3. MOBILE PANEL */}
      <NavMobile
        isOpen={mobileOpen}
        openMenu={openMenu}
        toggleMenu={toggleMenu}
        onClose={closeAll}
        financeItems={financeItems}
        manageItems={finalManageItems}
        years={years}
        user={user}
        logout={logout}
      />
    </nav>
  );
}
