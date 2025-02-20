import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";

import AppMockUpLeft from "../../assets/HomePage/Indumenta-Home screen-clean-left-dark.png";
import AppMockUpInverted from "../../assets/HomePage/Indumenta-Home screen-clean-left-dark-inverted.png";
import AppMockupCentral from "../../assets/HomePage/Indumenta-Home screen-clean-portrait-dark.png"

import { buttonVariants, containerVariants, textVariants } from "../../utils/framerMotionUtils.ts";

export const HeroScreen = () => {
    const { scrollY } = useScroll();
    const yOffset = useTransform(scrollY, [0, 800], [0, 80]);

    const xOffsetLeft = useTransform(scrollY, [0, 800], [0, -50]);
    const xOffsetRight = useTransform(scrollY, [0, 800], [0, 50]);


    return (
        <section id="hero-screen" className="h-screen flex items-center justify-center font-Josefin bg-gradient-to-b from-secondary to-[#0f0f10] px-6">
            <motion.div
                className="flex flex-col md:flex-row items-center justify-center text-center relative w-full max-w-5xl mx-auto"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* CTA */}
                <div className="absolute md:-top-16 max-md:-top-20">
                    <motion.div
                        variants={buttonVariants}
                        className="flex justify-between items-center gap-12">
                        <Link
                            to="/register"
                            className="bg-gradient-to-br from-primary-blue to-primary/80 to-80% rounded-xl
                             border border-primary/50
                             text-secondary font-light tracking-wide py-2 px-4"
                        >
                            Join Now
                        </Link>
                        <Link
                            to="/stylist"
                            className="bg-gradient-to-br from-primary-blue to-primary/80 to-80% rounded-xl
                            border border-primary/50
                            text-secondary font-light tracking-wide py-2 px-4"
                        >
                            Get Styled
                        </Link>
                    </motion.div>
                </div>

                {/* Title */}
                <motion.h1
                    className="absolute top-0 z-20 font-extrabold text-6xl md:text-9xl"
                    variants={textVariants}
                >
                    INDUMENTA
                </motion.h1>
                <motion.img
                    style={{y: yOffset}}
                    alt="App Mockup"
                    src={AppMockupCentral}
                    className="z-20 md:absolute md:w-[30%] max-w-[80%] top-0"
                />
                {/* Mockup Images */}
                <motion.div
                    className="relative z-10 flex items-center justify-center"
                >

                    <div className="flex items-center justify-center">
                        <motion.img
                            style={{ x: xOffsetLeft }}
                            alt="App Mockup Left Profile"
                            src={AppMockUpInverted}
                            className="z-[-10] md:w-1/3 max-md:hidden"
                        />
                        <motion.img
                            style={{ x: xOffsetRight }}
                            alt="App Mockup Left Profile"
                            src={AppMockUpLeft}
                            className="z-[-10] md:w-1/3 max-md:hidden"
                        />
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
};

