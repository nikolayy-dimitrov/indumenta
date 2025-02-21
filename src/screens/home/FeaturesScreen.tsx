import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import React, { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { featuresData } from "../../data/HomePageData.ts";
import { FeatureScreenProps } from "../../data/interfaces/screens/FeatureScreen.ts";
import useMediaQuery from "../../utils/useMediaQuery.ts";

const FeatureCard: React.FC<FeatureScreenProps> = ({ card, index, scrollY }) => {
    const isMobile = useMediaQuery("(max-width: 768px)");

    const start = 500 + index * 50;
    const end = start + 300;
    const initialY = index < 1 ? -20 : 20;

    const opacity = useTransform(scrollY, [start, end], [0.1, 1]);
    const rawY = useTransform(scrollY, [start, end], [initialY, 0]);
    const y = useSpring(rawY, { stiffness: 60, damping: 30 });

    const gradientDirection = index % 6 < 3 ? "bg-gradient-to-b" : "bg-gradient-to-t";
    const cardPosition = isMobile
        ? index % 2 === 1 ? -40 : 40
        : index % 3 === 1 ? 100 : index % 3 === 0 ? -50 : -100;

    return (
        <motion.div
            style={{ opacity, y, translateY: cardPosition }}
            className={`${gradientDirection} from-primary-blue/40 to-primary/80 flex flex-col items-center justify-center py-24 rounded-3xl transform`}
        >
            <div className="text-secondary">
                <FontAwesomeIcon icon={card.icon!} size="2x" />
            </div>
            <h3 className="text-secondary">{card.title}</h3>
        </motion.div>
    );
};

export const Features = () => {
    const sectionRef = useRef<HTMLElement>(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });
    const { scrollY } = useScroll();

    const topHeadingOpacity = useTransform(scrollYProgress, [0.45, 0.55], [0, 1]);
    const topHeadingX = useTransform(scrollYProgress, [0.45, 0.55], [-200, -25]);

    const botHeadingOpacity = useTransform(scrollYProgress, [0.55, 0.65], [0, 1]);
    const botHeadingX = useTransform(scrollYProgress, [0.55, 0.65], [200, 0]);

    return (
        <section
            ref={sectionRef}
            id="features"
            className="relative min-h-[300vh] bg-gradient-to-b from-[#0f0f10] to-secondary px-12 py-12 font-Josefin"
        >
            <div className="absolute left-0 overflow-hidden w-full h-full
            bg-gradient-to-b from-transparent from-50% via-primary-blue/20 via-100% to-secondary"></div>
            <div className="sticky top-0 h-screen flex items-center justify-center">
                {/* Cards grid */}
                <motion.div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:w-1/2 max-lg:w-2/3 max-md:w-full mx-auto">
                    {featuresData.map((card, index) => (
                        <FeatureCard key={index} card={card} index={index} scrollY={scrollY} />
                    ))}
                </motion.div>

                <div className="overflow-hidden absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <motion.h1
                        style={{ opacity: topHeadingOpacity, x: topHeadingX }}
                        className="text-8xl max-md:text-6xl font-extrabold text-primary text-center"
                    >
                        Features
                    </motion.h1>
                    <motion.h2
                        style={{ opacity: botHeadingOpacity, x: botHeadingX }}
                        className="text-8xl max-md:text-6xl font-extrabold text-primary text-center"
                    >
                        Features
                    </motion.h2>
                </div>
            </div>
        </section>
    );
};
