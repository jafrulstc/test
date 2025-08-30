import React, { memo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { StudentForm } from './StudentForm';
import type { Student } from '../types';
import { tPath } from '~/shared/utils/translateType';

interface StudentFormModalProps {
  open: boolean;
  onClose: () => void;
  student?: Student | null;
  onSuccess?: (student: Student) => void;
}

/**
 * Student form modal component
 */
const StudentFormModal = memo(({ open, onClose, student, onSuccess }: StudentFormModalProps) => {
  const { t } = useTranslation();

  /**
   * Handle successful form submission
   */
  const handleSuccess = (updatedStudent: Student) => {
    onSuccess?.(updatedStudent);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth disableRestoreFocus>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={600}>
            {student ? 'Edit Student' : 'Add Student'}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <StudentForm student={student} onSuccess={handleSuccess} />
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose}>
          {t(`${tPath.common.cancel}`)}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

StudentFormModal.displayName = 'StudentFormModal';

export { StudentFormModal };