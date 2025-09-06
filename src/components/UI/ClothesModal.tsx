import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { ClothingItem } from "../../types/wardrobe.ts";
import { ColorPicker } from "./ColorPicker.tsx";
import { DeleteHandler } from "./DeleteHandler.tsx";

interface ClothesModalProps {
    selectedImage: ClothingItem | null;
    onClose: () => void;
    onDelete?: (itemId: string) => void;
    isColorPickerOpen: boolean;
    setIsColorPickerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ClothesModal = ({
                                 selectedImage, onClose, onDelete, isColorPickerOpen,
                                 setIsColorPickerOpen
                             }: ClothesModalProps) => {

    const handleSuccessfulDelete = (outfitId: string) => {
        if (onDelete) onDelete(outfitId);

        onClose();
    };

    if (!selectedImage) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-primary dark:bg-secondary rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header with Close Button */}
                <div className="flex items-center justify-between p-4">
                    <h2 className="text-xl font-semibold">
                        {selectedImage.analysis!.category || "Clothing Item"}
                        {selectedImage.analysis?.subCategory &&
                            <span
                                className="text-secondary/70 dark:text-primary/60 ml-2">| {selectedImage.analysis.subCategory}</span>
                        }
                    </h2>
                    <button
                        className="text-secondary/80 hover:text-secondary/60 dark:text-primary/80 dark:hover:text-primary/60 transition-colors"
                        onClick={onClose}
                    >
                        <FontAwesomeIcon icon={faX}/>
                    </button>
                </div>

                {/* Content Grid */}
                <div
                    className="grid md:grid-cols-2 gap-6 p-4 max-h-[calc(90vh-70px)] overflow-y-auto">
                    {/* Left Side - Image */}
                    <div
                        className="relative rounded-lg overflow-hidden bg-primary dark:bg-secondary">
                        <img
                            src={selectedImage.imageUrl}
                            alt="Clothing item full view"
                            className="w-full h-[300px] object-contain max-h-[60vh]"
                        />
                    </div>

                    {/* Right Side - Details */}
                    <div className="space-y-6">
                        {/* Details Section */}
                        <div>
                            <h3 className="text-sm uppercase tracking-wider text-secondary/80 dark:text-primary/80 font-medium mb-2">
                                Details
                            </h3>
                            <div className="h-px bg-secondary/50 dark:bg-primary/50 mb-4"></div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">Category</span>
                                    <span
                                        className="px-2 py-1 rounded-full text-xs text-secondary dark:text-primary border border-primary">
                                        {selectedImage.analysis!.category}
                                    </span>
                                </div>

                                {selectedImage.analysis?.subCategory && (
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">Type</span>
                                        <span
                                            className="px-2 py-1 rounded-full text-xs text-secondary dark:text-primary border border-primary">
                                            {selectedImage.analysis.subCategory}
                                        </span>
                                    </div>
                                )}

                                <div className="flex justify-between items-center">
                                    <span className="font-medium">Color</span>
                                    <div className="flex items-center gap-2">
                                        <ColorPicker
                                            itemId={selectedImage.id}
                                            initialColor={selectedImage.analysis!.color}
                                            isOpen={isColorPickerOpen}
                                            setIsOpen={setIsColorPickerOpen}
                                        />
                                    </div>
                                </div>

                                {selectedImage.uploadedAt && (
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">Added</span>
                                        <span>{selectedImage.uploadedAt.toDate().toLocaleDateString()}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-2">
                            <DeleteHandler
                                itemId={selectedImage.id}
                                collectionName="clothes"
                                onSuccessfulDelete={handleSuccessfulDelete}
                                confirmMessage="Are you sure you want to delete this item?"
                            >
                                {(handleDelete) => (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(selectedImage.id);
                                        }}
                                        className="flex w-full"
                                    >
                                                <span
                                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors">
                                                    Remove
                                                </span>
                                    </button>
                                )}
                            </DeleteHandler>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};