/**
 * @component EditModal
 * @description Placeholder for EditModal.
 * Excel preview editing is not currently implemented.
 */

"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

interface EditModalProps {
  onClose: () => void;
}

export default function EditModal({ onClose }: EditModalProps) {
  return (
    <Dialog open={false} onClose={onClose}>
      <DialogTitle>Edit Excel Row</DialogTitle>
      <DialogContent>
        <p>Editing not available for Excel preview.</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
