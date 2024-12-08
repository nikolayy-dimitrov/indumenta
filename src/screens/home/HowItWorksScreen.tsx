import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";

import { howItWorksData } from "../../data/HomePageData.ts";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import "swiper/css";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import "swiper/css/mousewheel";

export const HowItWorksScreen = () => {
    return (
        <section id="how-it-works" className="font-Josefin text-primary w-11/12 mx-auto py-16">
            <h2 className="text-4xl md:text-left max-md:text-center mb-8">Take your style to the next level.</h2>

            <Swiper
                modules={[Mousewheel]}
                direction="vertical"
                slidesPerView={1}
                spaceBetween={20}
                speed={1000}
                mousewheel={{forceToAxis: true, releaseOnEdges: true}}
                className="md:h-[650px] max-md:h-screen"
            >
                {howItWorksData.map((step, index) => (
                    <SwiperSlide key={index} className="flex flex-col items-center">
                        <div className="grid md:grid-cols-2 items-center gap-8">
                            {/* Step Text */}
                            <div>
                                <h3 className="mb-2 text-2xl">Step {step.step}</h3>
                                <h4 className="text-3xl font-semibold md:text-4xl mb-4">{step.stepLabel}</h4>
                                <p className="text-lg">{step.description}</p>
                            </div>

                            {/* Step Image */}
                            <div className="flex justify-center">
                                <img
                                    src={step.image}
                                    alt={step.stepLabel}
                                    className="w-full max-w-sm rounded-2xl shadow-md"
                                />
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};