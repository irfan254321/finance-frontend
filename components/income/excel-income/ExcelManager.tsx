/**
 * @component ExcelManager
 * @description Smart component (Container) that orchestrates Excel upload operations
 * for Income. It manages the state and logic, while delegating
 * UI rendering to dumb components (UploadForm, ExcelList).
 */

"use client";

import { useEffect } from "react";
import { CloudUpload } from "@mui/icons-material";
import TabWrapper from "@/components/tabWrapper";
import UploadForm from "./UploadForm";
import ExcelList from "./ExcelList";
import { useIncomeExcel } from "@/hooks/incomeInput/useIncomeExcel";
import { useCategoryIncome } from "@/hooks/incomeInput/useCategoryIncome";

interface ExcelManagerProps {
  baseProps: {
    handleError: (err: any) => void;
    showAlert: (msg: string) => void;
    setDeleteDialog: (config: {
      open: boolean;
      id: number | null;
      type: string;
    }) => void;
    setLoading: (state: boolean) => void;
  };
  categories: any[];
}

export default function ExcelManager({
  baseProps,
  categories,
}: ExcelManagerProps) {
  const { showAlert } = baseProps;

  // Use the hook internally
  const excel = useIncomeExcel(categories);

  // Sync alerts from hook to parent
  useEffect(() => {
    if (excel.alert.open) {
      showAlert(excel.alert.message);
      excel.setAlert((prev) => ({ ...prev, open: false }));
    }
  }, [excel.alert, showAlert, excel.setAlert]);

  return (
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

      <UploadForm
        file={excel.file}
        uploading={excel.uploading}
        handleExcelSelect={excel.handleExcelSelect}
        handleUploadExcel={excel.handleUploadExcel}
        handleDownloadTemplate={excel.handleDownloadTemplate}
      />

      <ExcelList previewData={excel.previewData} />
    </TabWrapper>
  );
}
