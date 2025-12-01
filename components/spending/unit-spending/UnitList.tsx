/**
 * @component UnitList
 * @description Displays units in a card-based grid layout.
 */

"use client";

import { motion } from "framer-motion";
import { IconButton, Tooltip, Pagination } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import CustomTextField from "@/components/ui/CustomTextField";

interface Unit {
  id: number;
  name_unit: string;
}

interface UnitListProps {
  data: Unit[];
  loading: boolean;
  page: number;
  setPage: (page: number) => void;
  pageCount: number;
  query: string;
  setQuery: (query: string) => void;
  onEdit: (item: Unit) => void;
  onDelete: (id: number) => void;
  onRefresh: () => void;
}

export default function UnitList({
  data,
  loading,
  page,
  setPage,
  pageCount,
  query,
  setQuery,
  onEdit,
  onDelete,
  onRefresh,
}: UnitListProps) {
  const renderHighlightedName = (name: string, keyword: string) => {
    if (!keyword) return name;
    const lowerName = name.toLowerCase();
    const lowerKey = keyword.toLowerCase();
    const index = lowerName.indexOf(lowerKey);
    if (index === -1) return name;
    const before = name.slice(0, index);
    const match = name.slice(index, index + keyword.length);
    const after = name.slice(index + keyword.length);
    return (
      <>
        {before}
        <span className="text-[#FFD700] font-semibold">{match}</span>
        {after}
      </>
    );
  };

  return (
    <>
      {/* SEARCH BAR */}
      <div className="flex justify-end mb-6">
        <CustomTextField
          size="small"
          placeholder="Cari unit..."
          value={query}
          onChange={(e: any) => setQuery(e.target.value)}
        />
      </div>

      {/* UNIT HEADING */}
      <p className="text-[#FFD700] font-semibold mb-4 text-xl">Daftar Unit:</p>

      {/* UNIT CARDS GRID */}
      {data.length === 0 ? (
        <p className="text-gray-400 italic">Tidak ada unit.</p>
      ) : (
        <div
          className="
            grid 
            grid-cols-1 
            sm:grid-cols-2 
            lg:grid-cols-3 
            gap-4
          "
        >
          {data.map((unit) => {
            const firstLetter = (unit.name_unit || "?")
              .toString()
              .trim()
              .charAt(0)
              .toUpperCase();

            return (
              <motion.div
                key={unit.id}
                whileHover={{ y: -3, scale: 1.02 }}
                transition={{ duration: 0.25 }}
                className="
                  relative
                  group
                  bg-white/5 
                  border border-[#FFD700]/20 
                  rounded-2xl 
                  p-4 
                  min-h-[96px]
                  backdrop-blur-xl
                  shadow-[0_0_20px_rgba(0,0,0,0.25)]
                  hover:border-[#FFD700]/40
                  hover:shadow-[0_0_25px_rgba(255,215,0,0.18)]
                  transition-all 
                  duration-200
                  flex gap-3 items-center
                "
              >
                {/* ✨ Shine effect */}
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
                    transition-all
                    duration-700
                    ease-out
                  "
                />

                {/* ICON HURUF DEPAN */}
                <div
                  className="
                    flex items-center justify-center
                    h-10 w-10
                    rounded-full
                    bg-[#FFD700]/20
                    border border-[#FFD700]/50
                    text-[#FFD700]
                    font-bold
                    flex-shrink-0
                    shadow-[0_0_10px_rgba(255,215,0,0.3)]
                  "
                >
                  {firstLetter}
                </div>

                {/* TEXT & ACTIONS */}
                <div className="flex flex-col gap-1 flex-1">
                  <span className="text-gray-200 font-semibold text-sm sm:text-base leading-tight">
                    {renderHighlightedName(unit.name_unit, query)}
                  </span>

                  <span className="text-[#FFD700]/70 text-xs sm:text-sm">
                    ID: {unit.id}
                  </span>
                </div>

                {/* EDIT/DELETE BUTTONS */}
                <div className="flex gap-2 flex-shrink-0">
                  <Tooltip title="Edit">
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(unit);
                      }}
                      size="small"
                      sx={{
                        color: "#FFE55C",
                        "&:hover": { bgcolor: "rgba(255, 229, 92, 0.1)" },
                      }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Delete">
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(unit.id);
                      }}
                      size="small"
                      sx={{
                        color: "#ff6363",
                        "&:hover": { bgcolor: "rgba(255, 99, 99, 0.1)" },
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* PAGINATION */}
      <div className="flex justify-center mt-8">
        <Pagination
          count={pageCount}
          page={page}
          onChange={(_, v) => setPage(v)}
          sx={{
            "& .MuiPaginationItem-root": {
              color: "#FFD700",
            },
          }}
        />
      </div>
    </>
  );
}
