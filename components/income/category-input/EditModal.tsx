/**
 * @component EditModal
 * @description Component for editing existing categories.
 */

"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import CustomTextField from "@/components/ui/CustomTextField";

interface EditModalProps {
  editing: any;
  onClose: () => void;
  onSave: (id: number, name: string) => void;
}

export default function EditModal({
  editing,
  onClose,
  onSave,
}: EditModalProps) {
  const [editName, setEditName] = useState("");

  useEffect(() => {
    if (editing) {
      setEditName(editing.name_category);
    }
  }, [editing]);

  const handleSave = () => {
    if (editing) {
      onSave(editing.id, editName);
    }
  };

  return (
    <Dialog
      open={!!editing}
      onClose={onClose}
      PaperProps={{
        sx: {
          background: "rgba(18,23,29,0.95)",
          border: "1px solid rgba(255,215,0,0.25)",
          color: "#ECECEC",
          borderRadius: "16px",
        },
      }}
    >
      <DialogTitle>Edit Kategori</DialogTitle>
      <DialogContent>
        <CustomTextField
          fullWidth
          label="Nama Kategori"
          value={editName}
          onChange={(e: any) => setEditName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: "#ECECEC" }}>
          Batal
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{ bgcolor: "#FFD700", color: "#12171d", fontWeight: 700 }}
        >
          Simpan
        </Button>
      </DialogActions>
    </Dialog>
  );
}
