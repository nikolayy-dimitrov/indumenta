import React, { useState } from "react";
import { faqData } from "../../data/HomePageData.ts";
import { FaqScreenProps } from "../../data/interfaces/screens/FaqScreen.ts";

export const FaqScreen = () => {
    const [openCardIndex, setOpenCardIndex] = useState<number | null>(null);

    const toggleCard = (index: number) => {
        setOpenCardIndex(openCardIndex === index ? null : index);
    };

    const Card: React.FC<FaqScreenProps> = ({title, description, isOpen, onClick}) => {
        return (
            <div
                className="border-b border-primary py-4 px-2 md:w-1/2"
                onClick={onClick}
            >
                <div
                    className="flex items-center md:text-xl max-md:text-lg max-md:leading-tight cursor-pointer justify-between font-bold"
                    onClick={onClick}>
                    <span>{title}</span>
                    <span>{isOpen ? '−' : '+'}</span>
                </div>
                {isOpen && (
                    <div className="pt-2 md:text-lg max-md:text-sm font-normal col-span-2 text-primary/70">
                        {description}
                    </div>
                )}
            </div>
        )
    }

    return (
        <section id="faq" className="w-11/12 mx-auto font-Josefin py-16">
            <h2 className="text-5xl leading-tight text-right mb-8">Frequently<br /> Asked<br /> Questions</h2>
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
