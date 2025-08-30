import React, { memo } from 'react';
import {
  Box,
  Button,
  IconButton,
  Typography,
  Card,
  CardContent,
  Alert,
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';

interface DynamicFieldArrayProps {
  title: string;
  fields: any[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  renderField: (field: any, index: number) => React.ReactNode;
  minItems?: number;
  maxItems?: number;
  addButtonText?: string;
  emptyMessage?: string;
}

/**
 * Dynamic field array component for repeatable form sections
 */
const DynamicFieldArray = memo(({
  title,
  fields,
  onAdd,
  onRemove,
  renderField,
  minItems = 0,
  maxItems = 10,
  addButtonText,
  emptyMessage,
}: DynamicFieldArrayProps) => {
  const canAdd = fields.length < maxItems;
  const canRemove = fields.length > minItems;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          {title}s
        </Typography>
        {canAdd && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<Add />}
            onClick={onAdd}
          >
            {addButtonText || `Add ${title}`}
          </Button>
        )}
      </Box>

      {/* Fields */}
      {fields.length > 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {fields.map((field, index) => (
            <Card key={field.id} variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {title} {index + 1}
                  </Typography>
                  {canRemove && (
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => onRemove(index)}
                    >
                      <Remove />
                    </IconButton>
                  )}
                </Box>
                {renderField(field, index)}
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <Alert severity="info">
          {emptyMessage || `No ${title.toLowerCase()}s added yet. Click "Add ${title}" to get started.`}
        </Alert>
      )}

      {/* Max items reached */}
      {!canAdd && fields.length > 0 && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          Maximum number of {title.toLowerCase()}s ({maxItems}) reached.
        </Alert>
      )}
    </Box>
  );
});

DynamicFieldArray.displayName = 'DynamicFieldArray';

export { DynamicFieldArray };