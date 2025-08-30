// features/person/components/personFormModal.tsx
import { memo } from 'react';
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
import { PersonForm } from './PersonForm';
import type { Person } from '~/features/education/person/types/personType';
import { tPath } from '~/shared/utils/translateType';

interface PersonFormModalProps {
  open: boolean;
  onClose: () => void;
  person?: Person | null;
  onSuccess?: (person: Person) => void;
}

/**
 * Person form modal component
 */
const PersonFormModal = memo(({ open, onClose, person, onSuccess }: PersonFormModalProps) => {
  const { t } = useTranslation();

  /** Handle successful form submission */
  const handleSuccess = (updatedPerson: Person) => {
    onSuccess?.(updatedPerson);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth disableRestoreFocus>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={600}>
            {person ? 'Edit Person' : 'Add Person'}
          </Typography>
          <IconButton onClick={onClose} size="small" aria-label={t(tPath.common.close) as string}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <PersonForm person={person} onSuccess={handleSuccess} />
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose}>
          {t(`${tPath.common.close}`)}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

PersonFormModal.displayName = 'PersonFormModal';

export { PersonFormModal };
