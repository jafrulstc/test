/**
 * Utility functions for exporting data to various formats
 */

/**
 * Convert array of objects to CSV format and trigger download
 * @param data Array of objects to export
 * @param filename Name of the file to download
 */
export const exportToCsv = (data: Record<string, any>[], filename: string): void => {
  if (!data || data.length === 0) {
    console.warn('No data provided for CSV export');
    return;
  }

  try {
    // Get headers from the first object
    const headers = Object.keys(data[0]);
    
    // Create CSV content
    const csvContent = [
      // Header row
      headers.map(header => `"${header}"`).join(','),
      // Data rows
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Handle null/undefined values
          if (value === null || value === undefined) {
            return '""';
          }
          // Convert to string and escape quotes
          const stringValue = String(value).replace(/"/g, '""');
          return `"${stringValue}"`;
        }).join(',')
      )
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      console.error('CSV download not supported in this browser');
    }
  } catch (error) {
    console.error('Error exporting CSV:', error);
    throw new Error('Failed to export CSV file');
  }
};

/**
 * Convert array of objects to JSON format and trigger download
 * @param data Array of objects to export
 * @param filename Name of the file to download
 */
export const exportToJson = (data: Record<string, any>[], filename: string): void => {
  if (!data || data.length === 0) {
    console.warn('No data provided for JSON export');
    return;
  }

  try {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      console.error('JSON download not supported in this browser');
    }
  } catch (error) {
    console.error('Error exporting JSON:', error);
    throw new Error('Failed to export JSON file');
  }
};

/**
 * Convert HTML table to CSV format and trigger download
 * @param tableElement HTML table element to export
 * @param filename Name of the file to download
 */
export const exportTableToCsv = (tableElement: HTMLTableElement, filename: string): void => {
  if (!tableElement) {
    console.warn('No table element provided for CSV export');
    return;
  }

  try {
    const rows = Array.from(tableElement.querySelectorAll('tr'));
    const csvContent = rows.map(row => {
      const cells = Array.from(row.querySelectorAll('th, td'));
      return cells.map(cell => {
        // Get text content and clean it up
        const text = cell.textContent || '';
        const cleanText = text.trim().replace(/\s+/g, ' ');
        // Escape quotes and wrap in quotes
        const escapedText = cleanText.replace(/"/g, '""');
        return `"${escapedText}"`;
      }).join(',');
    }).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      console.error('CSV download not supported in this browser');
    }
  } catch (error) {
    console.error('Error exporting table to CSV:', error);
    throw new Error('Failed to export table to CSV');
  }
};

/**
 * Format data for export by flattening nested objects and arrays
 * @param data Array of objects to format
 * @param options Formatting options
 */
export const formatDataForExport = (
  data: Record<string, any>[], 
  options: {
    flattenArrays?: boolean;
    arrayDelimiter?: string;
    dateFormat?: 'iso' | 'locale';
    excludeFields?: string[];
  } = {}
): Record<string, any>[] => {
  const {
    flattenArrays = true,
    arrayDelimiter = ', ',
    dateFormat = 'locale',
    excludeFields = []
  } = options;

  return data.map(item => {
    const formatted: Record<string, any> = {};

    Object.entries(item).forEach(([key, value]) => {
      // Skip excluded fields
      if (excludeFields.includes(key)) {
        return;
      }

      // Handle arrays
      if (Array.isArray(value)) {
        if (flattenArrays) {
          formatted[key] = value.join(arrayDelimiter);
        } else {
          formatted[key] = JSON.stringify(value);
        }
        return;
      }

      // Handle dates
      if (value instanceof Date) {
        formatted[key] = dateFormat === 'iso' 
          ? value.toISOString() 
          : value.toLocaleDateString();
        return;
      }

      // Handle objects (flatten one level)
      if (value && typeof value === 'object') {
        Object.entries(value).forEach(([nestedKey, nestedValue]) => {
          formatted[`${key}_${nestedKey}`] = nestedValue;
        });
        return;
      }

      // Handle primitive values
      formatted[key] = value;
    });

    return formatted;
  });
};