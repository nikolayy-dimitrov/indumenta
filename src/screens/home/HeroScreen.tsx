import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import { AnimatedBackground } from "../../components/AnimatedBackground.tsx";

import AppMockUp from "../../assets/iphone-mockup-perspective.png";

import { buttonVariants, containerVariants, textVariants } from "../../utils/framerMotionUtils.ts";

export const HeroScreen = () => {
    return (
        <section id="hero-screen" className="h-screen flex max-md:mt-12 font-Josefin">
            <AnimatedBackground />
            <motion.div
                className="md:flex items-center justify-between z-10 w-11/12 mx-auto"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="z-10">
                    <motion.h1
                        className="font-extrabold text-6xl leading-tight"
                        variants={textVariants}
                    >
                        Your Virtual Wardrobe,<br />
                        <span className="text-content">Redefined.</span>
                    </motion.h1>
                    <motion.h2
                        className="text-lg text-content/70 italic"
                        variants={textVariants}
                    >
                        Your Personal Wardrobe Assistant.
                    </motion.h2>
                    <motion.p
                        className="mt-4 sm:mt-6 text-lg sm:text-xl text-primary max-w-3xl mx-auto"
                        variants={textVariants}
                    >
                        Welcome to <span className="font-bold">Indumenta</span>, the AI-driven wardrobe assistant that helps you plan outfits, organize
                        clothes, and discover new styles effortlessly.
                    </motion.p>
                    <motion.div
                        className="mt-8"
                        variants={buttonVariants}
                    >
                        <Link to={"/wardrobe"}>
                            <button
                                className="px-6 py-3 rounded-lg bg-primary text-secondary font-semibold
                                hover:bg-opacity-0 hover:text-primary hover:border border-primary transition-all duration-200">
                                Explore Your Closet
                            </button>
                        </Link>
                    </motion.div>
                </div>
                <div
                    className="scale-x-[-1] relative hover:rotate-2 transition-all duration-300"
                >
                    <img alt="App Mockup" src={AppMockUp} className="h-auto w-72 md:w-96 object-contain mx-auto" />
                </div>
            </motion.div>
        </section>
    );
};
