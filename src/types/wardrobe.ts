import { Timestamp } from "firebase/firestore";

export type ViewMode = 'grid' | 'list';
export type ActiveCollection = 'clothes' | 'outfits';
export type SortOption = 'newest' | 'oldest' | 'color';
export type OutfitFilter = 'owned' | 'saved';

export interface ClothingItem {
    id: string;
    imageUrl: string;
    dominantColor: string;
    uploadedAt: Timestamp;
    userId: string;
    category: string;
    subCategory: string;
    season: string;
    labels: [];
}

export interface OutfitItem {
    id: string;
    label: string;
    outfitPieces: { Top: string; Bottom: string; Shoes: string };
    createdAt: Timestamp;
    match: number;
    stylePreferences: { color: string; occasion: string };
    userId: string;
    likesCount?: number;
    scheduledDate?: Timestamp;
}

export interface UseModalReturn {
    selectedClothingItem: ClothingItem | null;
    selectedOutfitItem: OutfitItem | null;
    isClothingModalVisible: boolean;
    isOutfitModalVisible: boolean;
    openClothingModal: (item: ClothingItem) => void;
    openOutfitModal: (item: OutfitItem) => void;
    closeModals: () => void;
}

export interface UseItemManagementProps {
    setClothes?: React.Dispatch<React.SetStateAction<ClothingItem[]>>;
    setOutfits?: React.Dispatch<React.SetStateAction<OutfitItem[]>>;
    setTrendingOutfits?: React.Dispatch<React.SetStateAction<OutfitItem[]>>;
    onClose: () => void;
}

export interface UseItemManagementReturn {
    deleteItem: (itemId: string, itemType: 'clothes' | 'outfits') => Promise<void>;
    confirmDelete: (itemId: string, itemType: 'clothes' | 'outfits') => void;
}