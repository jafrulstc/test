/**
 * Utility functions for printing documents and tables
 */

/**
 * Print a table element with custom styling
 * @param tableElement HTML table element to print
 * @param title Optional title for the printed document
 * @param subtitle Optional subtitle for the printed document
 */
export const printTable = (
  tableElement: HTMLTableElement, 
  title?: string, 
  subtitle?: string
): void => {
  if (!tableElement) {
    console.warn('No table element provided for printing');
    return;
  }

  try {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      throw new Error('Unable to open print window. Please check popup blocker settings.');
    }

    // Clone the table to avoid modifying the original
    const clonedTable = tableElement.cloneNode(true) as HTMLTableElement;
    
    // Create the print document content
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${title || 'Report'}</title>
          <style>
            body {
              font-family: 'Roboto', Arial, sans-serif;
              margin: 20px;
              color: #333;
              line-height: 1.4;
            }
            
            .print-header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #1976d2;
              padding-bottom: 20px;
            }
            
            .print-title {
              font-size: 24px;
              font-weight: bold;
              color: #1976d2;
              margin: 0 0 10px 0;
            }
            
            .print-subtitle {
              font-size: 14px;
              color: #666;
              margin: 0;
            }
            
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
              font-size: 12px;
            }
            
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
              vertical-align: top;
            }
            
            th {
              background-color: #f5f5f5;
              font-weight: bold;
              color: #333;
            }
            
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            
            tr:hover {
              background-color: #f0f0f0;
            }
            
            .print-footer {
              margin-top: 30px;
              text-align: center;
              font-size: 10px;
              color: #666;
              border-top: 1px solid #ddd;
              padding-top: 10px;
            }
            
            /* Print-specific styles */
            @media print {
              body {
                margin: 0;
                font-size: 10px;
              }
              
              .print-header {
                margin-bottom: 20px;
              }
              
              .print-title {
                font-size: 18px;
              }
              
              .print-subtitle {
                font-size: 12px;
              }
              
              table {
                font-size: 9px;
              }
              
              th, td {
                padding: 4px;
              }
              
              .print-footer {
                margin-top: 20px;
                font-size: 8px;
              }
              
              /* Avoid page breaks inside table rows */
              tr {
                page-break-inside: avoid;
              }
              
              /* Ensure table headers repeat on each page */
              thead {
                display: table-header-group;
              }
              
              /* Hide elements that shouldn't be printed */
              .no-print {
                display: none !important;
              }
            }
            
            /* Clean up any existing styles that might interfere */
            .MuiChip-root {
              display: inline-block;
              padding: 2px 6px;
              border-radius: 12px;
              font-size: 10px;
              background-color: #e3f2fd;
              border: 1px solid #2196f3;
              color: #1976d2;
            }
            
            .MuiAvatar-root {
              display: none;
            }
            
            /* Simplify complex elements for printing */
            .MuiBox-root {
              display: block;
            }
          </style>
        </head>
        <body>
          <div class="print-header">
            ${title ? `<h1 class="print-title">${title}</h1>` : ''}
            ${subtitle ? `<p class="print-subtitle">${subtitle}</p>` : ''}
          </div>
          
          ${clonedTable.outerHTML}
          
          <div class="print-footer">
            <p>Generated on ${new Date().toLocaleString()}</p>
          </div>
        </body>
      </html>
    `;

    // Write content to print window
    printWindow.document.write(printContent);
    printWindow.document.close();

    // Wait for content to load, then print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    };

    // Fallback for browsers that don't support onload
    setTimeout(() => {
      if (printWindow && !printWindow.closed) {
        printWindow.print();
        printWindow.close();
      }
    }, 1000);

  } catch (error) {
    console.error('Error printing table:', error);
    throw new Error('Failed to print table');
  }
};

/**
 * Print any HTML element with custom styling
 * @param element HTML element to print
 * @param title Optional title for the printed document
 * @param customStyles Optional custom CSS styles
 */
export const printElement = (
  element: HTMLElement, 
  title?: string, 
  customStyles?: string
): void => {
  if (!element) {
    console.warn('No element provided for printing');
    return;
  }

  try {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      throw new Error('Unable to open print window. Please check popup blocker settings.');
    }

    const clonedElement = element.cloneNode(true) as HTMLElement;
    
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${title || 'Document'}</title>
          <style>
            body {
              font-family: 'Roboto', Arial, sans-serif;
              margin: 20px;
              color: #333;
              line-height: 1.4;
            }
            
            ${customStyles || ''}
            
            @media print {
              body {
                margin: 0;
              }
              
              .no-print {
                display: none !important;
              }
            }
          </style>
        </head>
        <body>
          ${title ? `<h1 style="text-align: center; color: #1976d2; margin-bottom: 30px;">${title}</h1>` : ''}
          ${clonedElement.outerHTML}
          <div style="margin-top: 30px; text-align: center; font-size: 10px; color: #666;">
            Generated on ${new Date().toLocaleString()}
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();

    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    };

    setTimeout(() => {
      if (printWindow && !printWindow.closed) {
        printWindow.print();
        printWindow.close();
      }
    }, 1000);

  } catch (error) {
    console.error('Error printing element:', error);
    throw new Error('Failed to print element');
  }
};

/**
 * Print the current page with optional custom styles
 * @param title Optional title for the printed document
 * @param customStyles Optional custom CSS styles for printing
 */
export const printCurrentPage = (title?: string, customStyles?: string): void => {
  try {
    // Add custom styles for printing if provided
    if (customStyles) {
      const styleElement = document.createElement('style');
      styleElement.media = 'print';
      styleElement.textContent = customStyles;
      document.head.appendChild(styleElement);
      
      // Remove the style element after printing
      window.addEventListener('afterprint', () => {
        document.head.removeChild(styleElement);
      }, { once: true });
    }

    // Set page title for printing
    const originalTitle = document.title;
    if (title) {
      document.title = title;
    }

    // Print the page
    window.print();

    // Restore original title
    if (title) {
      document.title = originalTitle;
    }

  } catch (error) {
    console.error('Error printing current page:', error);
    throw new Error('Failed to print current page');
  }
};

/**
 * Generate a printable report from data
 * @param data Array of objects to include in the report
 * @param title Report title
 * @param columns Column configuration for the report
 */
export const generatePrintableReport = (
  data: Record<string, any>[],
  title: string,
  columns: { key: string; label: string; width?: string }[]
): void => {
  if (!data || data.length === 0) {
    console.warn('No data provided for report generation');
    return;
  }

  try {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      throw new Error('Unable to open print window. Please check popup blocker settings.');
    }

    // Generate table HTML
    const tableHTML = `
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            ${columns.map(col => 
              `<th style="border: 1px solid #ddd; padding: 8px; background-color: #f5f5f5; text-align: left; ${col.width ? `width: ${col.width};` : ''}">${col.label}</th>`
            ).join('')}
          </tr>
        </thead>
        <tbody>
          ${data.map(row => `
            <tr>
              ${columns.map(col => 
                `<td style="border: 1px solid #ddd; padding: 8px;">${row[col.key] || ''}</td>`
              ).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${title}</title>
          <style>
            body {
              font-family: 'Roboto', Arial, sans-serif;
              margin: 20px;
              color: #333;
              line-height: 1.4;
            }
            
            .report-header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #1976d2;
              padding-bottom: 20px;
            }
            
            .report-title {
              font-size: 24px;
              font-weight: bold;
              color: #1976d2;
              margin: 0 0 10px 0;
            }
            
            .report-meta {
              font-size: 14px;
              color: #666;
              margin: 0;
            }
            
            @media print {
              body {
                margin: 0;
                font-size: 10px;
              }
              
              .report-title {
                font-size: 18px;
              }
              
              .report-meta {
                font-size: 12px;
              }
              
              table {
                font-size: 9px;
              }
              
              th, td {
                padding: 4px;
              }
              
              tr {
                page-break-inside: avoid;
              }
              
              thead {
                display: table-header-group;
              }
            }
          </style>
        </head>
        <body>
          <div class="report-header">
            <h1 class="report-title">${title}</h1>
            <p class="report-meta">Generated on ${new Date().toLocaleString()} | Total Records: ${data.length}</p>
          </div>
          
          ${tableHTML}
          
          <div style="margin-top: 30px; text-align: center; font-size: 10px; color: #666; border-top: 1px solid #ddd; padding-top: 10px;">
            <p>This report was generated automatically by the School Management System</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();

    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    };

    setTimeout(() => {
      if (printWindow && !printWindow.closed) {
        printWindow.print();
        printWindow.close();
      }
    }, 1000);

  } catch (error) {
    console.error('Error generating printable report:', error);
    throw new Error('Failed to generate printable report');
  }
};