import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { WarningAmberRounded } from "@mui/icons-material";

interface DeleteConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  loading?: boolean;
}

export default function DeleteConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description = "Tindakan ini tidak dapat dibatalkan.",
  loading = false,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          background: "rgba(18, 23, 29, 0.95)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 99, 99, 0.3)",
          borderRadius: "24px",
          padding: "16px",
          boxShadow: "0 0 40px rgba(255, 99, 99, 0.1)",
          minWidth: "320px",
          maxWidth: "400px",
        },
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        textAlign="center"
        gap={2}
        py={2}
      >
        <Box
          sx={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            bgcolor: "rgba(255, 99, 99, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ff6363",
          }}
        >
          <WarningAmberRounded sx={{ fontSize: 32 }} />
        </Box>

        <DialogTitle sx={{ p: 0, color: "#ECECEC", fontWeight: 700, fontSize: "1.5rem" }}>
          {title}
        </DialogTitle>

        <DialogContent sx={{ p: 0, px: 2 }}>
          <Typography sx={{ color: "#9CA3AF", fontSize: "1rem" }}>
            {description}
          </Typography>
        </DialogContent>

        <DialogActions sx={{ width: "100%", justifyContent: "center", gap: 2, mt: 2, p: 0 }}>
          <Button
            onClick={onClose}
            disabled={loading}
            sx={{
              color: "#ECECEC",
              fontWeight: 600,
              textTransform: "none",
              fontSize: "1rem",
              px: 3,
              borderRadius: "12px",
              "&:hover": { bgcolor: "rgba(255,255,255,0.05)" },
            }}
          >
            Batal
          </Button>
          <Button
            onClick={onConfirm}
            variant="contained"
            disabled={loading}
            sx={{
              bgcolor: "#ff6363",
              color: "#fff",
              fontWeight: 600,
              textTransform: "none",
              fontSize: "1rem",
              px: 3,
              borderRadius: "12px",
              boxShadow: "0 4px 14px rgba(255, 99, 99, 0.4)",
              "&:hover": { bgcolor: "#e05252" },
            }}
          >
            {loading ? "Menghapus..." : "Hapus"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
