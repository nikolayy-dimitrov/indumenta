import { CardData } from "./CardData.types.ts";

export interface FaqScreenProps extends CardData {
    isOpen: boolean;
    onClick: () => void;
}