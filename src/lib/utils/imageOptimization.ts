/**
 * Resize and compress image before uploading to Firebase
 */
export const resizeImage = (
    file: File,
    maxWidth: number = 800,
    maxHeight: number = 800,
    quality: number = 0.8
): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();

            img.onload = () => {
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = (width * maxHeight) / height;
                        height = maxHeight;
                    }
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Could not get canvas context'));
                    return;
                }

                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';

                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            resolve(blob);
                        } else {
                            reject(new Error('Canvas to Blob conversion failed'));
                        }
                    },
                    'image/jpeg',
                    quality
                );
            };

            img.onerror = () => reject(new Error('Image load error'));
            img.src = e.target?.result as string;
        };

        reader.onerror = () => reject(new Error('File read error'));
        reader.readAsDataURL(file);
    });
};

/**
 * Create multiple sizes for responsive images
 */
export const createImageVariants = async (
    file: File
): Promise<{ thumbnail: Blob; medium: Blob; large: Blob }> => {
    const [thumbnail, medium, large] = await Promise.all([
        resizeImage(file, 200, 200, 0.7),  // Thumbnail
        resizeImage(file, 800, 800, 0.8),  // Medium
        resizeImage(file, 1200, 1200, 0.85) // Large
    ]);

    return { thumbnail, medium, large };
};

/**
 * Get optimized Firebase Storage URL with size parameter
 */
export const getOptimizedImageUrl = (
    baseUrl: string,
    size: 'thumb' | 'medium' | 'large' = 'medium'
): string => {
    const sizeMap = {
        thumb: '200x200',
        medium: '800x800',
        large: '1200x1200'
    };

    // Check if already has size in URL
    if (baseUrl.includes('_200x200') || baseUrl.includes('_800x800')) {
        return baseUrl;
    }

    // Insert size before file extension
    const lastDot = baseUrl.lastIndexOf('.');
    const extension = baseUrl.substring(lastDot);
    const pathWithoutExt = baseUrl.substring(0, lastDot);

    return `${pathWithoutExt}_${sizeMap[size]}${extension}`;
};