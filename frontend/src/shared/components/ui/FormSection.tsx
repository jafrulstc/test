import React, { useState, memo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Collapse,
  IconButton,
  Chip,
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  required?: boolean;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  variant?: 'default' | 'card';
}

/**
 * Form section component for organizing form fields
 */
const FormSection = memo(({
  title,
  children,
  required = false,
  collapsible = false,
  defaultExpanded = true,
  variant = 'default',
}: FormSectionProps) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const handleToggle = () => {
    if (collapsible) {
      setExpanded(!expanded);
    }
  };

  const header = (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: expanded ? 3 : 0,
        cursor: collapsible ? 'pointer' : 'default',
      }}
      onClick={handleToggle}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="h6" fontWeight={600}>
          {title}
        </Typography>
        {required && (
          <Chip
            label="Required"
            size="small"
            color="error"
            variant="outlined"
          />
        )}
      </Box>
      {collapsible && (
        <IconButton size="small">
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      )}
    </Box>
  );

  const content = (
    <Collapse in={expanded} timeout="auto" unmountOnExit>
      {children}
    </Collapse>
  );

  if (variant === 'card') {
    return (
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          {header}
          {content}
        </CardContent>
      </Card>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      {header}
      {content}
    </Box>
  );
});

FormSection.displayName = 'FormSection';

export { FormSection };