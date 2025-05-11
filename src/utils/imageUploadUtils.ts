import { toast } from "react-toastify";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";

import { db, storage } from "../config/firebaseConfig";
import { analyzeImageWithRekognition } from "./rekognitionUtils";

// Define clothing item interface
export interface ClothingItem {
    userId: string;
    imageUrl: string;
    dominantColor: string;
    category: string;
    subCategory: string | null;
    vibe: string;
    season: string;
    color: string;
    labels: string[];
    confidence: {
        category: number;
        subCategory: number | null;
        vibe: number;
        season: number;
        color: number;
    };
    uploadedAt: Date;
}

/**
 * Process and upload clothing images with Rekognition analysis
 * @param images - Array of image files to upload
 * @param user - User information with UID
 * @param dominantColors - Array of dominant colors extracted from images
 * @param onUploadSuccess - Callback function on successful upload
 * @param onError - Callback function on error
 */
export const handleUpload = async (
    images: File[],
    user: { uid: string } | null,
    dominantColors: string[],
    onUploadSuccess: () => void,
    onError: (error: Error) => void
): Promise<void> => {
    // Validate inputs
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

    // Configure API URL from environment variables
    const rekognitionApiUrl = import.meta.env.VITE_BACKEND_URL + "/api/images/analyze";

    try {
        const uploadPromises = images.map(async (file, index) => {
            // Generate unique filename
            const timestamp = Date.now();
            const randomHex = Math.random().toString(16).substring(2, 10);
            const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
            const filename = `${safeName}_${timestamp}_${randomHex}`;

            // Create reference to storage location
            const storageRef = ref(storage, `clothes/${user.uid}/${filename}`);

            // Upload file to Firebase Storage
            await uploadBytes(storageRef, file);

            // Get download URL for the uploaded file
            const imageUrl = await getDownloadURL(storageRef);

            // Analyze image with Rekognition API
            const rekognitionData = await analyzeImageWithRekognition(rekognitionApiUrl, file);

            // Extract color from rekognition or use dominant color
            const color = rekognitionData.color !== 'Unknown'
                ? rekognitionData.color
                : dominantColors[index] || 'Unknown';

            // Create clothing item object
            const clothingItem: ClothingItem = {
                userId: user.uid,
                imageUrl,
                dominantColor: dominantColors[index] || 'Unknown',
                category: rekognitionData.category,
                subCategory: rekognitionData.subCategory,
                vibe: rekognitionData.vibe,
                season: rekognitionData.season,
                color: color,
                labels: rekognitionData.allLabels,
                confidence: rekognitionData.confidence,
                uploadedAt: new Date(),
            };

            // Add document to Firestore collection
            return addDoc(collection(db, "clothes"), clothingItem);
        });

        // Wait for all uploads to complete
        await Promise.all(uploadPromises);

        // Show success message
        toast.success(`${images.length > 1 ? `${images.length} items` : "Item"} uploaded successfully!`, {
            position: "top-center",
            closeOnClick: true,
            theme: "dark",
        });

        // Call success callback
        onUploadSuccess();
    } catch (error) {
        console.error("Error uploading images:", error);

        // Show error message
        toast.error("Error uploading item. Please try again.", {
            position: "top-center",
            closeOnClick: true,
            theme: "dark",
        });

        // Call error callback
        onError(error as Error);
    }
};