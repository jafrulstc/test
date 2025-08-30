/**
 * Photo upload utility for mock implementation
 * In production, this would handle actual file uploads to a storage service
 */

export interface PhotoUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Converts a File object to a Base64 Data URL.
 * @param file The file to convert.
 * @returns A promise that resolves with the Data URL.
 */
const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

/**
 * Mock photo upload function
 * Simulates file upload by converting the image to a Data URL for local preview.
 */
export const uploadPhoto = async (file: File): Promise<PhotoUploadResult> => {
  // Simulate upload delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Validate file
  const validation = validatePhotoFile(file);
  if (!validation.valid) {
    return {
      success: false,
      error: validation.error,
    };
  }

  try {
    const dataUrl = await fileToDataUrl(file);
    return {
      success: true,
      url: dataUrl,
    };
  } catch (error) {
    console.error("Error converting file to Data URL:", error);
    return {
      success: false,
      error: 'Could not process the image file.',
    };
  }
};

/**
 * Delete photo function (mock implementation)
 */
export const deletePhoto = async (url: string): Promise<boolean> => {
  // Simulate delete delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In mock implementation, always return success
  console.log(`Mock: Deleted photo at ${url}`);
  return true;
};

/**
 * Get photo preview URL
 * In production, this might generate signed URLs or thumbnails
 */
export const getPhotoPreviewUrl = (url: string): string => {
  // For mock implementation, return the URL as-is
  // In production, you might want to generate thumbnails or signed URLs
  return url;
};

/**
 * Validate photo file before upload
 */
export const validatePhotoFile = (file: File): { valid: boolean; error?: string } => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload JPEG, PNG, or GIF images only.',
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size too large. Please upload images smaller than 5MB.',
    };
  }

  return { valid: true };
};
