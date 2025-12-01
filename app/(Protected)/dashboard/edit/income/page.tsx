"use client";

import { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import axiosInstance from "@/lib/axiosInstance";
import PageHeader from "@/app/(Protected)/dashboard/edit/common/PageHeader";
import DeleteConfirmDialog from "@/components/ui/DeleteConfirmDialog";
import { useManageData } from "@/app/(Protected)/dashboard/edit/hooks/useManageData";

// Tabs
import CategoryManager from "@/components/income/category-input/CategoryManager";
import IncomeManager from "@/components/income/inputedit-income/IncomeManager";

export default function EditIncomePage() {
  const [tab, setTab] = useState(0);

  // 1. Buat state "pemicu" refresh
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const manageData = useManageData();
  const {
    loading,
    setLoading,
    alert,
    closeAlert,
    deleteDialog,
    setDeleteDialog,
    showAlert,
    handleError,
  } = manageData;

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.id) return;
    setLoading(true);
    try {
      const url =
        deleteDialog.type === "category"
          ? `/api/categoryIncome/${deleteDialog.id}`
          : `/api/detailIncome/${deleteDialog.id}`;
      await axiosInstance.delete(url);

      showAlert(
        `🗑️ ${deleteDialog.type === "category" ? "Kategori" : "Income"} dihapus`
      );

      // 2. Ubah trigger agar child tahu ada data yang dihapus
      setRefreshTrigger((prev) => prev + 1);
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
      setDeleteDialog({ ...deleteDialog, open: false });
    }
  };

  return (
    <main className="min-h-screen font-serif text-[#ECECEC] px-6 md:px-20 py-24 bg-gradient-to-b from-[#0f141a]/70 via-[#1c2430]/80 to-[#12171d]/90 backdrop-blur-xl">
      <PageHeader
        title="EDIT & MANAGE INCOME"
        description="Ubah data pendapatan dan kategori secara cepat dan aman."
      />

      <Box
        sx={{
          width: "100%",
          maxWidth: "1200px",
          p: { xs: 2, md: 3 },
          borderRadius: "20px",
          border: "1px solid rgba(255,215,0,0.20)",
          background: "rgba(18,23,29,0.55)",
          backdropFilter: "blur(16px)",
          boxShadow: "0 0 25px rgba(255,215,0,0.08)",
          mx: "auto",
        }}
      >
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTab-root": {
              color: "#D1D5DB",
              textTransform: "none",
              fontWeight: 600,
              mr: 1,
              borderRadius: "12px",
              px: 2,
              "&.Mui-selected": {
                color: "#12171d",
                backgroundColor: "#FFD700",
              },
            },
          }}
          TabIndicatorProps={{ sx: { height: "0px" } }}
        >
          <Tab label="Category" />
          <Tab label="Income" />
        </Tabs>

        {/* 3. Kirim trigger ke Child Components */}
        {tab === 0 && (
          <CategoryManager
            baseProps={manageData}
            refreshTrigger={refreshTrigger}
            showCreate={false}
          />
        )}
        {tab === 1 && (
          <IncomeManager
            baseProps={manageData}
            refreshTrigger={refreshTrigger}
            showCreate={false}
          />
        )}
      </Box>

      <DeleteConfirmDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ ...deleteDialog, open: false })}
        onConfirm={handleDeleteConfirm}
        title={`Hapus ${deleteDialog.type}?`}
        description="Data yang dihapus tidak dapat dikembalikan."
        loading={loading}
      />

      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={closeAlert}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={alert.severity}
          variant="filled"
          sx={{ fontSize: "1.05rem", borderRadius: "10px" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>

      {loading && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
          <CircularProgress sx={{ color: "#FFD700" }} />
        </div>
      )}
    </main>
  );
}
