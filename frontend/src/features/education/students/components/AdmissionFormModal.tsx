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
import { AdmissionForm } from './AdmissionForm';
import type { Admission } from '../types';
import { tPath } from '~/shared/utils/translateType';

interface AdmissionFormModalProps {
  open: boolean;
  onClose: () => void;
  admission?: Admission | null;
  onSuccess?: (admission: Admission) => void;
}

/**
 * Admission form modal component
 */
const AdmissionFormModal = memo(({ open, onClose, admission, onSuccess }: AdmissionFormModalProps) => {
  const { t } = useTranslation();

  /**
   * Handle successful form submission
   */
  const handleSuccess = (updatedAdmission: Admission) => {
    onSuccess?.(updatedAdmission);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth disableRestoreFocus>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={600}>
            {admission ? 'Edit Admission' : 'Add Admission'}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <AdmissionForm admission={admission} onSuccess={handleSuccess} />
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose}>
          {t(`${tPath.common.cancel}`)}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

AdmissionFormModal.displayName = 'AdmissionFormModal';

export { AdmissionFormModal };