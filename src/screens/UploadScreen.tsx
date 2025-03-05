import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";
import { WardrobeContext } from "../context/WardrobeContext.tsx";

import { getDominantColorFromImage } from "../utils/colorThiefUtils.ts";
import { handleUpload } from "../utils/imageUploadUtils.ts";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShirt } from "@fortawesome/free-solid-svg-icons/faShirt";

import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebaseConfig.ts";

export const Upload: React.FC<{ onNext: () => void }> = ({ onNext }) => {
    const [image, setImage] = useState<File | null>(null);
    const [dominantColor, setDominantColor] = useState<string[]>([]);
    const [clothesCount, setClothesCount] = useState<number>(0);

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
        setIsLoading(false);
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
            await handleNext();
        } catch (error) {
            console.error("Error during upload:", error);
            setIsLoading(false);
        } finally {
            setLoadingWithDelay(false, 3000);
        }
    };

    useEffect(() => {
        const checkClothesCount = async (): Promise<number> => {
            if (!user) return 0;

            const clothesRef = collection(db, "clothes");
            const q = query(clothesRef, where("userId", "==", user.uid));
            const querySnapshot = await getDocs(q);
            setClothesCount(querySnapshot.size);
            return querySnapshot.size;
        };
        checkClothesCount();
    }, [user, isLoading]);

    const handleNext = async () => {
        if (clothesCount >= 3) {
            onNext();
        }
    };

    return (
        <section id="upload" className="h-[80vh] relative flex items-center justify-center md:w-10/12 mx-auto font-Josefin">
            {!isLoading && user ? (
                <div className="flex flex-col items-center justify-center h-full">
                    {/* To Style Preferences Screen button */}
                    {clothesCount >= 3 ? (
                        <button
                            onClick={handleNext}
                            className="lowercase text-lg m-6 text-primary font-light py-3 px-8 transition duration-300 active:scale-90"
                        >
                            Select Style Preferences
                        </button>
                    ) : (
                        <div className="mt-4 w-10/12 text-center">
                            <span>
                                Please upload at least 3 pieces of clothing to proceed.
                            </span>
                        </div>
                    )}

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
                                        className="lg:w-56 lg:h-56 max-lg:w-40 max-lg:h-40 object-contain p-2 rounded-lg border-2 border-gray-400"
                                    />
                                </div>

                            ) : (
                                <div className="border border-primary p-20 rounded-md
                                                    transition duration-400 active:border-opacity-50">
                                    <FontAwesomeIcon icon={faShirt} className="text-priamry" size="4x"/>
                                </div>
                            )}
                        </label>
                        <button
                            onClick={uploadImage}
                            disabled={!image || isLoading}
                            className="uppercase mt-4
                                       bg-clip-text bg-gradient-to-t from-secondary from-5% to-primary to-100% text-transparent
                                       font-light tracking-wide
                                       px-4 py-2 disabled:opacity-20
                                       transition duration-300 active:scale-90"
                        >
                            {isLoading ? "Uploading..." : "Continue"}
                        </button>
                    </>
                </div>
            ) : (
                <div className="flex justify-center items-center h-screen w-9/12">
                    <Link to="/sign-in" className="text-2xl text-center">
                        Login to begin uploading clothes to your wardrobe.
                    </Link>
                </div>
            )}
        </section>
    );
};