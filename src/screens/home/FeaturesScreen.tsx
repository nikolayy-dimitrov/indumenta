import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { containerVariants, textVariants } from "../../utils/framerMotionUtils.ts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { featuresData } from "../../data/HomePageData.ts";


export const Features = () => {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: false });

    return (
        <section ref={sectionRef} id="features" className="z-10 relative w-full bg-primary md:-mt-16 max-md:-mt-28 py-16 px-12 font-Josefin">
            <motion.h2
                className="text-secondary text-5xl md:text-right max-md:text-center mb-12"
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={textVariants}
            >
                Features.
            </motion.h2>
            <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto"
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={containerVariants}
            >
                {featuresData.map((card, index) => (
                    <div
                        key={index}
                        className="group flex flex-col items-center
                        text-center bg-secondary text-primary rounded-lg px-8 py-32
                        shadow-xl shadow-secondary rounded-t-[120px]
                        transition-all duration-300 hover:bg-primary hover:text-secondary
                        hover:scale-95 hover:border-2 border-secondary -rotate-12"
                    >
                        <div className="w-4 h-4 bg-primary rounded-full top-4 absolute group-hover:bg-secondary/80"></div>
                        <div
                            className="bg-primary text-secondary w-16 h-16 flex items-center justify-center rounded-full mb-4 transition-colors duration-300 group-hover:bg-secondary group-hover:text-primary">
                            <FontAwesomeIcon icon={card.icon!} size="2x"/>
                        </div>
                        <h3 className="text-xl font-semibold mb-2 transition-colors duration-300 group-hover:text-secondary">
                            {card.title}
                        </h3>
                        <span className="w-11/12 bg-primary/80 h-0.5 my-3 group-hover:bg-secondary"></span>
                        <p className="text-sm text-primary/70 transition-colors duration-300 group-hover:text-secondary/70">
                            {card.description}
                        </p>
                    </div>
                ))}
            </motion.div>
            <motion.div
                className="mt-16 text-center"
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={textVariants}
            >
                <p className="text-lg italic text-secondary/70">
                    "Style is a way to say who you are without having to speak."
                </p>
                <p className="text-sm text-secondary/50 mt-2">— Rachel Zoe</p>
            </motion.div>
        </section>
    );
};
