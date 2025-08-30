import React, { useCallback, useState, memo } from 'react';
import {
  Box,
  Button,
  Typography,
  LinearProgress,
  IconButton,
  Card,
  CardContent,
  Alert,
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  InsertDriveFile,
  Image,
} from '@mui/icons-material';

interface FileUploadProps {
  value: string[];
  onChange: (files: string[]) => void;
  accept?: string;
  maxFiles?: number;
  maxSize?: number; // in bytes
  label?: string;
  error?: boolean;
  helperText?: string;
}

/**
 * File upload component with drag & drop support
 */
const FileUpload = memo(({
  value = [],
  onChange,
  accept = '*/*',
  maxFiles = 1,
  maxSize = 5 * 1024 * 1024, // 5MB default
  label = 'Upload Files',
  error = false,
  helperText,
}: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  /**
   * Validate file
   */
  const validateFile = useCallback((file: File): { valid: boolean; error?: string } => {
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`,
      };
    }

    if (accept !== '*/*') {
      const acceptedTypes = accept.split(',').map(type => type.trim());
      const fileType = file.type;
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      const isValidType = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return type === fileExtension;
        }
        return fileType.match(type.replace('*', '.*'));
      });

      if (!isValidType) {
        return {
          valid: false,
          error: `File type not supported. Accepted types: ${accept}`,
        };
      }
    }

    return { valid: true };
  }, [accept, maxSize]);

  /**
   * Handle file upload
   */
  const handleFileUpload = useCallback(async (files: FileList) => {
    const fileArray = Array.from(files);
    
    if (value.length + fileArray.length > maxFiles) {
      return;
    }

    setUploading(true);
    const uploadedFiles: string[] = [];

    try {
      for (const file of fileArray) {
        const validation = validateFile(file);
        if (!validation.valid) {
          continue;
        }

        // Simulate file upload - in real implementation, this would upload to a server
        const reader = new FileReader();
        const fileUrl = await new Promise<string>((resolve) => {
          reader.onload = () => {
            // In a real implementation, you would upload to a server and get back a URL
            // For now, we'll use the data URL as a mock
            resolve(reader.result as string);
          };
          reader.readAsDataURL(file);
        });

        uploadedFiles.push(fileUrl);
      }

      onChange([...value, ...uploadedFiles]);
    } finally {
      setUploading(false);
    }
  }, [value, maxFiles, validateFile, onChange]);

  /**
   * Handle file input change
   */
  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      handleFileUpload(files);
    }
    // Reset input value to allow uploading the same file again
    event.target.value = '';
  }, [handleFileUpload]);

  /**
   * Handle drag events
   */
  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    
    const files = event.dataTransfer.files;
    if (files) {
      handleFileUpload(files);
    }
  }, [handleFileUpload]);

  /**
   * Remove file
   */
  const removeFile = useCallback((index: number) => {
    const newFiles = value.filter((_, i) => i !== index);
    onChange(newFiles);
  }, [value, onChange]);

  /**
   * Get file icon
   */
  const getFileIcon = (url: string) => {
    if (url.startsWith('data:image/') || /\.(jpg|jpeg|png|gif|webp)$/i.test(url)) {
      return <Image />;
    }
    return <InsertDriveFile />;
  };

  /**
   * Get file name from URL
   */
  const getFileName = (url: string) => {
    if (url.startsWith('data:')) {
      return 'Uploaded file';
    }
    return url.split('/').pop() || 'Unknown file';
  };

  const canUploadMore = value.length < maxFiles;

  return (
    <Box>
      {/* Upload Area */}
      {canUploadMore && (
        <Box
          sx={{
            border: 2,
            borderStyle: 'dashed',
            borderColor: dragOver ? 'primary.main' : error ? 'error.main' : 'grey.300',
            borderRadius: 2,
            p: 3,
            textAlign: 'center',
            backgroundColor: dragOver ? 'action.hover' : 'transparent',
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              borderColor: 'primary.main',
              backgroundColor: 'action.hover',
            },
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            {label}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Drag & drop files here or click to browse
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Max {maxFiles} file(s), up to {Math.round(maxSize / (1024 * 1024))}MB each
          </Typography>
          
          <input
            id="file-input"
            type="file"
            accept={accept}
            multiple={maxFiles > 1}
            onChange={handleInputChange}
            style={{ display: 'none' }}
          />
        </Box>
      )}

      {/* Upload Progress */}
      {uploading && (
        <Box sx={{ mt: 2 }}>
          <LinearProgress />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            Uploading files...
          </Typography>
        </Box>
      )}

      {/* Uploaded Files */}
      {value.length > 0 && (
        <Box sx={{ mt: 2 }}>
          {value.map((file, index) => (
            <Card key={index} variant="outlined" sx={{ mb: 1 }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getFileIcon(file)}
                    <Typography variant="body2" noWrap>
                      {getFileName(file)}
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => removeFile(index)}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Helper Text */}
      {helperText && (
        <Typography
          variant="caption"
          color={error ? 'error' : 'text.secondary'}
          sx={{ mt: 1, display: 'block' }}
        >
          {helperText}
        </Typography>
      )}

      {/* Max Files Reached */}
      {!canUploadMore && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Maximum number of files ({maxFiles}) reached
        </Alert>
      )}
    </Box>
  );
});

FileUpload.displayName = 'FileUpload';

export { FileUpload };