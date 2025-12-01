/**
 * @component EditModal
 * @description Component for editing existing spending entries.
 */

"use client";

import { useState } from "react";
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
    name: editing.name_spending,
    amount: String(editing.amount_spending ?? ""),
    catId: String(editing.category_id),
    date: editing.date_spending.split("T")[0],
    compId: editing.company_id ? String(editing.company_id) : "",
  });

  const originalCat = editing.category_id;

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
          border: "1px solid rgba(255,215,0,0.25)",
          color: "#ECECEC",
          borderRadius: "16px",
        },
      }}
    >
      <DialogTitle>Edit Spending</DialogTitle>
      <DialogContent className="flex flex-col gap-3">
        <CustomTextField
          label="Nama Spending"
          fullWidth
          value={form.name}
          onChange={(e: any) => setForm({ ...form, name: e.target.value })}
        />
        <CustomTextField
          select
          label="Kategori"
          fullWidth
          value={form.catId}
          onChange={(e: any) => setForm({ ...form, catId: e.target.value })}
        >
          {categories.map((c) => {
            const current = String(c.id);
            const disable =
              (String(originalCat) === "9" && current !== "9") ||
              (String(originalCat) !== "9" && current === "9");
            return (
              <MenuItem key={c.id} value={String(c.id)} disabled={disable}>
                {c.name_category}
              </MenuItem>
            );
          })}
        </CustomTextField>
        <CustomTextField
          label="Tanggal"
          type="date"
          fullWidth
          value={form.date}
          onChange={(e: any) => setForm({ ...form, date: e.target.value })}
          InputLabelProps={{ shrink: true }}
        />

        {/* Logic Conditional Rendering */}
        {form.catId === "9" ? (
          <CustomTextField
            label="Company ID"
            fullWidth
            value={form.compId}
            onChange={(e: any) => setForm({ ...form, compId: e.target.value })}
          />
        ) : (
          <CustomTextField
            label="Amount (Rp)"
            fullWidth
            value={new Intl.NumberFormat("id-ID").format(Number(form.amount))}
            onChange={(e: any) =>
              setForm({ ...form, amount: e.target.value.replace(/\D/g, "") })
            }
          />
        )}
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
