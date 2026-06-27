import { HeroScreen } from "../components/features/home/HeroScreen.tsx";
import { Features } from "../components/features/home/FeaturesScreen.tsx";
import { HowItWorksScreen } from "../components/features/home/HowItWorksScreen.tsx";
import { FaqScreen } from "../components/features/home/FaqScreen.tsx";

import { Footer } from "../components/features/navigation/Footer.tsx";

export const Home = () => {
    return (
        <section id="home">
            <HeroScreen />
            {/* TODO: Fix gradient merging between sections */}
            <Features />
            <HowItWorksScreen />
            <FaqScreen />
            {/*<TechnologiesScreen />*/}
            <Footer />
        </section>
    );
};
