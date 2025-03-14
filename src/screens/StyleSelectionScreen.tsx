import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { scaleUpVariants } from "../utils/framerMotionUtils.ts";
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
        <section className="h-[80vh] relative md:max-w-2xl max-md:w-10/12 mx-auto space-y-6 rounded-lg shadow-lg font-Josefin">
            <motion.div
                className="flex flex-col justify-center h-full"
                initial="hidden"
                animate="visible"
                variants={scaleUpVariants}
            >
                <div>
                    <label className="block text-lg font-light mb-2 text-primary">Color Preference</label>
                    <select
                        value={stylePreferences.color}
                        onChange={(e) => onStyleChange('color', e.target.value)}
                        className="w-full p-3 border border-gray-700 rounded-md text-primary bg-secondary/90 transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
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
                    <label className="block text-lg font-light my-2">Occasion</label>
                    <select
                        value={stylePreferences.occasion}
                        onChange={(e) => onStyleChange('occasion', e.target.value)}
                        className="w-full p-3 border border-gray-700 rounded-md text-primary bg-secondary/90 transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="">Select an occasion</option>
                        <option value="casual">Casual</option>
                        <option value="business">Business</option>
                        <option value="formal">Formal</option>
                        <option value="sport">Sport/Athletic</option>
                        <option value="party">Party/Night Out</option>
                    </select>
                </div>

                <div className="flex flex-col gap-4 pt-10">
                    <button
                        onClick={onSubmit}
                        className="uppercase
                                   bg-clip-text bg-gradient-to-t from-secondary from-5% to-primary to-100% text-transparent
                                   font-light tracking-wide
                                   px-4 py-2
                                   transition duration-300 active:scale-90"
                    >
                        Generate Outfit
                    </button>
                    <button
                        onClick={onBack}
                        className="w-full py-2 mt-2 text-primary font-light tracking-wider lowercase"
                    >
                        Back
                    </button>
                </div>
            </motion.div>
        </section>
    );
};
