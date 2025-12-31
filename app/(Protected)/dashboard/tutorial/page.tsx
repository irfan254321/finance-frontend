"use client";

import { useState, forwardRef } from "react";
import { motion } from "framer-motion";
import { Dialog, IconButton } from "@mui/material";
import Slide from "@mui/material/Slide";
import type { SlideProps } from "@mui/material/Slide";
import {
  CalendarMonth,
  AttachMoney,
  ShoppingCart,
  Edit as EditIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
// COMPONENTS
import TutorialPlayer from "@/components/tutorial/TutorialPlayer";

// ================= Transition Slide =================
const Transition = forwardRef(function Transition(
  props: SlideProps,
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type TutorialKey = "year" | "income" | "spending" | "edit" | "register" | null;

export default function TutorialPage() {
  const [openDialog, setOpenDialog] = useState<TutorialKey>(null);

  const actions = [
    {
      key: "year" as const,
      title: "Input Year",
      description: "Cara menambahkan dan mengelola tahun anggaran baru.",
      icon: <CalendarMonth sx={{ fontSize: 40 }} />,
      videoSrc: "/videos/tutorial/inputyear.mp4",
    },
    {
      key: "income" as const,
      title: "Input Income",
      description: "Panduan mencatat pemasukan rumah sakit per kategori.",
      icon: <AttachMoney sx={{ fontSize: 40 }} />,
      videoSrc: "/videos/tutorial/inputincome.mp4",
    },
    {
      key: "spending" as const,
      title: "Input Spending",
      description: "Cara input pengeluaran operasional dan belanja.",
      icon: <ShoppingCart sx={{ fontSize: 40 }} />,
      videoSrc: "/videos/tutorial/input-spending.mp4",
    },
    {
      key: "edit" as const,
      title: "Edit Data",
      description: "Tutorial mengedit data pemasukan dan pengeluaran.",
      icon: <EditIcon sx={{ fontSize: 40 }} />,
      videoSrc: "/videos/tutorial/edit-data.mp4",
    },
    {
      key: "register" as const,
      title: "Register",
      description: "Tutorial pendaftaran akun baru.",
      icon: <EditIcon sx={{ fontSize: 40 }} />,
      videoSrc: "/videos/tutorial/register.mp4",
    },
  ];

  const currentAction = actions.find((a) => a.key === openDialog) || null;

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
          TUTORIAL PENGGUNAAN
        </h1>
        <p className="text-gray-300 mt-4 text-lg max-w-3xl mx-auto">
          Panduan lengkap penggunaan sistem keuangan rumah sakit dalam format
          video.
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
        maxWidth="lg"
        fullWidth
        TransitionComponent={Transition}
        PaperProps={{
          sx: {
            background: "rgba(15,20,26,0.95)",
            backdropFilter: "blur(20px)",
            borderRadius: "26px",
            border: "1px solid rgba(255,215,0,0.25)",
            boxShadow: "0 0 60px rgba(255,215,0,0.1), 0 0 90px rgba(0,0,0,0.8)",
            overflow: "hidden",
          },
        }}
      >
        <div className="flex flex-col w-full overflow-hidden">
          {/* HEADER */}
          <div
            className="
            flex items-center justify-between px-8 pt-6 pb-4 
            border-b border-[#FFD700]/20 
            bg-gradient-to-r from-transparent via-[#FFD700]/10 to-transparent
            flex-shrink-0
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
          <div className="p-6">
            {openDialog && currentAction && (
              <TutorialPlayer
                src={currentAction.videoSrc}
                title={currentAction.title}
              />
            )}
          </div>
        </div>
      </Dialog>
    </main>
  );
}
