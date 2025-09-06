import { toast } from "react-toastify";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { collection, doc, setDoc, Timestamp } from "firebase/firestore";

import { auth, db, storage } from "../config/firebaseConfig";

/**
 * Process and upload clothing images with Rekognition analysis
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

            const storageRefPath = `clothes/${user.uid}/${docId}`;
            const storageRef = ref(storage, storageRefPath);

            await uploadBytes(storageRef, file);

            const imageUrl = await getDownloadURL(storageRef);

            await setDoc(docRef,
                {
                    imageUrl
                }, { merge: true })

            await analyzeImage(storageRefPath, docId);

            return docId;
        });

        await Promise.all(uploadPromises);
        // analyzeUploadedImages(imagePaths);

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