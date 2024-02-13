import { fetchClient } from '../client';

export const uploader = {
  uploadByFile(file: File): Promise<ImageUploadResponse> {
    const formData = new FormData();
    formData.append('image', file);
    return fetch(`${fetchClient.baseUrl}/api/link/upload`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    }).then((res) => res.json());
  },
};

type ImageUploadResponse = {
  success: number;
  file: FileType;
};

type FileType = {
  url: string;
};
