/**
 * @component CategoryList
 * @description Component for displaying the list of categories.
 */

"use client";

import { motion } from "framer-motion";
import { IconButton, TableRow, TableCell } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import TableLayout from "@/app/(Protected)/dashboard/edit/common/TableLayout";

interface CategoryListProps {
  categories: any[];
  loading: boolean;
  page: number;
  setPage: (page: number) => void;
  pageCount: number;
  query: string;
  setQuery: (query: string) => void;
  onRefresh: () => void;
  onEdit: (item: any) => void;
  onDelete: (id: number) => void;
  isEditMode?: boolean; // To distinguish between card view (input) and table view (edit)
}

export default function CategoryList({
  categories,
  loading,
  page,
  setPage,
  pageCount,
  query,
  setQuery,
  onRefresh,
  onEdit,
  onDelete,
  isEditMode = false,
}: CategoryListProps) {
  // RENDER FOR EDIT MODE (TABLE)
  if (isEditMode) {
    return (
      <TableLayout
        headers={["ID", "Nama Kategori", "Aksi"]}
        loading={loading}
        onRefresh={onRefresh}
        page={page}
        pageCount={pageCount}
        onPageChange={setPage}
        searchQuery={query}
        onSearchChange={setQuery}
        searchPlaceholder="Cari kategori..."
      >
        {categories.map((c) => (
          <TableRow key={c.id} hover sx={{ "& td": { color: "#ECECEC" } }}>
            <TableCell>{c.id}</TableCell>
            <TableCell>{c.name_category}</TableCell>
            <TableCell>
              <IconButton
                size="small"
                onClick={() => onEdit(c)}
                sx={{ color: "#FFE55C" }}
              >
                <Edit fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => onDelete(c.id)}
                sx={{ color: "#ff6363" }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
        {categories.length === 0 && (
          <TableRow>
            <TableCell colSpan={3} sx={{ color: "#ECECEC" }}>
              Tidak ada data
            </TableCell>
          </TableRow>
        )}
      </TableLayout>
    );
  }

  // RENDER FOR INPUT MODE (CARDS)
  return (
    <>
      <p className="text-[#FFD700] font-semibold mb-6 text-xl tracking-wide">
        Daftar Kategori
      </p>

      {categories.length === 0 ? (
        <p className="text-gray-400 italic">Belum ada kategori.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((c: any) => {
            const firstLetter = (c.name_category || "?")
              .toString()
              .trim()
              .charAt(0)
              .toUpperCase();

            return (
              <motion.div
                key={c.id}
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ duration: 0.25 }}
                className="
                  relative group
                  bg-white/5 
                  border border-[#FFD700]/20 
                  rounded-2xl 
                  p-5 
                  min-h-[110px]
                  backdrop-blur-xl
                  shadow-[0_0_20px_rgba(0,0,0,0.25)]
                  hover:border-[#FFD700]/40
                  hover:shadow-[0_0_30px_rgba(255,215,0,0.20)]
                  transition-all duration-200
                  flex gap-4 items-center
                "
              >
                {/* SHINE EFFECT */}
                <div
                  className="
                    pointer-events-none
                    absolute inset-y-0 -left-1/2
                    w-1/2
                    bg-gradient-to-r from-transparent via-white/40 to-transparent
                    opacity-0
                    group-hover:opacity-70
                    transform
                    -translate-x-full
                    group-hover:translate-x-full
                    transition-all duration-700 ease-out
                  "
                />

                {/* ICON ROUND */}
                <div
                  className="
                    flex items-center justify-center
                    h-12 w-12
                    rounded-full
                    bg-[#FFD700]/20
                    border border-[#FFD700]/50
                    text-[#FFD700]
                    font-bold text-lg
                    flex-shrink-0
                    shadow-[0_0_10px_rgba(255,215,0,0.3)]
                  "
                >
                  {firstLetter}
                </div>

                {/* TEXT */}
                <div className="flex flex-col">
                  <span className="text-gray-200 font-semibold text-base leading-tight">
                    {c.name_category}
                  </span>

                  <span className="text-[#FFD700]/70 text-sm">ID: {c.id}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </>
  );
}
