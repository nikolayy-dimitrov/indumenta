import React, { useEffect, useState } from "react";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";

interface OutfitRecommendation {
    outfit_id: string;
    outfit_pieces: {
        Top: string;
        Bottom: string;
        Shoes: string;
    };
    match: number;
}

interface OutfitDisplayScreenProps {
    outfit: OutfitRecommendation[];
    onBack: () => void;
    onSaveOutfit: (outfit: OutfitRecommendation) => Promise<void>;
    checkIfOutfitSaved: (outfitId: string) => Promise<boolean>;
}

export const OutfitDisplayScreen: React.FC<OutfitDisplayScreenProps> = ({
                                                                            outfit,
                                                                            onBack,
                                                                            onSaveOutfit,
                                                                            checkIfOutfitSaved,
}) => {
    const [currentOutfitIndex, setCurrentOutfitIndex] = useState(0);
    const currentOutfit = outfit[currentOutfitIndex];
    const [isSaving, setIsSaving] = useState(false);
    const [isOutfitSaved, setIsOutfitSaved] = useState(false);

    const handleNext = () => {
        setCurrentOutfitIndex((prev) => (prev + 1) % outfit.length);
    };

    const handlePrevious = () => {
        setCurrentOutfitIndex((prev) => (prev - 1 + outfit.length) % outfit.length);
    };

    useEffect(() => {
        checkCurrentOutfitSaved();
    }, [currentOutfitIndex]);

    const checkCurrentOutfitSaved = async () => {
        if (currentOutfit) {
            const saved = await checkIfOutfitSaved(currentOutfit.outfit_id);
            setIsOutfitSaved(saved);
        }
    };

    const handleSaveOutfit = async () => {
        try {
            setIsSaving(true);
            await onSaveOutfit(currentOutfit);
            setIsOutfitSaved(true);
            toast.success("Outfit saved to your wardrobe!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to save outfit. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    if (!currentOutfit) {
        return (
            <div className="max-w-2xl mx-auto space-y-6 bg-white p-6 rounded-lg shadow-lg font-Josefin mt-20">
                <h2 className="text-2xl font-bold mb-4">No outfits generated</h2>
                <button
                    onClick={onBack}
                    className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                >
                    Back to Style Selection
                </button>
            </div>
        );
    }

    return (
        <section className="h-[90vh] relative max-w-2xl mx-auto space-y-6 font-Josefin">
            <div className="flex flex-col justify-center h-full max-md:w-10/12 max-md:mx-auto">
                <div className="flex flex-col justify-between items-center py-2">
                    <h2 className="text-3xl font-bold">{currentOutfit.outfit_id}</h2>
                    <span className="text-gray-500">
                        Match: {currentOutfit.match}%
                    </span>
                </div>

                <div className="space-y-4 mx-auto">
                    <div className="grid grid-cols-1 gap-4">
                        {Object.entries(currentOutfit.outfit_pieces).map(([pieceType, itemId]) => (
                            <div key={`${currentOutfit.outfit_id}-${pieceType}`} className="flex flex-col items-center gap-4 py-2">
                                <img
                                    src={itemId}
                                    alt={pieceType}
                                    className="w-24 h-24 object-cover rounded-md border"
                                />
                                {/*<div className="bg-primary/60 rounded-md w-24 text-center py-1">*/}
                                {/*    <h3 className="font-semibold text-xl text-secondary/80">{pieceType}</h3>*/}
                                {/*</div>*/}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-between gap-4 md:w-1/4 max-md:w-1/2 mx-auto mt-6">
                    <button
                        onClick={handlePrevious}
                        className="flex-1 border border-primary/20 text-primary/60 transition duration-300 hover:border-primary/70 hover:text-primary/90 active:scale-90
                        p-2 rounded"
                        disabled={outfit.length <= 1}
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                    <button
                        onClick={handleNext}
                        className="flex-1 border border-primary/20 text-primary/60 transition duration-300 hover:border-primary/70 hover:text-primary/90 active:scale-90
                        p-2 rounded"
                        disabled={outfit.length <= 1}
                    >
                        <FontAwesomeIcon icon={faArrowRight} />
                    </button>
                </div>

                <div className="flex items-center justify-center py-2 mt-6 disabled:opacity-50">
                    <button
                        onClick={handleSaveOutfit}
                        disabled={isSaving || isOutfitSaved}
                    >
                        {isOutfitSaved
                            ? "Added to Wardrobe"
                            : isSaving
                                ? "Adding..."
                                : "Add to Wardrobe"
                        }
                    </button>
                </div>

                <button
                    onClick={onBack}
                    className="w-full mt-12 text-primary font-light tracking-wider lowercase"
                >
                    Back to Style Selection
                </button>
            </div>
        </section>
    );
};