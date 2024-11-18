import React, { useContext } from 'react';
import { AuthContext } from "../context/AuthContext";

interface StylePreferences {
    color: string;
    occasion: string;
}

interface StyleSelectionScreenProps {
    stylePreferences: StylePreferences;
    onStyleChange: (field: keyof StylePreferences, value: string) => void;
    onBack: () => void;
    onSubmit: () => void;
}

export const StyleSelectionScreen: React.FC<StyleSelectionScreenProps> = ({
                                                                              stylePreferences,
                                                                              onStyleChange,
                                                                              onBack,
                                                                              onSubmit
                                                                          }) => {
    const { user } = useContext(AuthContext);

    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen font-Josefin">
                Please log in to continue.
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6 bg-white p-6 rounded-lg shadow-lg font-Josefin mt-20">
            <h2 className="text-2xl font-bold mb-4">Style Preferences</h2>

            <div>
                <label className="block text-sm font-medium mb-2">Color Preference</label>
                <select
                    value={stylePreferences.color}
                    onChange={(e) => onStyleChange('color', e.target.value)}
                    className="w-full p-2 border rounded-md"
                >
                    <option value="">Select a color scheme</option>
                    <option value="monochrome">Monochrome</option>
                    <option value="complementary">Complementary Colors</option>
                    <option value="neutral">Neutral Tones</option>
                    <option value="warm">Warm Colors</option>
                    <option value="cool">Cool Colors</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Occasion</label>
                <select
                    value={stylePreferences.occasion}
                    onChange={(e) => onStyleChange('occasion', e.target.value)}
                    className="w-full p-2 border rounded-md"
                >
                    <option value="">Select an occasion</option>
                    <option value="casual">Casual</option>
                    <option value="business">Business</option>
                    <option value="formal">Formal</option>
                    <option value="sport">Sport/Athletic</option>
                    <option value="party">Party/Night Out</option>
                </select>
            </div>

            <div className="flex gap-4 pt-4">
                <button
                    onClick={onBack}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                >
                    Back
                </button>
                <button
                    onClick={onSubmit}
                    className="flex-1 bg-primary/90 hover:bg-primary text-white font-bold py-2 px-4 rounded"
                >
                    Generate Outfit
                </button>
            </div>
        </div>
    );
};
