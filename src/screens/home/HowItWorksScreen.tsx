import { useRef, useMemo } from "react";
import { motion, useScroll, useTransform, useInView, MotionValue } from "framer-motion";
import { containerVariants } from "../../utils/framerMotionUtils";
import { howItWorksData } from "../../data/HomePageData";

const useStepAnimation = (scrollYProgress: MotionValue<number>, index: number, totalSteps: number) => {
    const stepProgress = useTransform(
        scrollYProgress,
        [index / totalSteps, (index + 1) / totalSteps],
        [0, 1]
    );

    const yOffset = useTransform(stepProgress, [0, 1], [0, 0]);
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
            className="bg-gradient-to-t from-transparent from-60% via-primary-blue/20 via-100% to-secondary w-full h-full mx-auto font-Josefin text-primary py-16 mt-12"
        >
            <div
                ref={containerRef}
                className="relative w-11/12 mx-auto"
            >
                {howItWorksData.map((step, index) => (
                    <motion.div
                        key={index}
                        className="pt-4"
                        style={{
                            opacity: transformValues[index].opacity,
                            position: "sticky",
                            top: "0%",
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
                                <h4 className="text-3xl font-semibold md:text-4xl mb-4">
                                    {step.stepLabel}
                                </h4>
                                <p className="text-md">{step.description}</p>
                            </div>

                            {/* Step Image */}
                            <div className="flex justify-center">
                                <img
                                    src={step.image}
                                    alt={step.stepLabel}
                                    className="w-full max-w-sm"
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};