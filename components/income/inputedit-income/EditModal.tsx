/**
 * @component EditModal
 * @description Component for editing existing income entries.
 */

"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
} from "@mui/material";
import CustomTextField from "@/components/ui/CustomTextField";

interface EditModalProps {
  editing: any;
  categories: any[];
  onClose: () => void;
  onSave: (form: any) => void;
}

export default function EditModal({
  editing,
  categories,
  onClose,
  onSave,
}: EditModalProps) {
  const [form, setForm] = useState({
    name: "",
    amount: "",
    catId: "",
    date: "",
  });

  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name_income,
        amount: String(editing.amount_income || ""),
        catId: String(editing.category_id),
        date: editing.date_income,
      });
    }
  }, [editing]);

  const handleSave = () => {
    onSave(form);
  };

  return (
    <Dialog
      open={!!editing}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: "rgba(18,23,29,0.95)",
          border: "1px solid rgba(255,215,0,0.35)",
          color: "#ECECEC",
          borderRadius: "20px",
          p: 3,
          boxShadow: "0 0 40px rgba(255,215,0,0.15)",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontSize: "1.8rem",
          fontWeight: 700,
          textAlign: "center",
          color: "#FFD700",
          mb: 2,
        }}
      >
        Edit Income
      </DialogTitle>
      <DialogContent className="flex flex-col gap-4">
        <CustomTextField
          label="Nama Income"
          fullWidth
          value={form.name}
          onChange={(e: any) => setForm({ ...form, name: e.target.value })}
        />
        <CustomTextField
          label="Jumlah (Rp)"
          fullWidth
          value={new Intl.NumberFormat("id-ID").format(
            Number(form.amount || 0)
          )}
          onChange={(e: any) =>
            setForm({
              ...form,
              amount: String(e.target.value).replace(/[^0-9]/g, ""),
            })
          }
        />
        <CustomTextField
          select
          label="Kategori"
          fullWidth
          value={form.catId}
          onChange={(e: any) => setForm({ ...form, catId: e.target.value })}
        >
          {categories.map((c) => (
            <MenuItem key={c.id} value={String(c.id)}>
              {c.name_category}
            </MenuItem>
          ))}
        </CustomTextField>
        <CustomTextField
          type="date"
          label="Tanggal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={form.date}
          onChange={(e: any) => setForm({ ...form, date: e.target.value })}
        />
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-between", mt: 2 }}>
        <Button onClick={onClose} sx={{ color: "#ECECEC", fontWeight: 600 }}>
          BATAL
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{
            bgcolor: "#FFD700",
            color: "#12171d",
            fontWeight: 700,
            px: 4,
            "&:hover": { bgcolor: "#FFE55C" },
          }}
        >
          SIMPAN
        </Button>
      </DialogActions>
    </Dialog>
  );
}
