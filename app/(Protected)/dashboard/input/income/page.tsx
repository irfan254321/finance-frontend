"use client";

import { useState, useEffect, forwardRef } from "react";
import { motion } from "framer-motion";
import {
  Snackbar,
  Alert,
  CircularProgress,
  Dialog,
  IconButton,
} from "@mui/material";
import Slide from "@mui/material/Slide";
import type { SlideProps } from "@mui/material/Slide";
import {
  AddCircleOutline,
  Category as CategoryIcon,
  TableView,
  Close as CloseIcon,
} from "@mui/icons-material";

// HOOKS
import CategoryManager from "@/components/income/category-input/CategoryManager";

// TABS
import ExcelManager from "@/components/income/excel-income/ExcelManager";
import IncomeManager from "@/components/income/inputedit-income/IncomeManager";

// ================= Transition Slide =================
const Transition = forwardRef(function Transition(
  props: SlideProps,
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type DialogKey = "income" | "category" | "excel" | null;

export default function InputIncomePage() {
  // Refactor: Gunakan local state untuk alert income
  const [incomeAlert, setIncomeAlert] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const income = {
    alert: incomeAlert,
    setAlert: setIncomeAlert,
  };

  // Refactor: Gunakan local state untuk alert excel
  const [excelAlert, setExcelAlert] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const excel = {
    alert: excelAlert,
    setAlert: setExcelAlert,
  };

  // Refactor: Gunakan local state untuk alert category
  const [categoryAlert, setCategoryAlert] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const category = {
    alert: categoryAlert,
    setAlert: setCategoryAlert,
  };

  const [openDialog, setOpenDialog] = useState<DialogKey>(null);

  // ALERT unified
  const activeAlert = income.alert.open
    ? { ...income.alert, setAlert: income.setAlert }
    : category.alert.open
    ? { ...category.alert, setAlert: category.setAlert }
    : excel.alert.open
    ? { ...excel.alert, setAlert: excel.setAlert }
    : null;

  const actions = [
    {
      key: "income" as const,
      title: "Input Income",
      description: "Catat pemasukan rumah sakit.",
      icon: <AddCircleOutline sx={{ fontSize: 40 }} />,
    },
    {
      key: "category" as const,
      title: "Kategori",
      description: "Kelola kategori pemasukan.",
      icon: <CategoryIcon sx={{ fontSize: 40 }} />,
    },
    {
      key: "excel" as const,
      title: "Import Excel",
      description: "Import data pemasukan massal.",
      icon: <TableView sx={{ fontSize: 40 }} />,
    },
  ];

  const currentAction = actions.find((a) => a.key === openDialog) || null;

  // ============================================================
  // ADAPTER: Sambungkan IncomeManager ke System Alert Halaman Ini
  // ============================================================
  const incomeBaseProps = {
    setLoading: (loading: boolean) => {},
    showAlert: (msg: string) => {
      income.setAlert({ open: true, message: msg, severity: "success" });
    },
    handleError: (err: any) => {
      console.error(err);
      const msg = err.response?.data?.error || "Terjadi kesalahan sistem";
      income.setAlert({ open: true, message: msg, severity: "error" });
    },
    setDeleteDialog: (config: any) => {
      // No delete dialog for input income
    },
  };

  // Auto-reset forms ketika dialog ditutup
  useEffect(() => {
    if (openDialog === null) {
      // Reset alert income
      income.setAlert({ open: false, message: "", severity: "success" });

      // Reset alert category
      category.setAlert({ open: false, message: "", severity: "success" });

      // Reset alert excel
      excel.setAlert({ open: false, message: "", severity: "success" });
    }
  }, [openDialog]);

  return (
    <main
      className="
        min-h-screen font-serif text-[#ECECEC] px-6 md:px-20 py-24
        bg-gradient-to-b from-[#0f141a] via-[#111720] to-[#0b0e14]
        relative overflow-hidden
      "
    >
      {/* Spotlight */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[450px] w-[450px] bg-[#FFD700]/10 blur-[140px] rounded-full"></div>
      </div>

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold text-[#FFD700] drop-shadow-[0_0_20px_rgba(255,215,0,0.4)]">
          INPUT PEMASUKAN RUMAH SAKIT
        </h1>
        <p className="text-gray-300 mt-4 text-lg max-w-3xl mx-auto">
          Kelola seluruh pemasukan dengan UI premium, modern, dan transparan.
        </p>
      </motion.div>

      {/* ACTION CARDS */}
      <section className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {actions.map((action) => (
            <motion.button
              key={action.key}
              onClick={() => setOpenDialog(action.key)}
              whileHover={{ y: -6, scale: 1.03 }}
              transition={{ type: "spring", stiffness: 160, damping: 15 }}
              className="
                group relative overflow-hidden
                text-left rounded-3xl p-7
                bg-white/5 
                backdrop-blur-xl 
                border border-[#FFD700]/20
                shadow-[0_8px_30px_rgba(0,0,0,0.45)]
                hover:shadow-[0_0_40px_rgba(255,215,0,0.18)]
                transition-all duration-300
                flex flex-col gap-3
              "
            >
              <div
                className="
                  absolute inset-0 opacity-0 group-hover:opacity-25 
                  bg-gradient-to-br from-[#FFD700]/25 to-transparent
                  transition-opacity duration-300
                "
              />
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-[#FFD700]/10 group-hover:bg-[#FFD700]/20 transition">
                  {action.icon}
                </div>
                <h2 className="text-xl md:text-2xl font-semibold text-[#FFD700] drop-shadow-[0_0_6px_rgba(255,215,0,0.6)]">
                  {action.title}
                </h2>
              </div>
              <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                {action.description}
              </p>
            </motion.button>
          ))}
        </motion.div>
      </section>

      {/* DIALOG */}
      <Dialog
        open={openDialog !== null}
        onClose={() => setOpenDialog(null)}
        maxWidth="xl"
        fullWidth
        TransitionComponent={Transition}
        PaperProps={{
          sx: {
            background: "rgba(15,20,26,0.65)",
            backdropFilter: "blur(14px)",
            borderRadius: "26px",
            border: "1px solid rgba(255,215,0,0.25)",
            boxShadow:
              "0 0 60px rgba(255,215,0,0.06), 0 0 90px rgba(0,0,0,0.7)",
            height: "90vh",
            overflow: "hidden",
          },
        }}
      >
        <div className="flex flex-col w-full h-full overflow-hidden">
          {/* HEADER */}
          <div
            className="
            flex items-center justify-between px-8 pt-6 pb-4 
            border-b border-[#FFD700]/20 
            bg-gradient-to-r from-transparent via-[#FFD700]/10 to-transparent
            backdrop-blur-sm flex-shrink-0
           "
          >
            <h2 className="text-2xl font-semibold text-[#FFD700] drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">
              {currentAction?.title}
            </h2>

            <IconButton
              onClick={() => setOpenDialog(null)}
              sx={{
                color: "#FFD700",
                "&:hover": {
                  backgroundColor: "rgba(255,215,0,0.15)",
                  boxShadow: "0 0 12px rgba(255,215,0,0.4)",
                },
              }}
            >
              <CloseIcon sx={{ fontSize: 35 }} />
            </IconButton>
          </div>

          {/* BODY */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="max-w-5xl mx-auto">
              {openDialog === "income" && (
                <IncomeManager baseProps={incomeBaseProps} />
              )}

              {openDialog === "category" && (
                <CategoryManager
                  baseProps={{
                    ...incomeBaseProps,
                    showAlert: (msg: string) => {
                      category.setAlert({
                        open: true,
                        message: msg,
                        severity: "success",
                      });
                    },
                    handleError: (err: any) => {
                      console.error(err);
                      const msg =
                        err.response?.data?.error || "Terjadi kesalahan sistem";
                      category.setAlert({
                        open: true,
                        message: msg,
                        severity: "error",
                      });
                    },
                  }}
                />
              )}

              {openDialog === "excel" && (
                <ExcelManager
                  baseProps={{
                    ...incomeBaseProps,
                    showAlert: (msg: string) => {
                      excel.setAlert({
                        open: true,
                        message: msg,
                        severity: "success",
                      });
                    },
                    handleError: (err: any) => {
                      console.error(err);
                      const msg =
                        err.response?.data?.error || "Terjadi kesalahan sistem";
                      excel.setAlert({
                        open: true,
                        message: msg,
                        severity: "error",
                      });
                    },
                  }}
                  categories={[]}
                />
              )}
            </div>
          </div>
        </div>
      </Dialog>

      {/* ALERT */}
      {activeAlert && (
        <Snackbar
          open={activeAlert.open}
          autoHideDuration={3000}
          onClose={() =>
            activeAlert.setAlert((prev: any) => ({ ...prev, open: false }))
          }
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          sx={{
            zIndex: 9999,
            "& .MuiAlert-root": {
              backgroundColor:
                activeAlert.severity === "success"
                  ? "rgba(46, 204, 113, 0.95)"
                  : "rgba(231, 76, 60, 0.95)",
              color: "#fff",
              fontSize: "1.1rem",
              padding: "16px 24px",
              borderRadius: "14px",
              boxShadow: "0 0 30px rgba(0,0,0,0.35)",
            },
          }}
        >
          <Alert severity={activeAlert.severity} variant="filled">
            {activeAlert.message}
          </Alert>
        </Snackbar>
      )}

      {/* LOADING OVERLAY - Removed global excel loading, handled in ExcelManager */}
    </main>
  );
}
