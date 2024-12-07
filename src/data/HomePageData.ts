import { CardData } from "./interfaces/common/CardData.ts";
import { TestimonialScreen } from "./interfaces/screens/TestimonialScreen.ts";

import { faShirt } from "@fortawesome/free-solid-svg-icons/faShirt";
import { faSquareCaretUp, faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";

import TestimonialOne from "../assets/HomePage/testimonialUserOne.jpg";
import TestimonialTwo from "../assets/HomePage/testimonialUserTwo.jpg";
import TestimonialThree from "../assets/HomePage/testimonialUserThree.jpg";

export const featuresData: CardData[] = [
    {
        title: "Organized Closet",
        description: "Effortlessly manage your wardrobe with categorized clothing for seasons, styles, and occasions.",
        icon: faShirt,
    },
    {
        title: "AI Outfit Suggestions",
        description: "Get personalized outfit ideas tailored to your wardrobe and preferences, powered by AI.",
        icon: faWandMagicSparkles,
    },
    {
        title: "Easy Uploads",
        description: "Quickly upload photos of your clothes for automatic classification and organization.",
        icon: faSquareCaretUp,
    }
]

export const testimonialsData: TestimonialScreen[] = [
    {
        name: '— Alex Johnson',
        quote: '"Indumenta revolutionized the way I organize my wardrobe!"',
        portrait: TestimonialOne,
    },
    {
        name: '— Maria Lopez',
        quote: '"The AI outfit suggestions are spot on. Love it!"',
        portrait: TestimonialTwo,
    },
    {
        name: '— Chris Taylor',
        quote: '"A must-have for anyone who loves fashion."',
        portrait: TestimonialThree,
    },
]