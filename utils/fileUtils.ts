
import { Part } from "@google/genai";

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        // The result includes the data URL prefix, so we need to remove it.
        // e.g., "data:image/jpeg;base64,/9j/4AAQSkZ..." -> "/9j/4AAQSkZ..."
        const base64Data = reader.result.split(',')[1];
        resolve(base64Data);
      } else {
        reject(new Error('Failed to convert blob to base64 string.'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function fileToGenerativePart(file: File): Promise<Part> {
  const base64Data = await blobToBase64(file);
  return {
    inlineData: {
      mimeType: file.type,
      data: base64Data,
    },
  };
}
