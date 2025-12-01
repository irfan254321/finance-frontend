/**
 * @component EditModal
 * @description A "Dumb" UI component responsible for the Edit Category form.
 * It manages local form state and delegates the save action to the parent.
 */

"use client";

// =========================================
// IMPORTS
// =========================================
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

// =========================================
// TYPES & INTERFACES
// =========================================
interface Category {
  id: number;
  name_category: string;
}

interface EditModalProps {
  /** The category object to be edited. If null, the modal is closed. */
  item: Category;
  /** Callback to close the modal dialog */
  onClose: () => void;
  /** Callback to submit the update. Returns a promise that resolves when done. */
  onSubmit: (id: number, newName: string) => Promise<void>;
}

export default function EditModal({ item, onClose, onSubmit }: EditModalProps) {
  // =========================================
  // STATE MANAGEMENT
  // =========================================
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // =========================================
  // EFFECTS
  // =========================================

  /**
   * Synchronize local form state with the selected item.
   * Runs every time the 'item' prop changes.
   */
  useEffect(() => {
    if (item) {
      setName(item.name_category);
    }
  }, [item]);

  // =========================================
  // HANDLERS
  // =========================================

  /**
   * Submits the updated data to the parent.
   */
  const handleSave = async () => {
    if (!name.trim()) return; // Basic validation

    try {
      setIsSubmitting(true);
      await onSubmit(item.id, name);
      onClose();
    } catch (error) {
      // Error handling is expected to be done by the parent or global handler
      // But we stop the loading state here
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================================
  // RENDER
  // =========================================
  return (
    <Dialog
      open={!!item}
      onClose={onClose}
      // Custom styling for Dark Mode theme
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
        Edit Category
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <CustomTextField
          fullWidth
          label="Category Name"
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
