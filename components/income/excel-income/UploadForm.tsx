/**
 * @component UploadForm
 * @description Component for uploading Excel files.
 */

"use client";

import { Button, CircularProgress } from "@mui/material";
import { InsertDriveFile } from "@mui/icons-material";

interface UploadFormProps {
  file: File | null;
  uploading: boolean;
  handleExcelSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUploadExcel: () => void;
  handleDownloadTemplate: () => void;
}

export default function UploadForm({
  file,
  uploading,
  handleExcelSelect,
  handleUploadExcel,
  handleDownloadTemplate,
}: UploadFormProps) {
  return (
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
              fontWeight: "bold",
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
            disabled={uploading}
            onClick={handleDownloadTemplate}
            sx={{
              bgcolor: "#1f2733",
              color: "#FFD700",
              px: 3,
              py: 1.2,
              borderRadius: "10px",
              fontWeight: "bold",
              border: "1px solid #FFD700",
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
              borderRadius: "10px",
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
  );
}
