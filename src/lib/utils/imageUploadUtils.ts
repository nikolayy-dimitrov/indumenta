import { toast } from "react-toastify";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { collection, doc, setDoc, Timestamp } from "firebase/firestore";

import { auth, db, storage } from "../config/firebaseConfig";
import { resizeImage } from "./imageOptimization";

/**
 * Process and upload clothing images with multiple sizes
 * @param images - Array of image files to upload
 * @param user - User information with UID
 * @param onUploadSuccess - Callback function on successful upload
 * @param onError - Callback function on error
 */
export const handleUpload = async (
    images: File[],
    user: { uid: string } | null,
    onUploadSuccess: () => void,
    onError: (error: Error) => void
) => {
    if (!images.length) {
        toast.error("Please select at least one image to upload.", {
            position: "top-center",
            closeOnClick: true,
            theme: "dark",
        });
        return;
    }

    if (!user) {
        toast.error("You must be logged in to upload images.", {
            position: "top-center",
            closeOnClick: true,
            theme: "dark",
        });
        return;
    }

    try {
        const uploadPromises = images.map(async (file) => {
            const docRef = doc(collection(db, 'clothes'));
            const docId = docRef.id;

            await setDoc(docRef, {
                userId: user.uid,
                uploadedAt: Timestamp.now(),
                status: 'pending'
            });

            const imageUrls = await uploadMultipleSizes(file, user.uid, docId);

            // Save all image URLs to Firestore
            await setDoc(docRef, {
                imageUrl: imageUrls.medium,        // Default image
                thumbnailUrl: imageUrls.thumbnail, // For grid view
                mediumUrl: imageUrls.medium,       // For detail view
                largeUrl: imageUrls.large,         // For modal/fullscreen
                originalUrl: imageUrls.original    // Original
            }, { merge: true });

            const storageRefPath = `clothes/${user.uid}/${docId}/medium`;
            await analyzeImage(storageRefPath, docId);

            return docId;
        });

        await Promise.all(uploadPromises);

        toast.success(`${images.length > 1 ? `${images.length} items` : "Item"} uploaded successfully!`, {
            position: "top-center",
            closeOnClick: true,
            theme: "dark",
        });

        onUploadSuccess();
    } catch (error) {
        console.error("Error uploading images:", error);

        toast.error("Error uploading item. Please try again.", {
            position: "top-center",
            closeOnClick: true,
            theme: "dark",
        });

        onError(error as Error);
    }
};

/**
 * Upload multiple sizes of an image to Firebase Storage
 * Creates thumbnail, medium, large, and original
 */
const uploadMultipleSizes = async (
    file: File,
    userId: string,
    docId: string
): Promise<{
    thumbnail: string;
    medium: string;
    large: string;
    original?: string;
}> => {
    try {
        const [thumbnailBlob, mediumBlob, largeBlob] = await Promise.all([
            resizeImage(file, 400, 400, 0.75),   // Thumbnail: 400x400
            resizeImage(file, 800, 800, 0.8),    // Medium: 800x800
            resizeImage(file, 1600, 1600, 0.85)  // Large: 1600x1600
        ]);

        console.log('Image optimization:', {
            original: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
            thumbnail: `${(thumbnailBlob.size / 1024).toFixed(2)} KB`,
            medium: `${(mediumBlob.size / 1024).toFixed(2)} KB`,
            large: `${(largeBlob.size / 1024).toFixed(2)} KB`,
            savings: `${(((file.size - largeBlob.size) / file.size) * 100).toFixed(1)}%`
        });

        const [thumbnailUrl, mediumUrl, largeUrl] = await Promise.all([
            uploadBlob(thumbnailBlob, `clothes/${userId}/${docId}/thumbnail`, 'image/jpeg'),
            uploadBlob(mediumBlob, `clothes/${userId}/${docId}/medium`, 'image/jpeg'),
            uploadBlob(largeBlob, `clothes/${userId}/${docId}/large`, 'image/jpeg')
        ]);

        const originalUrl = await uploadBlob(file, `clothes/${userId}/${docId}/original`, file.type);

        return {
            thumbnail: thumbnailUrl,
            medium: mediumUrl,
            large: largeUrl,
            original: originalUrl
        };
    } catch (error) {
        console.error('Error uploading multiple sizes:', error);
        throw error;
    }
};

/**
 * Upload a blob to Firebase Storage
 */
const uploadBlob = async (
    blob: Blob | File,
    path: string,
    contentType: string
): Promise<string> => {
    const storageRef = ref(storage, path);

    await uploadBytes(storageRef, blob, {
        contentType,
        cacheControl: 'public, max-age=31536000', // Cache for 1 year
    });

    return getDownloadURL(storageRef);
};

const analyzeImage = async (imagePath: string, docId: string) => {
    const apiUrl = import.meta.env.VITE_BACKEND_URL + '/api/images/analyze';
    const user = auth.currentUser;
    const token = await user?.getIdToken();

    try {
        await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ imagePath, docId }),
        });
    } catch (error) {
        console.error(`Error analyzing image: ${error}`);
    }
};