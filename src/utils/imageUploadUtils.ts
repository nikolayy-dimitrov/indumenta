import { db, storage } from "../config/firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";

import { fetchPredictionData } from "./dragoneyeUtils.ts";

import { toast } from "react-toastify";

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
