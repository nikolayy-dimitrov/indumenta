import { CardData } from "./interfaces/common/CardData.ts";
import { TestimonialScreen } from "./interfaces/screens/TestimonialScreen.ts";
import { HowItWorksScreen } from "./interfaces/screens/HowItWorksScreen.ts";

import { faShirt } from "@fortawesome/free-solid-svg-icons/faShirt";
import { faSquareCaretUp, faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";

import TestimonialOne from "../assets/HomePage/testimonialUserOne.jpg";
import TestimonialTwo from "../assets/HomePage/testimonialUserTwo.jpg";
import TestimonialThree from "../assets/HomePage/testimonialUserThree.jpg";

import UploadScreen from "../assets/HomePage/UploadScreen.png";
import WardrobeImage from "../assets/HomePage/WardrobeImage.jpeg";
import OutfitDisplayScreen from "../assets/HomePage/OutfitDisplayScreen.png";

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

export const howItWorksData: HowItWorksScreen[] = [
    {
        step: 1,
        stepLabel: 'Upload Your Clothes',
        description: 'Simply take photos of your clothes and upload them into the app. Whether it\'s shirts, pants, or accessories, our intuitive interface makes the process quick and easy.',
        image: UploadScreen,
    },
    {
        step: 2,
        stepLabel: 'Let AI Analyze Your Wardrobe',
        description: 'Once uploaded, our AI-powered system scans your clothes and categorizes them by type, color, and style. It even identifies seasonal trends to help you make the most of your wardrobe.',
        image: WardrobeImage,
    },
    {
        step: 3,
        stepLabel: 'Get Outfit Suggestions or Organize Your Closet',
        description: 'With your wardrobe fully analyzed, the app suggests perfect outfit combinations for any occasion, or you can organize your closet by season, color, or style to easily find what you need.',
        image: OutfitDisplayScreen,
    },
]

export const faqData: CardData[] = [
    {
        title: "How do I upload my wardrobe?",
        description: "Uploading your wardrobe is easy! Simply click the \"Stylist\" button on the homepage, select photos of your clothing, and our app will take care of the rest. We’ll analyze your items and organize them for you.",
    },
    {
        title: "What types of clothes does the AI recognize?",
        description: "Our AI is trained to recognize a wide variety of clothing items, including tops, bottoms, dresses, outerwear, shoes, and accessories. It also identifies patterns, colors, and styles to help curate outfits.",
    },
    {
        title: "Is my data secure?",
        description: "Absolutely! We take your privacy seriously. Your photos and data are securely stored and are only used to enhance your experience with our app. We never share your information with third parties.",
    },
    {
        title: "Can I edit or delete items after uploading them?",
        description: "Yes, you can! Navigate to your wardrobe, select an item you’d like to modify, and use the edit or delete options to make changes at any time.",
    },
    {
        title: "How does the AI generate outfit suggestions?",
        description: "Our AI uses advanced algorithms to match your wardrobe items based on color theory, seasonal trends, and your personal style preferences. It ensures you always look your best!",
    },
    {
        title: "Can I access my wardrobe on multiple devices?",
        description: "Yes! Your account syncs across devices, so you can access your wardrobe and outfit suggestions from anywhere, whether on your phone, tablet, or computer.",
    },
    {
        title: "What if the AI misidentifies an item?",
        description: "No problem! You can manually adjust the item's category, name, or attributes through the wardrobe editor. Your input helps improve the AI's accuracy over time.",
    },
    {
        title: "Do I need an internet connection to use the app?",
        description: "While some features, like uploading and AI analysis, require an internet connection, you can browse your wardrobe and access previously generated outfit suggestions offline.",
    },
]