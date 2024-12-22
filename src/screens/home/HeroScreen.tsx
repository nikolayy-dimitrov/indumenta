import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";

import AppMockUp from "../../assets/HomePage/Indumenta Home screen clean-left.png";

import { buttonVariants, containerVariants, textVariants } from "../../utils/framerMotionUtils.ts";

export const HeroScreen = () => {
    const { scrollY } = useScroll();
    const yOffset = useTransform(scrollY, [0, 800], [0, 80]);

    return (
        <section id="hero-screen" className="h-screen flex max-md:pt-12 font-Josefin bg-gradient-to-b from-secondary to-black/40">
            <motion.div
                className="md:flex items-center justify-between w-11/12 mx-auto"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="z-10 basis-1/2">
                    <motion.h1
                        className="font-semibold md:text-7xl max-md:text-6xl flex flex-col"
                        variants={textVariants}
                    >
                        <span className="text-left">Your</span>
                        <span className="md:text-center">Virtual Wardrobe,</span>
                        <div className="flex flex-col">
                            <span className="text-right text-content font-extrabold transform">Redefined.</span>
                            <span className="text-right text-content opacity-10 font-extrabold transform scale-y-[-1] -mt-6">Redefined.</span>
                        </div>
                    </motion.h1>
                    <motion.h2
                        className="text-xl text-content/50 italic mt-12 flex items-center max-md:justify-center"
                        variants={textVariants}
                    >
                        Your Personal Wardrobe Assistant.
                    </motion.h2>
                    <motion.div
                        className="mt-8 max-md:mt-20 flex items-center max-md:justify-center"
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
                <motion.div
                    style={{ y: yOffset }}
                    className="basis-1/3 relative z-0 mt-4 flex md:items-center justify-center"
                >
                    <motion.img alt="App Mockup" src={AppMockUp} className="absolute h-auto w-72 md:w-96" />
                    <motion.img alt="App Mockup" src={AppMockUp} className="z-[-10] opacity-20 absolute h-auto md:w-96 transform scale-x-[-1] -left-1/3 max-md:hidden" />
                </motion.div>
            </motion.div>
        </section>
    );
};
