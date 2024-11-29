import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

import { getDominantColorFromImage } from "../utils/colorThiefUtils.ts";
import { handleUpload } from "../utils/imageUploadUtils.ts";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShirt } from "@fortawesome/free-solid-svg-icons/faShirt";

import Wardrobe from "../assets/wardrobe-empty-comic.jpeg";

export const Upload: React.FC<{ hasClothes: boolean; onNext: () => void }> = ({
    hasClothes,
    onNext
                                                                              }) => {
    const [images, setImages] = useState<File[]>([]);
    const [dominantColors, setDominantColors] = useState<string[]>([]);
    const { user } = useContext(AuthContext);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setImages(prevImages => [...prevImages, ...newFiles]);

            for (const file of newFiles) {
                try {
                    await getDominantColorFromImage(file, setDominantColors);
                } catch (error) {
                    console.error("Error processing image:", error);
                }
            }
        }
    };

    const handleUploadSuccess = () => {
        setImages([]);
        setDominantColors([]);
        onNext();
    };

    const handleUploadError = (error: Error) => {
        console.error(error);
    };

    const uploadImages = () => {
        handleUpload(images, user, dominantColors, handleUploadSuccess, handleUploadError);
    };

    return (
        <section id="upload" className="relative flex items-center justify-center md:w-10/12 mx-auto font-Josefin">
            <img src={Wardrobe} alt="wardrobe" className="w-full h-auto rounded-xl" />

            <div className="absolute inset-0 flex flex-col items-center justify-center md:mb-2">
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
                            {images.length > 0 ? (
                                <div className={`grid ${images.length === 1 ? 'grid-cols-1' : 'grid-cols-2 gap-4'}`}>
                                    {images.slice(-4).map((image, index) => (
                                        <div key={images.length > 4 ? index + (images.length - 4) : index} className="relative">
                                            <img
                                                src={URL.createObjectURL(image)}
                                                alt={`Uploaded file ${index + 1}`}
                                                className="lg:w-40 lg:h-40 max-lg:w-24 max-lg:h-24 object-contain p-2 rounded-lg border-2 border-gray-400"
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <FontAwesomeIcon icon={faShirt} className="text-gray-400" size="4x" />
                            )}
                        </label>

                        <div className="mt-2 text-sm text-gray-600">
                            {images.length} file(s) selected
                        </div>

                        <button
                            onClick={uploadImages}
                            disabled={!images.length}
                            className="mt-4 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded disabled:opacity-50"
                        >
                            Upload
                        </button>
                    </>

                {hasClothes && (
                    <button
                        onClick={onNext}
                        className="mt-6 bg-primary/90 hover:bg-primary/95 text-white font-bold py-3 px-8 rounded"
                    >
                        Select Style Preferences
                    </button>
                )}
            </div>
        </section>
    );
};