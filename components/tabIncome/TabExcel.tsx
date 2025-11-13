"use client"

import { motion } from "framer-motion"
import {
  Button,
  CircularProgress,
  Pagination
} from "@mui/material"
import { CloudUpload, InsertDriveFile } from "@mui/icons-material"
import CustomTextField from "@/components/ui/CustomTextField"
import TabWrapper from "@/components/tabWrapper"
import { useState } from "react"

export default function TabExcel({
  file,
  previewData,
  uploading,
  handleExcelSelect,
  handleUploadExcel,
  handleDownloadTemplate
}: any) {

  // PAGINATION ==========================================
  const ITEMS_PER_PAGE = 15
  const [page, setPage] = useState(1)

  const pageCount = Math.ceil(previewData.length / ITEMS_PER_PAGE)
  const paginatedPreview = previewData.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <TabWrapper>

        {/* HEADER */}
        <div className="text-center mb-10">
          <CloudUpload sx={{ fontSize: 80, color: "#FFD700" }} />

          <h2 className="text-3xl font-extrabold text-[#FFD700] mt-4 tracking-wide">
            Upload File Excel Income
          </h2>

          <p className="text-gray-300 mt-2">
            Import data pemasukan dengan format Excel (.xls / .xlsx)
          </p>
        </div>

        {/* UPLOAD AREA */}
        <div className="flex justify-center mb-10">
          <div
            className="
              bg-white/5 border border-[#FFD700]/30 
              rounded-2xl p-10 w-full max-w-2xl text-center
              hover:border-[#FFD700]/60 hover:bg-white/10 transition-all
            "
          >
            <InsertDriveFile sx={{ fontSize: 60, color: "#FFD700" }} />

            <p className="text-gray-300 mt-4 mb-6">
              Pilih file Excel untuk diupload
            </p>

            <div className="flex justify-center gap-4 flex-wrap">
              <Button
                component="label"
                variant="outlined"
                sx={{
                  borderColor: "#FFD700",
                  color: "#FFD700",
                  px: 3,
                  py: 1.2,
                  borderRadius: "10px",
                  fontWeight: "bold"
                }}
              >
                Pilih File
                <input
                  hidden
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleExcelSelect}
                />
              </Button>

              <Button
                variant="contained"
                disabled={!file || uploading}
                onClick={handleDownloadTemplate}
                sx={{
                  bgcolor: "#1f2733",
                  color: "#FFD700",
                  px: 3,
                  py: 1.2,
                  borderRadius: "10px",
                  fontWeight: "bold",
                  border: "1px solid #FFD700"
                }}
              >
                Download Template
              </Button>

              <Button
                variant="contained"
                onClick={handleUploadExcel}
                disabled={!file || uploading}
                sx={{
                  bgcolor: "#FFD700",
                  color: "#12171d",
                  fontWeight: "bold",
                  px: 3,
                  py: 1.2,
                  borderRadius: "10px"
                }}
              >
                {uploading ? (
                  <CircularProgress size={22} sx={{ color: "#12171d" }} />
                ) : (
                  "Import Data"
                )}
              </Button>
            </div>

            {file && (
              <p className="text-gray-200 mt-4 text-sm">
                📂 File: <span className="text-[#FFD700]">{file.name}</span>
              </p>
            )}
          </div>
        </div>

        {/* PREVIEW SECTION */}
        {previewData.length > 0 && (
          <div className="mt-10">
            <h3 className="text-xl font-semibold text-[#FFD700] mb-4">
              Preview Data:
            </h3>

            {/* GRID PREVIEW 2 KOLOM */}
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
                    {Object.entries(row).map(([key, value]) => (
                      <div key={key} className="flex flex-col">
                        <span className="text-[#FFD700]/80 text-xs font-semibold">
                          {key}
                        </span>
                        <span className="text-gray-300 text-sm break-words">
                          {String(value)}
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
                      color: "#FFD700"
                    }
                  }}
                />
              </div>
            )}
          </div>
        )}
      </TabWrapper>
    </motion.div>
  )
}
