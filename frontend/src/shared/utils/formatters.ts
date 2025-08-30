/**
 * Formatting utility functions
 */

/**
 * Format date to localized string
 */
export const formatDate = (date: string | Date, locale: string = 'en-US'): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString(locale);
  } catch {
    return 'Invalid date';
  }
};

/**
 * Format date and time to localized string
 */
export const formatDateTime = (date: string | Date, locale: string = 'en-US'): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleString(locale);
  } catch {
    return 'Invalid date';
  }
};

/**
 * Format phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 11 && cleaned.startsWith('880')) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
  }
  
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  
  return phone;
};

/**
 * Format name (capitalize first letter of each word)
 */
export const formatName = (name: string): string => {
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Format percentage
 */
export const formatPercentage = (value: number, decimals: number = 0): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

/**
 * Generate initials from name
 */
export const generateInitials = (firstName?: string, lastName?: string): string => {
  const first = firstName ? firstName.charAt(0).toUpperCase() : '';
  const last = lastName ? lastName.charAt(0).toUpperCase() : '';
  return `${first}${last}`;
};


/**
 * Generate a consistent avatar background color from a string (e.g., user ID)
 */
export const getAvatarColor = (input: string): string => {
  const colors = [
    '#F44336', // red
    '#E91E63', // pink
    '#9C27B0', // purple
    '#673AB7', // deep purple
    '#3F51B5', // indigo
    '#2196F3', // blue
    '#03A9F4', // light blue
    '#00BCD4', // cyan
    '#009688', // teal
    '#4CAF50', // green
    '#8BC34A', // light green
    '#CDDC39', // lime
    '#FFEB3B', // yellow
    '#FFC107', // amber
    '#FF9800', // orange
    '#FF5722', // deep orange
    '#795548', // brown
    '#607D8B'  // blue grey
  ];

  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    // basic hash function
    hash = input.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash % colors.length);
  return colors[index];
};
