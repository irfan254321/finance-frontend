/**
 * @component EditModal
 * @description Component for editing existing medicine details.
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
  units: any[];
  onClose: () => void;
  onSave: (form: any) => void;
}

export default function EditModal({
  editing,
  units,
  onClose,
  onSave,
}: EditModalProps) {
  const [form, setForm] = useState({
    name: "",
    qty: "",
    unitId: "",
    price: "",
  });

  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name_medicine || "",
        qty: String(editing.quantity || ""),
        unitId: String(editing.name_unit_id || ""),
        price: String(editing.price_per_item || ""),
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
        Edit Detail Obat
      </DialogTitle>
      <DialogContent className="flex flex-col gap-4">
        <CustomTextField
          label="Nama Obat"
          fullWidth
          value={form.name}
          onChange={(e: any) => setForm({ ...form, name: e.target.value })}
        />
        <CustomTextField
          label="Quantity"
          fullWidth
          value={form.qty}
          onChange={(e: any) =>
            setForm({
              ...form,
              qty: String(e.target.value).replace(/[^0-9]/g, ""),
            })
          }
        />
        <CustomTextField
          select
          label="Unit"
          fullWidth
          value={form.unitId}
          onChange={(e: any) => setForm({ ...form, unitId: e.target.value })}
        >
          {units.map((u) => (
            <MenuItem key={u.id} value={String(u.id)}>
              {u.name_unit}
            </MenuItem>
          ))}
        </CustomTextField>
        <CustomTextField
          label="Harga per Item (Rp)"
          fullWidth
          value={new Intl.NumberFormat("id-ID").format(Number(form.price || 0))}
          onChange={(e: any) =>
            setForm({ ...form, price: e.target.value.replace(/[^0-9]/g, "") })
          }
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
