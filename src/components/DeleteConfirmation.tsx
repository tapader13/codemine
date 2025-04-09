'use client';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

interface DeleteConfirmationProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmation({
  open,
  onClose,
  onConfirm,
}: DeleteConfirmationProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Image</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this image? This action cannot be
          undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} color='error' variant='contained'>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
