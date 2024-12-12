import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectCards } from "swiper/modules";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { testimonialsData } from "../../data/HomePageData.ts";
import { buttonVariants, containerVariants, imageVariants, textVariants } from "../../utils/framerMotionUtils.ts";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import "swiper/css";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import "swiper/css/navigation";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import "swiper/css/pagination";

export const TestimonialScreen = () => {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: false });

    return (
        <section ref={sectionRef} id="testimonials" className="relative bg-primary text-secondary py-16 font-Josefin">
            <motion.div
                className="w-11/12 mx-auto"
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={containerVariants}
            >
                <h2 className="text-4xl mb-8 md:text-left max-md:text-center">What Our Users Say.</h2>

                {/* Swiper Carousel */}
                <Swiper
                    modules={[Navigation, Pagination, EffectCards]}
                    effect='cards'
                    cardsEffect={{
                        slideShadows: false,
                    }}
                    slidesPerView={1}
                    spaceBetween={10}
                    loop={true}
                    navigation={{
                        prevEl: ".btn-prev",
                        nextEl: ".btn-next",
                    }}
                    className="w-full swiper-hidden-cards"
                >
                    {testimonialsData.map((testimonial, index) => (
                        <SwiperSlide key={index}>
                            <div className="flex flex-col md:flex-row items-start gap-8">
                                {/* Testimonial Image */}
                                <motion.div
                                    className="flex-shrink-0 w-[300px] h-[400px] rounded-lg overflow-hidden max-md:mx-auto"
                                    initial="hidden"
                                    animate={isInView ? "visible" : "hidden"}
                                    variants={imageVariants}
                                >
                                    <img
                                        src={testimonial.portrait}
                                        alt={testimonial.name}
                                        className="object-cover w-full h-full"
                                    />
                                </motion.div>

                                {/* Testimonial Content */}
                                <motion.div
                                    className="p-6 bg-secondary text-primary rounded-lg shadow-md text-center md:text-left"
                                    initial='hidden'
                                    animate={isInView ? "visible" : "hidden"}
                                    variants={textVariants}
                                >
                                    <p className="italic">{testimonial.quote}</p>
                                    <p className="mt-4 font-bold">{testimonial.name}</p>
                                </motion.div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Navigation Buttons */}
                <motion.div
                    className="flex justify-center items-center mt-8 gap-2"
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    variants={buttonVariants}
                >
                    <button className="btn-prev text-primary bg-secondary px-2 py-1 rounded-2xl hover:text-secondary hover:bg-primary transition duration-200">
                        &#8592; {/* Left Arrow */}
                    </button>
                    <button className="btn-next text-primary bg-secondary px-2 py-1 rounded-2xl hover:text-secondary hover:bg-primary transition duration-200">
                        &#8594; {/* Right Arrow */}
                    </button>
                </motion.div>
            </motion.div>
        </section>
    );
};
