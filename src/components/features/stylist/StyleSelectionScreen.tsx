import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { scaleUpVariants } from "../../../lib/utils/framerMotionUtils.ts";
import { AuthContext } from "../../../context/AuthContext";
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
    faSun,
    faLeaf,
    faSeedling,
} from '@fortawesome/free-solid-svg-icons';

import { StylePreferences } from "../../../types/wardrobe.ts";

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

const seasonOptions = [
    { value: "spring", label: "Spring", icon: faSeedling },
    { value: "summer", label: "Summer", icon: faSun },
    { value: "fall", label: "Autumn", icon: faLeaf },
    { value: "winter", label: "Winter", icon: faSnowflake },
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
        <section
            className="relative w-full max-w-6xl md:w-11/12 lg:w-10/12 mx-auto flex items-center justify-center py-6 font-Josefin h-full">
            <motion.div
                className="flex flex-col w-full px-4 gap-6"
                initial="hidden"
                animate="visible"
                variants={scaleUpVariants}
            >
                <div className="text-center mb-4">
                    <h2 className="text-3xl font-light text-primary mb-2">Refine Your Style</h2>
                    <p className="text-gray-400 font-light">Select your preferences to generate the
                        perfect outfit.</p>
                </div>

                {/* Color Preference Selection */}
                <div className="flex flex-col gap-4">
                    <label
                        className="text-sm font-semibold text-primary/70 uppercase tracking-[0.2em] pl-1">
                        Color Palette
                    </label>
                    <div className="flex flex-col md:flex-row md:justify-center md:flex-wrap gap-2 md:gap-3 p-2 bg-black/10 rounded-3xl border border-white/5 backdrop-blur-md">
                        {colorOptions.map((option) => {
                            const isSelected = stylePreferences.color === option.value;
                            return (
                                <button
                                    key={option.value}
                                    onClick={() => onStyleChange('color', option.value)}
                                    className={`relative w-full md:w-auto px-5 py-3 flex items-center justify-start md:justify-center gap-3 rounded-2xl transition-colors duration-300 z-10 ${
                                        isSelected ? 'text-primary' : 'text-gray-400 hover:text-gray-200'
                                    }`}
                                >
                                    {isSelected && (
                                        <motion.div
                                            layoutId="active-color"
                                            className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-2xl -z-10 shadow-lg"
                                            transition={{
                                                type: "spring",
                                                bounce: 0.2,
                                                duration: 0.6
                                            }}
                                        />
                                    )}
                                    <FontAwesomeIcon icon={option.icon} size="lg"/>
                                    <span
                                        className="font-medium tracking-wide">{option.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Occasion Preference Selection */}
                <div className="flex flex-col gap-4">
                    <label
                        className="text-sm font-semibold text-primary/70 uppercase tracking-[0.2em] pl-1">
                        Occasion
                    </label>
                    <div className="flex flex-col md:flex-row md:justify-center md:flex-wrap gap-2 md:gap-3 p-2 bg-black/10 rounded-3xl border border-white/5 backdrop-blur-md">
                        {occasionOptions.map((option) => {
                            const isSelected = stylePreferences.occasion === option.value;
                            return (
                                <button
                                    key={option.value}
                                    onClick={() => onStyleChange('occasion', option.value)}
                                    className={`relative w-full md:w-auto px-5 py-3 flex items-center justify-start md:justify-center gap-3 rounded-2xl transition-colors duration-300 z-10 ${
                                        isSelected ? 'text-primary' : 'text-gray-400 hover:text-gray-200'
                                    }`}
                                >
                                    {isSelected && (
                                        <motion.div
                                            layoutId="active-occasion"
                                            className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-2xl -z-10 shadow-lg"
                                            transition={{
                                                type: "spring",
                                                bounce: 0.2,
                                                duration: 0.6
                                            }}
                                        />
                                    )}
                                    <FontAwesomeIcon icon={option.icon} size="lg"/>
                                    <span
                                        className="font-medium tracking-wide">{option.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Season Preference Selection */}
                <div className="flex flex-col gap-4">
                    <label
                        className="text-sm font-semibold text-primary/70 uppercase tracking-[0.2em] pl-1">
                        Season
                    </label>
                    <div className="flex flex-col md:flex-row md:justify-center md:flex-wrap gap-2 md:gap-3 p-2 bg-black/10 rounded-3xl border border-white/5 backdrop-blur-md">
                        {seasonOptions.map((option) => {
                            const isSelected = stylePreferences.season === option.value;
                            return (
                                <button
                                    key={option.value}
                                    onClick={() => onStyleChange('season', option.value)}
                                    className={`relative w-full md:w-auto px-5 py-3 flex items-center justify-start md:justify-center gap-3 rounded-2xl transition-colors duration-300 z-10 ${
                                        isSelected ? 'text-primary' : 'text-gray-400 hover:text-gray-200'
                                    }`}
                                >
                                    {isSelected && (
                                        <motion.div
                                            layoutId="active-season"
                                            className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-2xl -z-10 shadow-lg"
                                            transition={{
                                                type: "spring",
                                                bounce: 0.2,
                                                duration: 0.6
                                            }}
                                        />
                                    )}
                                    <FontAwesomeIcon icon={option.icon} size="lg"/>
                                    <span
                                        className="font-medium tracking-wide">{option.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col items-center gap-3 pt-2 pb-6">
                    <button
                        onClick={onSubmit}
                        className="group flex items-center gap-3 text-lg text-primary bg-primary/10 hover:bg-primary/20 border border-primary/30 hover:border-primary/60 rounded-full px-8 py-3 transition-all duration-300 active:scale-95 shadow-sm"
                    >
                        <span className="font-light tracking-wide uppercase">Generate Outfit</span>
                    </button>
                    <button
                        onClick={onBack}
                        className="text-gray-400 hover:text-gray-200 font-light tracking-wider lowercase transition-colors"
                    >
                        Back
                    </button>
                </div>
            </motion.div>
        </section>
    );
};
