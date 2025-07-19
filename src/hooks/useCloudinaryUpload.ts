// hooks/useCloudinaryUpload.ts
import { useState } from 'react';
import { CloudinarySignUploadApi, type ICloudinarySignUploadApi } from '../server-action/api/cloudionary-image-upload-api.ts';

export const useCloudinaryUpload = () => {
  const { mutateAsync: createCloudinarySignUpload } = CloudinarySignUploadApi.useCreate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const uploadImage = async (file: File): Promise<string> => {
    setLoading(true);
    setError(null);
    try {
const response = await createCloudinarySignUpload({ fileName: file.name } as ICloudinarySignUploadApi);     
 const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', response.data.apiKey);
      formData.append('timestamp', response.data.timestamp.toString());
      formData.append('signature', response.data.signature);
      formData.append('folder', response.data.folder || 'default');

      const cloudName = response.data.cloudName;
      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

      const uploadResponse = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });

      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed with status ${uploadResponse.status}: ${uploadData.error?.message || 'Unknown error'}`);
      }

      return uploadData.secure_url || uploadData.url;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { uploadImage, loading, error };
};