/**
 * @component EditModal
 * @description Placeholder for Edit Modal.
 * Currently not used for Excel Import but kept for structural consistency.
 */

"use client";

import { Dialog, DialogContent, DialogTitle } from "@mui/material";

interface EditModalProps {
  open: boolean;
  onClose: () => void;
}

export default function EditModal({ open, onClose }: EditModalProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Data</DialogTitle>
      <DialogContent>
        <p>Edit functionality is not available for Excel preview.</p>
      </DialogContent>
    </Dialog>
  );
}
