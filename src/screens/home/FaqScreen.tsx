import React, { useRef, useState } from "react";
import { faqData } from "../../data/HomePageData.ts";
import { FaqScreenProps } from "../../data/interfaces/screens/FaqScreen.ts";
import { motion, useInView } from "framer-motion";

export const FaqScreen = () => {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true });

    const [openCardIndex, setOpenCardIndex] = useState<number | null>(null);

    const toggleCard = (index: number) => {
        setOpenCardIndex(openCardIndex === index ? null : index);
    };

    const Card: React.FC<FaqScreenProps> = ({title, description, isOpen, onClick}) => {
        return (
            <div
                className="border-b border-primary py-4 px-2 md:w-1/2"
                onClick={onClick}>
                <div
                    className="flex items-center md:text-xl max-md:text-lg max-md:leading-tight cursor-pointer justify-between font-bold"
                    onClick={onClick}>
                    <span>{title}</span>
                    <span>{isOpen ? '−' : '+'}</span>
                </div>
                {isOpen && (
                    <motion.div
                        key="content"
                        initial={{opacity: 0, height: 0}}
                        animate={{opacity: 1, height: "auto"}}
                        exit={{opacity: 0, height: 0}}
                        transition={{duration: 0.4, ease: "easeInOut"}}
                        className="pt-2 md:text-lg max-md:text-sm font-normal text-primary/70 overflow-hidden"
                    >
                        {description}
                    </motion.div>
                )}
            </div>
        )
    };

    return (
        <section ref={sectionRef} id="faq" className="w-11/12 mx-auto font-Josefin py-16">
            <motion.h2
                className="text-5xl leading-tight text-right mb-8 flex flex-col"
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
            >
                {["Frequently", "Asked", "Questions"].map((word, index) => (
                    <motion.span
                        key={index}
                        variants={{
                            hidden: {opacity: 0, y: 20},
                            visible: {
                                opacity: 1,
                                y: 0,
                                transition: {
                                    delay: index * 0.2, // Stagger delay for each child
                                    duration: 0.4,
                                    ease: "easeOut",
                                },
                            },
                        }}
                    >
                        {word}
                    </motion.span>
                ))}
            </motion.h2>
            {faqData.map((question, index) => (
                <Card
                    key={index}
                    title={question.title}
                    description={question.description}
                    isOpen={openCardIndex === index}
                    onClick={() => toggleCard(index)}
                />
            ))}
        </section>
    );
};
