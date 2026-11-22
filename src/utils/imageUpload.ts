/**
 * Converts a selected image File into a web-optimized, high-efficiency data URL
 * suited for instant Firestore cloud synchronization and cross-device display.
 */
export async function fileToOptimizedDataUrl(
  file: File,
  maxWidth = 900,
  maxHeight = 1200,
  initialQuality = 0.80
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image element.'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Maintain aspect ratio while bounding within maxWidth/maxHeight
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Attempt webp first, fallback to jpeg
        let quality = initialQuality;
        let result = '';

        try {
          result = canvas.toDataURL('image/webp', quality);
          if (!result.startsWith('data:image/webp')) {
            result = canvas.toDataURL('image/jpeg', quality);
          }
        } catch {
          result = canvas.toDataURL('image/jpeg', quality);
        }

        // Check payload size. If greater than 300KB (approx 400,000 chars), scale down quality to stay within Firestore optimal bounds
        while (result.length > 400000 && quality > 0.4) {
          quality -= 0.15;
          result = canvas.toDataURL('image/jpeg', quality);
        }

        resolve(result);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
