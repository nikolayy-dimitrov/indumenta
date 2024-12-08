import { CardData } from "../common/CardData.ts";

export interface FaqScreenProps extends CardData {
    isOpen: boolean;
    onClick: () => void;
}