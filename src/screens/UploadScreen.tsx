import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { WardrobeContext } from "../context/WardrobeContext.tsx";

import { getDominantColorFromImage } from "../utils/colorThiefUtils.ts";
import { handleUpload } from "../utils/imageUploadUtils.ts";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShirt } from "@fortawesome/free-solid-svg-icons/faShirt";

import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebaseConfig.ts";

export const Upload: React.FC<{ hasClothes: boolean; onNext: () => void }> = ({
    hasClothes,
    onNext
                                                                              }) => {
    const [image, setImage] = useState<File | null>(null);
    const [dominantColor, setDominantColor] = useState<string[]>([]);

    const { user } = useContext(AuthContext);
    const { isLoading, setIsLoading } = useContext(WardrobeContext);

    const setLoadingWithDelay = (value: boolean, delayMs: number) => {
        setTimeout(() => setIsLoading(value), delayMs);
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            try {
                await getDominantColorFromImage(file, setDominantColor);
            } catch (error) {
                console.error("Error processing image:", error);
            }
        }
    };

    const handleUploadSuccess = async () => {
        setImage(null);
        setDominantColor([]);

        try {
            if (!user) return;

            const clothesRef = collection(db, "clothes");
            const q = query(clothesRef, where("userId", "==", user.uid));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.size < 3) {
                window.location.reload(); // Reload if less than 3 items
            } else {
                onNext(); // Navigate to the next step if 3 or more items
            }
        } catch (error) {
            console.error("Error checking item count:", error);
        }
    };

    const handleUploadError = (error: Error) => {
        console.error(error);
        setIsLoading(false);
    };

    const uploadImage = async () => {
        if (!image || !dominantColor.length) return;

        setIsLoading(true);

        const firstDominantColor = dominantColor[0] || null; // Extract the first dominant color

        try {
            await handleUpload([image], user, [firstDominantColor!], handleUploadSuccess, handleUploadError);
        } catch (error) {
            console.error("Error during upload:", error);
            setIsLoading(false);
        } finally {
            setLoadingWithDelay(false, 3000);
        }
    };

    const checkClothesCount = async (): Promise<number> => {
        if (!user) return 0;

        const clothesRef = collection(db, "clothes");
        const q = query(clothesRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        return querySnapshot.size;
    };

    const handleNext = async () => {
        const clothesCount = await checkClothesCount();
        if (clothesCount < 3) {
            // window.location.reload(); // Reload if less than 3 items
        } else {
            onNext(); // Navigate to the next step if 3 or more items
        }
    };

    return (
        <section id="upload" className="relative flex items-center justify-center md:w-10/12 mx-auto font-Josefin">
            <div className="flex flex-col items-center justify-center h-screen">
                    <>
                        <input
                            type="file"
                            onChange={handleImageChange}
                            className="hidden"
                            id="file-upload"
                            multiple
                            accept="image/*"
                        />

                        <label htmlFor="file-upload" className="cursor-pointer">
                            {image ? (
                                <div>
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt={`Uploaded file image`}
                                        className="lg:w-40 lg:h-40 max-lg:w-24 max-lg:h-24 object-contain p-2 rounded-lg border-2 border-gray-400"
                                    />
                                </div>

                            ) : (
                                <FontAwesomeIcon icon={faShirt} className="text-priamry" size="4x" />
                            )}
                        </label>

                        <button
                            onClick={uploadImage}
                            disabled={!image || isLoading}
                            className="mt-4 bg-primary hover:bg-primary/95 text-secondary px-4 py-2 rounded disabled:opacity-50"
                        >
                            {isLoading ? "Uploading..." : "Upload"}
                        </button>
                    </>

                {hasClothes && (
                    <button
                        onClick={handleNext}
                        className="mt-6 bg-primary/90 hover:bg-primary/95 text-secondary font-semibold py-3 px-8 rounded"
                    >
                        Select Style Preferences
                    </button>
                )}
            </div>
        </section>
    );
};