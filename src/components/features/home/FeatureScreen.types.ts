import { CardData } from "./CardData.types.ts";
import { MotionValue } from "framer-motion";

export interface FeatureScreenProps extends CardData {
    card: CardData;
    index: number;
    scrollY: MotionValue<number>;
}