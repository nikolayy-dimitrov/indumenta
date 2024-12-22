import { useRef, useMemo } from "react";
import { motion, useScroll, useTransform, useInView, MotionValue } from "framer-motion";
import { containerVariants, textVariants } from "../../utils/framerMotionUtils";
import { howItWorksData } from "../../data/HomePageData";

const useStepAnimation = (scrollYProgress: MotionValue<number>, index: number, totalSteps: number) => {
    const stepProgress = useTransform(
        scrollYProgress,
        [index / totalSteps, (index + 1) / totalSteps],
        [0, 1]
    );

    const yOffset = useTransform(stepProgress, [0, 1], [100, 0]);
    const opacity = useTransform(
        stepProgress,
        [0, 0.2, 0.8, 1],
        [0, 1, 1, 0]
    );

    return { yOffset, opacity };
};

export const HowItWorksScreen = () => {
    const sectionRef = useRef(null);
    const containerRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true });

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Create individual hooks for each step
    const step0 = useStepAnimation(scrollYProgress, 0, howItWorksData.length);
    const step1 = useStepAnimation(scrollYProgress, 1, howItWorksData.length);
    const step2 = useStepAnimation(scrollYProgress, 2, howItWorksData.length);

    // Combine all steps into an array
    const transformValues = useMemo(() =>
            [step0, step1, step2],
        [step0, step1, step2]
    );

    return (
        <section
            ref={sectionRef}
            id="how-it-works"
            className="font-Josefin text-primary w-11/12 mx-auto py-16 mt-20 max-md:pt-96 max-md:mt-80"
        >
            <motion.h2
                className="text-4xl md:text-left max-md:text-center mb-8"
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={textVariants}
            >
                Take your style to the next level.
            </motion.h2>

            <div
                ref={containerRef}
                className="relative"
            >
                {howItWorksData.map((step, index) => (
                    <motion.div
                        key={index}
                        className="min-h-[650px] max-md:min-h-screen py-8"
                        style={{
                            opacity: transformValues[index].opacity,
                            y: transformValues[index].yOffset,
                            position: "sticky",
                            top: "0%",
                            transform: "translateY(-50%)"
                        }}
                    >
                        <motion.div
                            className="grid md:grid-cols-2 items-center gap-8"
                            initial="hidden"
                            animate={isInView ? "visible" : "hidden"}
                            variants={containerVariants}
                        >
                            {/* Step Text */}
                            <div>
                                <h3 className="mb-2 text-2xl">Step {step.step}</h3>
                                <h4 className="text-3xl font-semibold md:text-4xl mb-4">
                                    {step.stepLabel}
                                </h4>
                                <p className="text-lg">{step.description}</p>
                            </div>

                            {/* Step Image */}
                            <div className="flex justify-center">
                                <img
                                    src={step.image}
                                    alt={step.stepLabel}
                                    className="w-full max-w-sm rounded-2xl shadow-md"
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};