import { useCallback, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";
import { OutfitFilter, OutfitItem, ClothingItem, SortOption, ActiveCollection, ViewMode } from "../types/wardrobe.ts";
import { useClothes, useOutfits } from "../hooks/useWardrobe.ts";
import { useEscapeKey } from "../hooks/useEscapeKey.ts";
import { LoadingIndicator } from "../components/UI/LoadingIndicator.tsx";
import { OutfitModal } from "../components/UI/OutfitModal.tsx";
import { ClothesModal } from "../components/UI/ClothesModal.tsx";
import { OutfitsGrid } from "../components/OutfitsGrid.tsx";
import { WardrobeControls } from "../components/WardrobeControls.tsx";
import { ClothesGrid } from "../components/ClothesGrid.tsx";

// TODO: Add total outfits and clothes count
export const WardrobePage = () => {
    const { user } = useContext(AuthContext);
    const [activeCollection, setActiveCollection] = useState<ActiveCollection>('clothes');
    const [viewMode, setViewMode] = useState<ViewMode>("grid");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_isColorPickerOpen, setIsColorPickerOpen] = useState<boolean>(false);

    const [selectedImage, setSelectedImage] = useState<ClothingItem | null>(null);
    const [selectedOutfit, setSelectedOutfit] = useState<OutfitItem | null>(null);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [sortBy, _setSortBy] = useState<SortOption>("newest");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [outfitFilter, _setOutfitFilter] = useState<OutfitFilter>("owned");

    const { clothes, isLoading: isClothesLoading, setClothes } = useClothes(user?.uid);
    const { outfits, isLoading: isOutfitsLoading, setOutfits } = useOutfits(user?.uid, outfitFilter);

    const isOwner = user?.uid === selectedOutfit?.userId;

    useEffect(() => {
        setActiveCollection('clothes');
        setViewMode("grid");
    }, []);

    // Callback function to reset all modal/popup states
    const handleResetStates = useCallback(() => {
        setSelectedImage(null);
        setSelectedOutfit(null);
        setIsColorPickerOpen(false);
    }, []);

    useEscapeKey(handleResetStates);

    const handleToggleCollection = (mode: ActiveCollection) => {
        setActiveCollection(mode);
    };

    const handleToggleView = (mode: ViewMode) => {
        setViewMode(mode);
    };

    const handleSelectClothingItem = (item: ClothingItem) => {
        setSelectedImage(item);
    };

    const handleSelectOutfit = (outfit: OutfitItem) => {
        setSelectedOutfit(outfit);
    };

    const handleDeleteOutfit = (outfitId: string) => {
        setOutfits(prevOutfits => prevOutfits.filter(outfit => outfit.id !== outfitId));
    };

    const handleDeleteClothingItem = (itemId: string) => {
        setClothes(prevItem => prevItem.filter(clothing => clothing.id !== itemId));
    }

    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen font-Josefin">
                <Link to="/authentication">Please log in to view your wardrobe.</Link>
            </div>
        );
    }

    if (isOutfitsLoading || isClothesLoading) {
        return <LoadingIndicator />
    }

    return (
        <section className="w-11/12 mx-auto px-6 py-8 font-Josefin">
            <WardrobeControls
                activeCollection={activeCollection}
                viewMode={viewMode}
                sortBy={sortBy}
                outfitFilter={outfitFilter}
                onToggleCollection={handleToggleCollection}
                onToggleView={handleToggleView}
                // TODO: reimplement sort/filter functionality
                // onSortChange={setSortBy}
                // onFilterChange={setOutfitFilter}
            />

            {activeCollection === "clothes" ? (
                <ClothesGrid
                    clothes={clothes}
                    viewMode={viewMode}
                    setClothes={setClothes}
                    sortBy={sortBy}
                    onSelectItem={handleSelectClothingItem}
                />
            ) : (
                <OutfitsGrid
                    outfits={outfits}
                    viewMode={viewMode}
                    setOutfits={setOutfits}
                    onSelectOutfit={handleSelectOutfit}
                />
            )}

            {/* Modals */}
            {selectedImage && (
                <ClothesModal
                    selectedImage={selectedImage}
                    onClose={() => setSelectedImage(null)}
                    onDelete={handleDeleteClothingItem}
                />
            )}

            {selectedOutfit && (
                <OutfitModal
                    outfit={selectedOutfit}
                    onClose={() => setSelectedOutfit(null)}
                    isOwner={isOwner}
                    onDelete={handleDeleteOutfit}
                />
            )}
        </section>
    );
};