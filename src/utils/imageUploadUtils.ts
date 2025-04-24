import * as crypto from "crypto"
import { toast } from "react-toastify";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";

import { db, storage } from "../config/firebaseConfig";
import { analyzeImageWithRekognition } from "./rekognitionUtils.ts";

export const handleUpload = async (
    images: File[],
    user: { uid: string } | null,
    dominantColors: string[],
    onUploadSuccess: () => void,
    onError: (error: Error) => void
) => {
    if (!images.length || !user) {
        toast.error("You must be logged in and select at least one image to upload.", {
            position: "top-center",
            closeOnClick: true,
            theme: "dark",
        });
        return;
    }

    const rekognitionApiUrl = import.meta.env.VITE_BACKEND_URL + "/api/images/analyze";

    try {
        for (let i = 0; i < images.length; i++) {
            const file = images[i];
            const randomId = crypto.randomBytes(4).toString('hex');
            const storageRef = ref(storage, `clothes/${user.uid}/${file.name}_${randomId}`);
            await uploadBytes(storageRef, file);
            const imageUrl = await getDownloadURL(storageRef);

            // Request from aws
            const [rekognitionData] = await Promise.all([
                analyzeImageWithRekognition(rekognitionApiUrl, file)
            ]);

            const rekognitionResult = {
                category: rekognitionData.category,
                subCategory: rekognitionData.subCategory,
                vibe: rekognitionData.vibe,
                season: rekognitionData.season,
                allLabels: rekognitionData.allLabels || []
            };

            await addDoc(collection(db, "clothes"), {
                userId: user.uid,
                imageUrl,
                dominantColor: dominantColors[i],
                category: rekognitionResult.category,
                subCategory: rekognitionResult.subCategory,
                vibe: rekognitionResult.vibe,
                season: rekognitionResult.season,
                labels: rekognitionResult.allLabels,
                uploadedAt: new Date(),
            });
        }

        toast.success("Item uploaded successfully!", {
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