import { CardData } from "../stylist/common/CardData.ts";

export interface FaqScreenProps extends CardData {
    isOpen: boolean;
    onClick: () => void;
}