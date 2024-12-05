import React, { useState } from "react";

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
}

export const OutfitDisplayScreen: React.FC<OutfitDisplayScreenProps> = ({ outfit, onBack }) => {
    const [currentOutfitIndex, setCurrentOutfitIndex] = useState(0);
    const currentOutfit = outfit[currentOutfitIndex];

    const handleNext = () => {
        setCurrentOutfitIndex((prev) => (prev + 1) % outfit.length);
    };

    const handlePrevious = () => {
        setCurrentOutfitIndex((prev) => (prev - 1 + outfit.length) % outfit.length);
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
        <section className="relative max-w-2xl mx-auto space-y-6 font-Josefin">
            <div className="flex flex-col justify-center h-screen">
                <div className="flex justify-between items-center py-2">
                    <h2 className="text-3xl font-bold">{currentOutfit.outfit_id}</h2>
                    <span className="text-gray-500">
                        Match: {currentOutfit.match}%
                    </span>
                </div>

                <div className="space-y-4 mx-auto">
                    <div className="grid grid-cols-1 gap-4">
                        {Object.entries(currentOutfit.outfit_pieces).map(([pieceType, itemId]) => (
                            <div key={`${currentOutfit.outfit_id}-${pieceType}`} className="flex flex-col items-center gap-2">
                                <img
                                    src={itemId}
                                    alt={pieceType}
                                    className="w-24 h-24 object-cover rounded-md border"
                                />
                                <div className="bg-primary/60 rounded-md w-24 text-center py-1">
                                    <h3 className="font-semibold text-xl text-secondary/80">{pieceType}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-between gap-4 mt-6">
                    <button
                        onClick={handlePrevious}
                        className="flex-1 bg-content/60 hover:bg-content/50 text-primary font-bold py-2 px-4 rounded"
                        disabled={outfit.length <= 1}
                    >
                        Previous Outfit
                    </button>
                    <button
                        onClick={handleNext}
                        className="flex-1 bg-content/60 hover:bg-content/50 text-primary font-bold py-2 px-4 rounded"
                        disabled={outfit.length <= 1}
                    >
                        Next Outfit
                    </button>
                </div>

                <button
                    onClick={onBack}
                    className="w-full mt-4 bg-secondary hover:bg-secondary/70 text-primary font-semibold py-2 px-4 rounded"
                >
                    Back to Style Selection
                </button>
            </div>
        </section>
    );
};