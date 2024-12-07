import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { featuresData } from "../../data/HomePageData.ts";

export const Features = () => {
    return (
        <section id="features" className="w-full bg-primary md:-mt-16 max-md:-mt-28 p-16">
            <h2 className="text-secondary text-5xl text-center mb-12">
                Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
                {featuresData.map((card, index) => (
                    <div
                        key={index}
                        className="group flex flex-col items-center
                        text-center bg-secondary text-primary rounded-lg px-8 py-32 shadow-lg
                        transition-all duration-300 hover:bg-primary hover:text-secondary
                        hover:scale-95 hover:border-2 border-secondary"
                    >
                        <div
                            className="bg-primary text-secondary w-16 h-16 flex items-center justify-center rounded-full mb-4 transition-colors duration-300 group-hover:bg-secondary group-hover:text-primary">
                            <FontAwesomeIcon icon={card.icon} size="2x"/>
                        </div>
                        <h3 className="text-xl font-semibold mb-2 transition-colors duration-300 group-hover:text-secondary">
                            {card.title}
                        </h3>
                        <p className="text-sm text-primary/70 transition-colors duration-300 group-hover:text-secondary/70">
                            {card.description}
                        </p>
                    </div>
                ))}
            </div>

            tsx
            Copy code
            <div className="mt-16 text-center">
                <p className="text-lg italic text-secondary/70">
                    "Style is a way to say who you are without having to speak."
                </p>
                <p className="text-sm text-secondary/50 mt-2">— Rachel Zoe</p>
            </div>
        </section>
    );
};
