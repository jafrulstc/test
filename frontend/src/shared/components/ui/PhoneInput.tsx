import React, { useState, useEffect, memo } from 'react';
import {
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
} from '@mui/material';
import { Phone } from '@mui/icons-material';

interface PhoneInputProps {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  error?: boolean;
  helperText?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}

/**
 * Phone input component with auto-formatting
 */
const PhoneInput = memo(({
  value = '',
  onChange,
  label = 'Phone Number',
  error = false,
  helperText,
  placeholder = '+880 1XXX-XXXXXX',
  disabled = false,
  required = false,
}: PhoneInputProps) => {
  const [displayValue, setDisplayValue] = useState('');

  // Update display value when prop value changes
  useEffect(() => {
    setDisplayValue(formatPhoneNumber(value));
  }, [value]);

  /**
   * Format phone number for display
   */
  function formatPhoneNumber(phone: string): string {
    if (!phone) return '';
    
    // Remove all non-digit characters except +
    const cleaned = phone.replace(/[^\d+]/g, '');
    
    // If it starts with +880 (Bangladesh)
    if (cleaned.startsWith('+880')) {
      const number = cleaned.slice(4); // Remove +880
      if (number.length >= 4) {
        return `+880 ${number.slice(0, 4)}-${number.slice(4)}`;
      } else {
        return `+880 ${number}`;
      }
    }
    
    // If it starts with 880
    if (cleaned.startsWith('880')) {
      const number = cleaned.slice(3); // Remove 880
      if (number.length >= 4) {
        return `+880 ${number.slice(0, 4)}-${number.slice(4)}`;
      } else {
        return `+880 ${number}`;
      }
    }
    
    // If it starts with +
    if (cleaned.startsWith('+')) {
      return cleaned;
    }
    
    // If it's a local number (starts with 01)
    if (cleaned.startsWith('01')) {
      if (cleaned.length >= 5) {
        return `+880 ${cleaned.slice(1, 5)}-${cleaned.slice(5)}`;
      } else {
        return `+880 ${cleaned.slice(1)}`;
      }
    }
    
    // If it's just digits
    if (cleaned.length > 0) {
      if (cleaned.length >= 4) {
        return `+880 ${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
      } else {
        return `+880 ${cleaned}`;
      }
    }
    
    return cleaned;
  }

  /**
   * Get raw phone number (without formatting)
   */
  function getRawPhoneNumber(formatted: string): string {
    return formatted.replace(/[^\d+]/g, '');
  }

  /**
   * Handle input change
   */
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    const rawValue = getRawPhoneNumber(inputValue);
    const formattedValue = formatPhoneNumber(rawValue);
    
    setDisplayValue(formattedValue);
    onChange?.(rawValue);
  };

  /**
   * Handle input focus
   */
  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    // If empty, start with +880
    if (!displayValue) {
      const newValue = '+880 ';
      setDisplayValue(newValue);
      onChange?.('+880');
    }
  };

  return (
    <FormControl fullWidth error={error} disabled={disabled}>
      <InputLabel htmlFor="phone-input">
        {label}{required && ' *'}
      </InputLabel>
      <OutlinedInput
        id="phone-input"
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        placeholder={placeholder}
        startAdornment={
          <InputAdornment position="start">
            <Phone />
          </InputAdornment>
        }
        label={`${label}${required ? ' *' : ''}`}
      />
      {helperText && (
        <FormHelperText>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
});

PhoneInput.displayName = 'PhoneInput';

export { PhoneInput };