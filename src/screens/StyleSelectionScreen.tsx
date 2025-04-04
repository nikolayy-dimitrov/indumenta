import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { scaleUpVariants } from "../utils/framerMotionUtils.ts";
import { AuthContext } from "../context/AuthContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faAdjust,
    faPalette,
    faTint,
    faFire,
    faSnowflake,
    faTshirt,
    faBriefcase,
    faUserTie,
    faFutbol,
    faGlassCheers,
} from '@fortawesome/free-solid-svg-icons';

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

const colorOptions = [
    { value: "monochrome", label: "Monochrome", icon: faAdjust },
    { value: "complementary", label: "Complementary Colors", icon: faPalette },
    { value: "neutral", label: "Neutral Tones", icon: faTint },
    { value: "warm", label: "Warm Colors", icon: faFire },
    { value: "cool", label: "Cool Colors", icon: faSnowflake },
];

const occasionOptions = [
    { value: "casual", label: "Casual", icon: faTshirt },
    { value: "business", label: "Business", icon: faBriefcase },
    { value: "formal", label: "Formal", icon: faUserTie },
    { value: "sport", label: "Sport/Athletic", icon: faFutbol },
    { value: "party", label: "Party/Night Out", icon: faGlassCheers },
];

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
        <section className="h-[80vh] relative md:w-1/2 mx-auto flex items-center justify-center space-y-6 font-Josefin">
            <motion.div
                className="flex flex-col justify-center h-full"
                initial="hidden"
                animate="visible"
                variants={scaleUpVariants}
            >
                {/* Color Preference Selection */}
                <div>
                    <label className="block text-lg font-light mb-2 text-primary">Color Preference</label>
                    <div className="flex space-x-2">
                        {colorOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => onStyleChange('color', option.value)}
                                title={option.label}
                                className={`w-14 h-14 flex items-center justify-center rounded-md border transition duration-200 focus:outline-none ${
                                    stylePreferences.color === option.value
                                        ? 'border-primary bg-secondary/90'
                                        : 'border-gray-700 bg-secondary/50'
                                }`}
                            >
                                <FontAwesomeIcon icon={option.icon} size="xl" className="text-primary" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Occasion Preference Selection */}
                <div>
                    <label className="block text-lg font-light my-2 text-primary">Occasion</label>
                    <div className="flex space-x-2">
                        {occasionOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => onStyleChange('occasion', option.value)}
                                title={option.label}
                                className={`w-14 h-14 flex items-center justify-center rounded-md border transition duration-200 focus:outline-none ${
                                    stylePreferences.occasion === option.value
                                        ? 'border-primary bg-secondary/90'
                                        : 'border-gray-700 bg-secondary/50'
                                }`}
                            >
                                <FontAwesomeIcon icon={option.icon} size="xl" className="text-primary" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-4 pt-10">
                    <button
                        onClick={onSubmit}
                        className="uppercase text-primary font-light tracking-wide px-4 py-2 transition duration-300 active:scale-90"
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
