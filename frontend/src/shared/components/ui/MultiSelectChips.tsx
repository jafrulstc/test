import React, { memo } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Box,
  Chip,
  Checkbox,
  ListItemText,
  FormHelperText,
} from '@mui/material';

interface Option {
  value: string;
  label: string;
}

interface MultiSelectChipsProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: Option[];
  label: string;
  error?: boolean;
  helperText?: string;
  placeholder?: string;
  disabled?: boolean;
  maxItems?: number;
}

/**
 * Multi-select component with chip display
 */
const MultiSelectChips = memo(({
  value = [],
  onChange,
  options = [],
  label,
  error = false,
  helperText,
  placeholder = 'Select options',
  disabled = false,
  maxItems,
}: MultiSelectChipsProps) => {
  const handleChange = (event: any) => {
    const selectedValues = event.target.value as string[];
    
    // Apply max items limit if specified
    if (maxItems && selectedValues.length > maxItems) {
      return;
    }
    
    onChange(selectedValues);
  };

  const getOptionLabel = (optionValue: string): string => {
    const option = options.find(opt => opt.value === optionValue);
    return option ? option.label : optionValue;
  };

  const canSelectMore = !maxItems || value.length < maxItems;

  return (
    <FormControl fullWidth error={error} disabled={disabled}>
      <InputLabel>{label}</InputLabel>
      <Select
        multiple
        value={value}
        onChange={handleChange}
        input={<OutlinedInput label={label} />}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {(selected as string[]).map((optionValue) => (
              <Chip
                key={optionValue}
                label={getOptionLabel(optionValue)}
                size="small"
                onDelete={() => {
                  const newValue = value.filter(v => v !== optionValue);
                  onChange(newValue);
                }}
                onMouseDown={(event) => {
                  event.stopPropagation();
                }}
              />
            ))}
          </Box>
        )}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 300,
            },
          },
        }}
      >
        {options.map((option) => {
          const isSelected = value.includes(option.value);
          const isDisabled = !isSelected && !canSelectMore;
          
          return (
            <MenuItem
              key={option.value}
              value={option.value}
              disabled={isDisabled}
            >
              <Checkbox checked={isSelected} />
              <ListItemText primary={option.label} />
            </MenuItem>
          );
        })}
        
        {options.length === 0 && (
          <MenuItem disabled>
            <ListItemText primary="No options available" />
          </MenuItem>
        )}
      </Select>
      
      {helperText && (
        <FormHelperText>
          {helperText}
          {maxItems && ` (Max ${maxItems} items)`}
        </FormHelperText>
      )}
      
      {maxItems && value.length >= maxItems && (
        <FormHelperText>
          Maximum number of items ({maxItems}) selected
        </FormHelperText>
      )}
    </FormControl>
  );
});

MultiSelectChips.displayName = 'MultiSelectChips';

export { MultiSelectChips };