import React, { useContext, useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useQueryClient } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

import { AuthContext } from "../../../context/AuthContext";
import { WardrobeContext } from "../../../context/WardrobeContext.tsx";

import { getDominantColorFromImage } from "../../../lib/utils/colorThiefUtils.ts";
import { handleUpload } from "../../../lib/utils/imageUploadUtils.ts";

import { IconPlayer } from "../../ui/media/IconPlayer.tsx";
import { db } from "../../../lib/config/firebaseConfig.ts";
import useMediaQuery from "../../../hooks/useMediaQuery.ts";

import PhotoAnimatedIcon from "../../../assets/photo-animated-lottie.json";
import CameraAnimatedIcon from "../../../assets/camera-animated-lottie.json";

export const Upload: React.FC<{ onNext: () => void }> = ({ onNext }) => {
    const [image, setImage] = useState<File | null>(null);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [dominantColor, setDominantColor] = useState<string[]>([]);
    const [clothesCount, setClothesCount] = useState<number>(0);
    const { user } = useContext(AuthContext);
    const { isLoading, setIsLoading, setLoadingMessage } = useContext(WardrobeContext);
    const queryClient = useQueryClient();

    const isAboveMediumScreens = useMediaQuery("(min-width: 1060px)");

    const setLoadingWithDelay = (value: boolean, delayMs: number) => {
        setTimeout(() => setIsLoading(value), delayMs);
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            try {
                setLoadingMessage("Analyzing image colors...");
                setIsLoading(true);
                await getDominantColorFromImage(file, setDominantColor);
            } catch (error) {
                console.error("Error processing image:", error);
                toast.error("Error analyzing image colors. Please try another image.", {
                    position: "top-center",
                    closeOnClick: true,
                    theme: "dark",
                });
            } finally {
                setLoadingMessage("");
                setIsLoading(false);
            }
        }
    };

    const handleUploadSuccess = async () => {
        setImage(null);
        setDominantColor([]);
        setIsLoading(false);
        setLoadingMessage("");
        if (user) {
            await queryClient.invalidateQueries({ queryKey: ['clothes', user.uid] });
        }
    };

    const handleUploadError = (error: Error) => {
        console.error(error);
        setIsLoading(false);
        setLoadingMessage("");
    };

    const uploadImage = async () => {
        if (!image) return;

        setLoadingMessage("Uploading image and analyzing with AI...");
        setIsLoading(true);

        try {
            await handleUpload([image], user, handleUploadSuccess, handleUploadError);
            await handleNext();
        } catch (error) {
            console.error("Error during upload:", error);
            setIsLoading(false);
            setLoadingMessage("");
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

    // eslint-disable-next-line react-hooks/purity
    const randomRotation = useMemo(() => Math.floor(Math.random() * 10) - 5, []);

    return (
        <section id="upload"
                 className="h-[80vh] relative flex items-center justify-center md:w-10/12 mx-auto font-Josefin">
            {!isLoading && user ? (
                <div className="flex flex-col items-center justify-center h-full">
                    {/* To Style Preferences Screen button */}
                    {clothesCount >= 3 ? (
                        <button
                            onClick={handleNext}
                            className="group flex items-center gap-3 text-sm md:text-base m-4 text-primary bg-secondary/80 border border-primary/30 hover:border-primary/60 hover:bg-secondary rounded-full py-2.5 px-6 transition-all duration-300 active:scale-95 shadow-sm"
                        >
                            <span>Continue to Style Preferences</span>
                            <FontAwesomeIcon icon={faArrowRight} className="transition-transform duration-300 group-hover:translate-x-1" />
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
                                            <div
                                                className="absolute inset-0 rounded-lg bg-white shadow-2xl"
                                                style={{
                                                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15), 0 5px 10px rgba(0, 0, 0, 0.12)',
                                                    transform: 'translateZ(-10px)'
                                                }}>
                                            </div>

                                            {/* Image container */}
                                            <div
                                                className="relative w-full h-full rounded-lg overflow-hidden border-2 border-gray-200">
                                                <img
                                                    src={URL.createObjectURL(image)}
                                                    alt="Uploaded clothing item"
                                                    className="w-full h-full object-contain"
                                                />

                                                {/* Slight overlay/gradient for card effect */}
                                                <div
                                                    className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white opacity-20 rounded-lg pointer-events-none"></div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        className="transition-all tranform duration-[400ms] active:opacity-60 hover:scale-95">
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