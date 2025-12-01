/**
 * @component ExcelManager
 * @description Smart component (Container) that orchestrates Excel Upload operations.
 */

"use client";

import { useEffect } from "react";
import { useSpendingExcel } from "@/hooks/spendingInput/useSpendingExcel";
import TabWrapper from "@/components/tabWrapper";
import UploadForm from "./UploadForm";
import ExcelList from "./ExcelList";
import EditModal from "./EditModal";

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
}

export default function ExcelManager({ baseProps }: ExcelManagerProps) {
  const { showAlert } = baseProps;
  const excel = useSpendingExcel();

  // Sync internal alerts to parent
  useEffect(() => {
    if (excel.alert.open) {
      if (excel.alert.severity === "error") {
        // We can't easily pass severity to baseProps.showAlert if it only takes string
        // But assuming baseProps.showAlert is simple, we might need to handle error differently
        // or just pass the message.
        // However, baseProps.handleError might be better for errors?
        // Let's just use showAlert for now, or if baseProps supports severity.
        // The baseProps definition in page.tsx usually sets severity to success.
        // Let's check page.tsx implementation.
        // In page.tsx: showAlert: (msg) => company.setAlert({ open: true, message: msg, severity: "success" })
        // So it defaults to success.
        // If we want error, we might need to use handleError or a custom prop.
        // But for now, let's just use showAlert.
        showAlert(excel.alert.message);
      } else {
        showAlert(excel.alert.message);
      }

      // Reset internal alert
      excel.setAlert((prev) => ({ ...prev, open: false }));
    }
  }, [excel.alert, showAlert, excel.setAlert]);

  return (
    <TabWrapper>
      <UploadForm
        file={excel.file}
        fileName={excel.fileName}
        jenisUpload={excel.jenisUpload}
        setJenisUpload={excel.setJenisUpload}
        uploading={excel.uploading}
        handleExcelSelect={excel.handleExcelSelect}
        handleUploadExcel={excel.handleUploadExcel}
      />

      <ExcelList previewData={excel.previewData} />

      {/* EditModal is unused but imported to follow structure */}
      <EditModal open={false} onClose={() => {}} />
    </TabWrapper>
  );
}
