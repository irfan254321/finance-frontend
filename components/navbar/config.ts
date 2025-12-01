// components/navbar/config.ts

// 1. Buat Type Definition
export type NavItem = {
  label: string; // <-- Wajib string agar bisa jadi Key
  route: string;
};

export const financeItems = [
  { label: "💰 Income", route: "/dashboard/income" },
  { label: "💸 Spending", route: "/dashboard/spending" },
  { label: "⚖️ Mixture", route: "/dashboard/mixture" },
];

export const manageItems = [
  {
    label: "✏️ Input",
    routes: [
      { name: "💰 Income", path: "/dashboard/input/income" },
      { name: "💸 Spending", path: "/dashboard/input/spending" },
    ],
  },
  {
    label: "🛠️ Edit",
    routes: [
      { name: "💰 Income", path: "/dashboard/edit/income" },
      { name: "💸 Spending", path: "/dashboard/edit/spending" },
    ],
  },
  {
    label: "📅 Year",
    routes: [{ name: "➕ Input Year", path: "/dashboard/admin/year" }],
  },
  // Item User/Logout ditangani secara dinamis di komponen karena butuh func logout
];

export const staticNavButtons = [
  { label: "Register", route: "/dashboard/admin/register" },
];