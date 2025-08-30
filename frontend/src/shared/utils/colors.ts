/**
 * Color utility functions for consistent theming
 */

/**
 * Generate consistent avatar color based on ID
 */
export const getAvatarColor = (id: string): string => {
  const colors = [
    '#1E88E5', // blue
    '#43A047', // green
    '#E53935', // red
    '#FB8C00', // orange
    '#8E24AA', // purple
    '#00ACC1', // cyan
    '#F4511E', // deep orange
    '#3949AB', // indigo
    '#00897B', // teal
    '#7CB342', // light green
  ];

  // Simple hash function to get consistent color based on ID
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

/**
 * Get status color based on status value
 */
export const getStatusColor = (status: string): 'success' | 'primary' | 'warning' | 'info' | 'default' => {
  switch (status.toLowerCase()) {
    case 'available':
      return 'success';
    case 'occupied':
      return 'primary';
    case 'maintenance':
      return 'warning';
    case 'reserved':
      return 'info';
    default:
      return 'default';
  }
};

/**
 * Get bed status color
 */
export const getBedStatusColor = (status: string): 'success' | 'error' | 'warning' | 'default' => {
  switch (status.toLowerCase()) {
    case 'available':
      return 'success';
    case 'occupied':
      return 'error';
    case 'maintenance':
      return 'warning';
    default:
      return 'default';
  }
};

/**
 * Get occupancy color based on percentage
 */
export const getOccupancyColor = (occupied: number, capacity: number): 'success' | 'info' | 'warning' | 'error' => {
  if (capacity === 0) return 'success';
  
  const percentage = (occupied / capacity) * 100;
  
  if (percentage === 0) return 'success';
  if (percentage < 50) return 'info';
  if (percentage < 100) return 'warning';
  return 'error';
};

/**
 * Convert hex color to rgba
 */
export const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};