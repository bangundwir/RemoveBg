import axios from 'axios';

const API_URL = 'http://localhost:5000/api/remove-background';

export const removeBackground = async (file: File, onProgress: (progress: number) => void): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await axios.post(API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total!);
        onProgress(percentCompleted);
      },
    });

    return `data:image/png;base64,${response.data.image}`;
  } catch (error) {
    console.error('Error removing background:', error);
    throw error;
  }
};