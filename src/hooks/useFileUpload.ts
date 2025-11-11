import { useState, useCallback } from 'react';
import { uploadAPI } from '@/lib/api';

interface UploadProgress {
  progress: number;
  isUploading: boolean;
  error: string | null;
}

export function useFileUpload() {
  const [uploadState, setUploadState] = useState<UploadProgress>({
    progress: 0,
    isUploading: false,
    error: null,
  });

  const uploadFile = useCallback(async (file: File, folder: string = 'monuments') => {
    setUploadState({ progress: 0, isUploading: true, error: null });

    try {
      const result = await uploadAPI.uploadFile(file, folder);
      setUploadState({ progress: 100, isUploading: false, error: null });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload file';
      setUploadState({ progress: 0, isUploading: false, error: errorMessage });
      throw error;
    }
  }, []);

  const resetUpload = useCallback(() => {
    setUploadState({ progress: 0, isUploading: false, error: null });
  }, []);

  return {
    ...uploadState,
    uploadFile,
    resetUpload,
  };
}
