import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { collection, getDocs, query, where } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import { AuthContext } from "../context/AuthContext";
import { WardrobeContext } from "../context/WardrobeContext.tsx";

import { getDominantColorFromImage } from "../utils/colorThiefUtils.ts";
import { handleUpload } from "../utils/imageUploadUtils.ts";

import { IconPlayer } from "../components/UI/IconPlayer.tsx";
import { db } from "../config/firebaseConfig.ts";
import useMediaQuery from "../utils/useMediaQuery.ts";

import PhotoAnimatedIcon from "../assets/photo-animated-lottie.json";
import CameraAnimatedIcon from "../assets/camera-animated-lottie.json";

export const Upload: React.FC<{ onNext: () => void }> = ({ onNext }) => {
    const [image, setImage] = useState<File | null>(null);
    const [dominantColor, setDominantColor] = useState<string[]>([]);
    const [clothesCount, setClothesCount] = useState<number>(0);
    const [uploadProgress, setUploadProgress] = useState<string>("");

    const { user } = useContext(AuthContext);
    const { isLoading, setIsLoading } = useContext(WardrobeContext);

    const isAboveMediumScreens = useMediaQuery("(min-width: 1060px)");

    const setLoadingWithDelay = (value: boolean, delayMs: number) => {
        setTimeout(() => setIsLoading(value), delayMs);
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            try {
                setUploadProgress("Analyzing image colors...");
                await getDominantColorFromImage(file, setDominantColor);
                setUploadProgress("");
            } catch (error) {
                console.error("Error processing image:", error);
                toast.error("Error analyzing image colors. Please try another image.", {
                    position: "top-center",
                    closeOnClick: true,
                    theme: "dark",
                });
                setUploadProgress("");
            }
        }
    };

    const handleUploadSuccess = async () => {
        setImage(null);
        setDominantColor([]);
        setIsLoading(false);
        setUploadProgress("");
    };

    const handleUploadError = (error: Error) => {
        console.error(error);
        setIsLoading(false);
        setUploadProgress("");
    };

    const uploadImage = async () => {
        if (!image || !dominantColor.length) return;

        setIsLoading(true);
        setUploadProgress("Uploading image and analyzing with AI...");

        const firstDominantColor = dominantColor[0] || null;

        try {
            await handleUpload([image], user, [firstDominantColor!], handleUploadSuccess, handleUploadError);
            await handleNext();
        } catch (error) {
            console.error("Error during upload:", error);
            setIsLoading(false);
            setUploadProgress("");
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

    const randomRotation = Math.floor(Math.random() * 10) - 5;

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
                            accept="image/*"
                        />

                        <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={handleImageChange}
                            id="camera-upload"
                            className="hidden"
                        />
                        <div className="flex items-center justify-center gap-2">
                            <label htmlFor="file-upload" className="cursor-pointer">
                                {image ? (
                                    <div
                                        className="perspective"
                                        style={{ perspective: '1000px' }}
                                    >
                                        <div
                                            className="relative transform transition-all duration-500 ease-in-out hover:scale-105"
                                            style={{
                                                transform: `rotate(${randomRotation}deg)`,
                                                width: isAboveMediumScreens ? '14rem' : '10rem',
                                                height: isAboveMediumScreens ? '14rem' : '10rem'
                                            }}
                                        >
                                            {/* Card with shadow effect */}
                                            <div className="absolute inset-0 rounded-lg bg-white shadow-2xl"
                                                 style={{
                                                     boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15), 0 5px 10px rgba(0, 0, 0, 0.12)',
                                                     transform: 'translateZ(-10px)'
                                                 }}>
                                            </div>

                                            {/* Image container */}
                                            <div className="relative w-full h-full rounded-lg overflow-hidden border-2 border-gray-200">
                                                <img
                                                    src={URL.createObjectURL(image)}
                                                    alt="Uploaded clothing item"
                                                    className="w-full h-full object-contain"
                                                />

                                                {/* Slight overlay/gradient for card effect */}
                                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white opacity-20 rounded-lg pointer-events-none"></div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="transition-all tranform duration-[400ms] active:opacity-60 hover:scale-95">
                                        <IconPlayer
                                            iconSrc={PhotoAnimatedIcon}
                                            iconSize={isAboveMediumScreens ? 120 : 80}
                                        />
                                    </div>
                                )}
                            </label>

                            <label htmlFor="camera-upload" className="cursor-pointer">
                                {!isAboveMediumScreens && !image && (
                                    <div>
                                        <IconPlayer
                                            iconSrc={CameraAnimatedIcon}
                                            iconSize={isAboveMediumScreens ? 120 : 80}
                                        />
                                    </div>
                                )}
                            </label>
                        </div>

                        {uploadProgress && (
                            <div className="mt-2 text-primary flex items-center">
                                <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                                <span>{uploadProgress}</span>
                            </div>
                        )}

                        <button
                            onClick={uploadImage}
                            disabled={!image || isLoading}
                            className="uppercase mt-4
                                       text-primary disabled:opacity-0
                                       font-light tracking-wide
                                       px-4 py-2
                                       transition duration-300 active:scale-90"
                        >
                            {isLoading ? "Uploading..." : "Continue"}
                        </button>
                    </>
                </div>
            ) : (
                <div className="flex justify-center items-center h-screen w-9/12">
                    <Link to="/authentication" className="text-2xl text-center">
                        Login to begin uploading clothes to your wardrobe.
                    </Link>
                </div>
            )}
        </section>
    );
};