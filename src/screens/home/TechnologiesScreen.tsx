import  {useRef } from "react";
import { motion, useInView } from "framer-motion";
import {containerVariants, imageVariants, textVariants} from "../../utils/framerMotionUtils.ts";

import DragoneyeImage from "../../assets/HomePage/DragoneyeAILogo.png";
import ChatGPTImage from "../../assets/HomePage/ChatGPTLogo.png";

export const TechnologiesScreen = () => {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true });

    return (
        <section ref={sectionRef} id="technologies" className="bg-primary py-16 font-Josefin">
            <motion.div
                className="w-11/12 mx-auto"
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={containerVariants}
            >
                <motion.h2
                    className="text-4xl text-secondary text-center"
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    variants={textVariants}
                >Powered By</motion.h2>
                <div
                    className="grid md:grid-cols-2 items-center justify-center scale-50 max-md:gap-12">
                    <motion.div
                        className="flex justify-center"
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                        variants={imageVariants}>
                        <img alt="Dragoneye AI Logo" src={DragoneyeImage} />
                    </motion.div>
                    <motion.div
                        className="flex justify-center"
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                        variants={imageVariants}
                    >
                        <img alt="Chat GPT Logo" src={ChatGPTImage} />
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
};
