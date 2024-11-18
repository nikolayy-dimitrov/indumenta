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
        <div className="max-w-2xl mx-auto space-y-6 bg-white p-6 rounded-lg shadow-lg font-Josefin mt-20">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">{currentOutfit.outfit_id}</h2>
                <span className="text-gray-500">
                    Match: {currentOutfit.match}%
                </span>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                    {Object.entries(currentOutfit.outfit_pieces).map(([pieceType, itemId]) => (
                        <div key={`${currentOutfit.outfit_id}-${pieceType}`} className="flex items-center gap-4">
                            <img
                                src={itemId}
                                alt={pieceType}
                                className="w-24 h-24 object-cover rounded-md border"
                            />
                            <div>
                                <h3 className="font-bold">{pieceType}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-between gap-4 mt-6">
                <button
                    onClick={handlePrevious}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                    disabled={outfit.length <= 1}
                >
                    Previous Outfit
                </button>
                <button
                    onClick={handleNext}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                    disabled={outfit.length <= 1}
                >
                    Next Outfit
                </button>
            </div>

            <button
                onClick={onBack}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
            >
                Back to Style Selection
            </button>
        </div>
    );
};