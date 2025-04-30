import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { ClothingItem } from "../types/wardrobe.ts";
import { ColorPicker } from "./ColorPicker.tsx";

interface ClothesModalProps {
    selectedImage: ClothingItem | null;
    onClose: () => void;
}

export const ClothesModal = ({ selectedImage, onClose }: ClothesModalProps) => {
    const [isColorPickerOpen, setIsColorPickerOpen] = useState<boolean>(false);

    if (!selectedImage) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center"
            onClick={onClose}
        >
            <button
                className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
                onClick={onClose}
            >
                <FontAwesomeIcon icon={faX} size="1x" />
            </button>
            <div
                className="relative max-w-[90vw] max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <img
                    src={selectedImage.imageUrl}
                    alt="Clothing item full view"
                    className="max-w-full max-h-[90vh] object-contain"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-secondary/80 rounded-xl mx-2 my-2 text-white p-4">
                    <div className="flex items-center gap-2">
                        <ColorPicker
                            itemId={selectedImage.id}
                            initialColor={selectedImage.dominantColor}
                            isOpen={isColorPickerOpen}
                            setIsOpen={setIsColorPickerOpen}
                        />
                        <span>
                            {selectedImage.category}
                            {selectedImage.subCategory &&
                                <span> | {selectedImage.subCategory}</span>
                            }
                        </span>
                        <span className="ml-auto">
                            {selectedImage.uploadedAt.toDate().toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
