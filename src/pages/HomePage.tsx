import { HeroScreen } from "../screens/home/HeroScreen.tsx";
import { Features } from "../screens/home/FeaturesScreen.tsx";
import { HowItWorksScreen } from "../screens/home/HowItWorksScreen.tsx";
import { FaqScreen } from "../screens/home/FaqScreen.tsx";

import { Footer } from "../components/Footer.tsx";

export const Home = () => {
    return (
        <section id="home">
            <HeroScreen />
            <Features />
            <HowItWorksScreen />
            <FaqScreen />
            {/*<TechnologiesScreen />*/}
            <Footer />
        </section>
    );
};
