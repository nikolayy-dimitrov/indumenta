import { db, storage } from "../config/firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";

import { fetchPredictionData } from "./dragoneyeUtils.ts";

export const handleUpload = async (
    images: File[],
    user: { uid: string } | null,
    dominantColors: string[],
    onUploadSuccess: () => void,
    onError: (error: Error) => void
) => {
    if (!images.length || !user) {
        alert("You must be logged in and select at least one image to upload.");
        return;
    }

    const apiUrl = import.meta.env.VITE_BACKEND_URL + "/api/predict";

    try {
        for (let i = 0; i < images.length; i++) {
            const file = images[i];
            const storageRef = ref(storage, `clothes/${user.uid}/${file.name}`);
            await uploadBytes(storageRef, file);
            const imageUrl = await getDownloadURL(storageRef);

            const predictionData = await fetchPredictionData(apiUrl, imageUrl, "dragoneye/fashion");
            const { category, vibe, season, color  } = predictionData[0];

            await addDoc(collection(db, "clothes"), {
                userId: user.uid,
                imageUrl,
                dominantColor: dominantColors[i],
                category,
                vibe,
                season,
                color,
                uploadedAt: new Date(),
            });
        }

        alert("Images uploaded successfully!");
        onUploadSuccess();
    } catch (error) {
        console.error("Error uploading images:", error);
        alert("Error uploading images. Please try again.");
        onError(error as Error);
    }
};
