import DragoneyeImage from "../../assets/HomePage/DragoneyeAILogo.png";
import ChatGPTImage from "../../assets/HomePage/ChatGPTLogo.png";

export const TechnologiesScreen = () => {
    return (
        <section id="technologies" className="bg-primary py-16 font-Josefin">
            <div className="w-11/12 mx-auto">
                <h2 className="text-4xl text-secondary text-center">Powered By</h2>
                <div className="grid md:grid-cols-2 items-center justify-center scale-50">
                    <div className="flex justify-center">
                        <img alt="Dragoneye AI Logo" src={DragoneyeImage} />
                    </div>
                    <div className="flex justify-center">
                        <img alt="Chat GPT Logo" src={ChatGPTImage} />
                    </div>
                </div>
            </div>
        </section>
    );
};
