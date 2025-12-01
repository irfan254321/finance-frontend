/**
 * @component CategoryList
 * @description Displays categories in a card-based grid layout
 * matching the Company Medicine design pattern.
 */

"use client";

// =========================================
// IMPORTS
// =========================================
import { motion } from "framer-motion";
import { IconButton, Tooltip, Pagination } from "@mui/material";
import { Edit, Delete, Refresh, Search } from "@mui/icons-material";
import CustomTextField from "@/components/ui/CustomTextField";

// =========================================
// TYPES & INTERFACES
// =========================================

// Definition of the Category entity
interface Category {
  id: number;
  name_category: string;
}

interface CategoryListProps {
  /** Array of category objects to display (already paginated) */
  data: Category[];
  /** Loading state for the table */
  loading: boolean;
  /** Current active page number */
  page: number;
  /** Function to update the page number */
  setPage: (page: number) => void;
  /** Total number of pages */
  pageCount: number;
  /** Current search query string */
  query: string;
  /** Function to update the search query */
  setQuery: (query: string) => void;
  /** Callback when the edit button is clicked */
  onEdit: (item: Category) => void;
  /** Callback when the delete button is clicked */
  onDelete: (id: number) => void;
  /** Callback to trigger data refresh */
  onRefresh: () => void;
}

export default function CategoryList({
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
}: CategoryListProps) {
  /**
   * Highlights matching text in category names
   */
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

  // =========================================
  // RENDER
  // =========================================
  return (
    <>
      {/* SEARCH BAR */}
      <div className="flex justify-end mb-6">
        <CustomTextField
          size="small"
          placeholder="Cari kategori..."
          value={query}
          onChange={(e: any) => setQuery(e.target.value)}
        />
      </div>

      {/* CATEGORY HEADING */}
      <p className="text-[#FFD700] font-semibold mb-4 text-xl">
        Daftar Kategori:
      </p>

      {/* CATEGORY CARDS GRID */}
      {data.length === 0 ? (
        <p className="text-gray-400 italic">Tidak ada kategori.</p>
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
          {data.map((category) => {
            const firstLetter = (category.name_category || "?")
              .toString()
              .trim()
              .charAt(0)
              .toUpperCase();

            return (
              <motion.div
                key={category.id}
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
                    {renderHighlightedName(category.name_category, query)}
                  </span>

                  <span className="text-[#FFD700]/70 text-xs sm:text-sm">
                    ID: {category.id}
                  </span>
                </div>

                {/* EDIT/DELETE BUTTONS */}
                <div className="flex gap-2 flex-shrink-0">
                  <Tooltip title="Edit">
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(category);
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
                        onDelete(category.id);
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
