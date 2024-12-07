import { HeroScreen } from "../screens/home/HeroScreen.tsx";
import { Features } from "../screens/home/FeaturesScreen.tsx";
import { TestimonialScreen } from "../screens/home/TestimonialScreen.tsx";

export const Home = () => {
    return (
        <section id="home">
            <HeroScreen />
            <Features />
            <TestimonialScreen />
        </section>
    );
};
