import { HeroScreen } from "../screens/home/HeroScreen.tsx";
import { Features } from "../screens/home/FeaturesScreen.tsx";
import { TestimonialScreen } from "../screens/home/TestimonialScreen.tsx";
import { HowItWorksScreen } from "../screens/home/HowItWorksScreen.tsx";
import { FaqScreen } from "../screens/home/FaqScreen.tsx";
import { TechnologiesScreen } from "../screens/home/TechnologiesScreen.tsx";

export const Home = () => {
    return (
        <section id="home">
            <HeroScreen />
            <Features />
            <TestimonialScreen />
            <HowItWorksScreen />
            <FaqScreen />
            <TechnologiesScreen />
        </section>
    );
};
