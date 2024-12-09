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
        <section className="relative md:max-w-2xl max-md:w-10/12 mx-auto space-y-6 rounded-lg shadow-lg font-Josefin">
            <div className="flex flex-col justify-center h-screen">
                <h2 className="text-3xl font-bold mb-4">Style Preferences</h2>

                <div>
                    <label className="block text-lg font-semibold mb-2">Color Preference</label>
                    <select
                        value={stylePreferences.color}
                        onChange={(e) => onStyleChange('color', e.target.value)}
                        className="w-full p-2 border rounded-md text-secondary"
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
                    <label className="block text-lg font-semibold my-2">Occasion</label>
                    <select
                        value={stylePreferences.occasion}
                        onChange={(e) => onStyleChange('occasion', e.target.value)}
                        className="w-full p-2 border rounded-md text-secondary"
                    >
                        <option value="">Select an occasion</option>
                        <option value="casual">Casual</option>
                        <option value="business">Business</option>
                        <option value="formal">Formal</option>
                        <option value="sport">Sport/Athletic</option>
                        <option value="party">Party/Night Out</option>
                    </select>
                </div>

                <div className="flex gap-4 pt-6">
                    <button
                        onClick={onBack}
                        className="flex-1 bg-secondary hover:brightness-150 text-priamry/10 font-medium py-2 px-4 rounded"
                    >
                        Back
                    </button>
                    <button
                        onClick={onSubmit}
                        className="flex-1 bg-primary/90 hover:bg-primary text-secondary font-bold py-2 px-4 rounded"
                    >
                        Generate Outfit
                    </button>
                </div>
            </div>
        </section>
    );
};
