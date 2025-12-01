import { useState } from "react";

export function useManageData() {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ open: boolean; message: string; severity: "success" | "error" | "info" }>({
    open: false, message: "", severity: "success",
  });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: number | null; type: string }>({
    open: false, id: null, type: "",
  });

  const showAlert = (message: string, severity: "success" | "error" = "success") => {
    setAlert({ open: true, message, severity });
  };

  const closeAlert = () => setAlert(prev => ({ ...prev, open: false }));

  const handleError = (e: any) => {
    const msg = e?.response?.data?.error || e?.response?.data?.message || (typeof e?.response?.data === "string" ? e.response.data : "") || e?.message || "Terjadi kesalahan";
    showAlert(msg, "error");
  };

  return {
    loading, setLoading,
    alert, showAlert, closeAlert,
    deleteDialog, setDeleteDialog,
    handleError
  };
}