/**
 * @component UploadForm
 * @description Component for selecting and uploading Excel files.
 */

"use client";

import { Button, CircularProgress, MenuItem } from "@mui/material";
import { CloudUpload, InsertDriveFile } from "@mui/icons-material";
import CustomTextField from "@/components/ui/CustomTextField";

interface UploadFormProps {
  file: File | null;
  fileName: string;
  jenisUpload: "umum" | "obat";
  setJenisUpload: (val: "umum" | "obat") => void;
  uploading: boolean;
  handleExcelSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUploadExcel: () => void;
}

export default function UploadForm({
  file,
  fileName,
  jenisUpload,
  setJenisUpload,
  uploading,
  handleExcelSelect,
  handleUploadExcel,
}: UploadFormProps) {
  return (
    <>
      {/* HEADER */}
      <div className="text-center mb-10">
        <CloudUpload sx={{ fontSize: 80, color: "#FFD700" }} />
        <h2 className="text-3xl font-extrabold text-[#FFD700] mt-4 tracking-wide">
          Upload File Excel Spending
        </h2>

        <p className="text-gray-300 mt-2">
          Import data spending dengan format Excel (.xls / .xlsx)
        </p>
      </div>

      {/* JENIS UPLOAD */}
      <div className="max-w-md mx-auto mb-10 w-96">
        <CustomTextField
          select
          fullWidth
          label="Jenis Upload"
          value={jenisUpload}
          onChange={(e: any) => setJenisUpload(e.target.value)}
        >
          <MenuItem value="umum">Spending Umum</MenuItem>
          <MenuItem value="obat">Spending Obat</MenuItem>
        </CustomTextField>
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

          {fileName && (
            <p className="text-gray-200 mt-4 text-sm">
              📂 File: <span className="text-[#FFD700]">{fileName}</span>
            </p>
          )}
        </div>
      </div>
    </>
  );
}
