/**
 * @component CreateForm
 * @description Component for creating new units.
 */

"use client";

import { Button, CircularProgress } from "@mui/material";
import CustomTextField from "@/components/ui/CustomTextField";

interface CreateFormProps {
  newName: string;
  setNewName: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

export default function CreateForm({
  newName,
  setNewName,
  onSubmit,
  loading,
}: CreateFormProps) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col md:flex-row gap-4 mb-8">
      <CustomTextField
        label="Nama Unit"
        value={newName}
        onChange={(e: any) => setNewName(e.target.value)}
        required
      />
      <button
        type="submit"
        disabled={loading || !newName.trim()}
        className="
          px-6 py-3 rounded-lg
          bg-[#FFD700] text-[#12171d]
          font-semibold
          hover:bg-[#FFE55C]
          disabled:bg-[#FFD700]/10 disabled:text-white/30
          transition-colors
        "
      >
        {loading ? "Menyimpan..." : "Simpan"}
      </button>
    </form>
  );
}
