/**
 * @component CreateForm
 * @description A "Dumb" UI component responsible for rendering the input form
 * used to create a new company. It is stateless and relies on the parent
 * for logic and state management.
 */

"use client";

// =========================================
// IMPORTS
// =========================================
import CustomTextField from "@/components/ui/CustomTextField";

// =========================================
// TYPES & INTERFACES
// =========================================
interface CreateFormProps {
  /** The current value of the input field */
  newName: string;
  /** Function to update the input state in the parent */
  setNewName: (value: string) => void;
  /** Form submission handler */
  onSubmit: (e: React.FormEvent) => void;
  /** Loading state to disable button and show spinner */
  loading: boolean;
}

export default function CreateForm({
  newName,
  setNewName,
  onSubmit,
  loading,
}: CreateFormProps) {
  // =========================================
  // RENDER
  // =========================================
  return (
    <form onSubmit={onSubmit} className="flex flex-col md:flex-row gap-4 mb-8">
      <CustomTextField
        label="Nama Perusahaan"
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
