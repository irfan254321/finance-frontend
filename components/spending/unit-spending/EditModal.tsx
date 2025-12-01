/**
 * @component EditModal
 * @description Component for editing existing units.
 */

"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";
import CustomTextField from "@/components/ui/CustomTextField";

interface Unit {
  id: number;
  name_unit: string;
}

interface EditModalProps {
  item: Unit;
  onClose: () => void;
  onSubmit: (id: number, newName: string) => Promise<void>;
}

export default function EditModal({ item, onClose, onSubmit }: EditModalProps) {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (item) {
      setName(item.name_unit);
    }
  }, [item]);

  const handleSave = async () => {
    if (!name.trim()) return;

    try {
      setIsSubmitting(true);
      await onSubmit(item.id, name);
      onClose();
    } catch (error) {
      // Error handling by parent
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={!!item}
      onClose={onClose}
      PaperProps={{
        sx: {
          background: "rgba(18,23,29,0.95)",
          border: "1px solid rgba(255,215,0,0.25)",
          color: "#ECECEC",
          borderRadius: "16px",
          minWidth: "400px",
        },
      }}
    >
      <DialogTitle sx={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        Edit Unit
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <CustomTextField
          fullWidth
          label="Nama Unit"
          value={name}
          onChange={(e: any) => setName(e.target.value)}
          autoFocus
        />
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} sx={{ color: "#888" }}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={isSubmitting || !name.trim()}
          sx={{
            bgcolor: "#FFD700",
            color: "#12171d",
            fontWeight: 700,
            "&:hover": { bgcolor: "#FFE55C" },
          }}
        >
          {isSubmitting ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Update"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
