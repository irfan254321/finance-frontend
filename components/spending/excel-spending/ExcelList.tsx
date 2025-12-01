/**
 * @component ExcelList
 * @description Displays the preview of the uploaded Excel data.
 */

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Pagination } from "@mui/material";

interface ExcelListProps {
  previewData: any[];
}

export default function ExcelList({ previewData }: ExcelListProps) {
  const ITEMS_PER_PAGE = 15;
  const [page, setPage] = useState(1);

  const pageCount = Math.ceil(previewData.length / ITEMS_PER_PAGE);
  const paginatedPreview = previewData.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  if (previewData.length === 0) return null;

  return (
    <div className="mt-10">
      <h3 className="text-xl font-semibold text-[#FFD700] mb-4">
        Preview Data:
      </h3>

      {/* GRID 2 KOLOM COMPACT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paginatedPreview.map((row: any, i: number) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="
        bg-white/5 border border-[#FFD700]/20
        rounded-xl p-4 
        text-gray-200
        hover:border-[#FFD700]/40 
        hover:shadow-[0_0_15px_rgba(255,215,0,0.15)]
        transition-all backdrop-blur-xl
      "
          >
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              {Object.entries(row).map(([key, val], j) => (
                <div key={j} className="flex flex-col">
                  <span className="text-[#FFD700]/80 text-xs font-semibold tracking-wide">
                    {key}
                  </span>
                  <span className="text-gray-300 text-sm break-words">
                    {String(val)}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* PAGINATION */}
      {pageCount > 1 && (
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
      )}
    </div>
  );
}
