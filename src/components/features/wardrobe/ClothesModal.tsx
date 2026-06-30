import { GlassModal } from "../../ui/modals/GlassModal.tsx";
import { EditorialLabel } from "../../ui/typography/EditorialLabel.tsx";
import { DangerButton } from "../../ui/buttons/DangerButton.tsx";
import { ClothingItem } from "../../../types/wardrobe.ts";
import { OptimizedImage } from "../../ui/media/OptimizedImage";
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

    // No early return for null selectedImage so AnimatePresence can animate the exit

    return (
        <GlassModal isOpen={!!selectedImage} onClose={onClose}>
            {selectedImage && (
                <>
                    {/* Left Side - Full Bleed Image */}
                <div className="relative w-full md:w-1/2 h-64 md:h-auto min-h-[300px] bg-black/50">
                    <OptimizedImage
                        src={selectedImage.largeUrl || selectedImage.mediumUrl || selectedImage.imageUrl}
                        alt={selectedImage.analysis?.category || "Clothing item"}
                        className="absolute inset-0 w-full h-full object-cover"
                        width={800}
                        height={800}
                        loading={"eager"}
                    />
                    {/* Subtle gradient overlay at the bottom to blend with content on mobile if needed */}
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent md:hidden" />
                </div>

                {/* Right Side - Details & Actions */}
                <div className="relative w-full md:w-1/2 flex flex-col p-6 md:p-10 max-h-[85vh] overflow-y-auto scrollbar-hide">
                    
                    <div className="mb-8">
                        <h2 className="text-3xl font-light tracking-wide mb-1">
                            {selectedImage.status === 'pending' ? 'Processing...' : (selectedImage.analysis?.category || "Item")}
                        </h2>
                        {selectedImage.analysis?.subCategory && (
                            <p className="text-primary/50 tracking-[0.2em] uppercase text-xs font-medium">
                                {selectedImage.analysis.subCategory}
                            </p>
                        )}
                    </div>

                    {/* Metadata List */}
                    <div className="flex flex-col gap-6 flex-1">
                        <div className="flex flex-col gap-1">
                            <EditorialLabel>Category</EditorialLabel>
                            <span className="text-lg font-light">
                                {selectedImage.status === 'pending' ? 'Processing...' : (selectedImage.analysis?.category || 'Unknown')}
                            </span>
                        </div>

                        <div className="flex flex-col gap-1">
                            <EditorialLabel>Color</EditorialLabel>
                            <div className="pt-1">
                                {selectedImage.analysis?.color ? (
                                    <ColorPicker
                                        itemId={selectedImage.id}
                                        initialColor={selectedImage.analysis.color}
                                        isOpen={isColorPickerOpen}
                                        setIsOpen={setIsColorPickerOpen}
                                    />
                                ) : (
                                    <span className="text-lg font-light text-primary/50">Processing...</span>
                                )}
                            </div>
                        </div>

                        {selectedImage.uploadedAt && (
                            <div className="flex flex-col gap-1">
                                <EditorialLabel>Added On</EditorialLabel>
                                <span className="text-lg font-light">
                                    {selectedImage.uploadedAt.toDate().toLocaleDateString(undefined, { 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                    })}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Action Bottom */}
                    <div className="pt-8 mt-8 border-t border-white/5">
                        <DeleteHandler
                            itemId={selectedImage.id}
                            collectionName="clothes"
                            onSuccessfulDelete={handleSuccessfulDelete}
                            confirmMessage="Are you sure you want to remove this item from your wardrobe?"
                        >
                            {(handleDelete) => (
                                <DangerButton
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(selectedImage.id);
                                    }}
                                >
                                    Remove Item
                                </DangerButton>
                            )}
                        </DeleteHandler>
                    </div>
                </div>
                </>
            )}
        </GlassModal>
    );
};