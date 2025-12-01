/**
 * @component CreateForm
 * @description Component for creating new categories.
 */

"use client";

import { Button, CircularProgress } from "@mui/material";
import CustomTextField from "@/components/ui/CustomTextField";

interface CreateFormProps {
  categoryName: string;
  setCategoryName: (value: string) => void;
  handleSubmitCategory: (e: React.FormEvent) => void;
  loading: boolean;
}

export default function CreateForm({
  categoryName,
  setCategoryName,
  handleSubmitCategory,
  loading,
}: CreateFormProps) {
  return (
    <form onSubmit={handleSubmitCategory} className="flex flex-col gap-6 mb-10">
      <CustomTextField
        label="Nama Kategori Baru"
        value={categoryName}
        onChange={(e: any) => setCategoryName(e.target.value)}
        required
      />

      <Button
        type="submit"
        variant="contained"
        disabled={loading}
        sx={{
          bgcolor: "#FFD700",
          color: "#12171d",
          fontWeight: "bold",
          py: 1.6,
          borderRadius: "10px",
          fontSize: "1.05rem",
          "&:hover": { bgcolor: "#FFE55C" },
        }}
      >
        {loading ? (
          <CircularProgress size={22} sx={{ color: "#12171d" }} />
        ) : (
          "Simpan Kategori"
        )}
      </Button>
    </form>
  );
}
