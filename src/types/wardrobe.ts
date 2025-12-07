import { Timestamp } from "firebase/firestore";

export type ViewMode = 'grid' | 'list';
export type ActiveCollection = 'clothes' | 'outfits';
export type SortOption = 'newest' | 'oldest' | 'color';
export type OutfitFilter = 'all' | 'saved' | 'owned';
export type ShowMode = "trending" | "community" | "following";

export interface ClothingImage {
    userId: string;
    imageUrl: string;
    thumbnailUrl: string;
    mediumUrl: string;
    largeUrl: string;
    originalUrl?: string;
    uploadedAt: Timestamp;
    status: string;
}

export interface ClothingItem extends ClothingImage {
    id: string;
    analysis?: {
        category: string;
        subCategory?: string;
        color: string;
        secondaryColor?: string;
        occasion: string[];
        season: string[];
    }
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

export interface LikedOutfitsState {
    likedOutfitIds: string[];
    isLoading: boolean;
    error: Error | null;
}

export interface UseOutfitLikesReturn {
    likedOutfitIds: string[];
    isLoading: boolean;
    error: Error | null;
    likeOutfit: (outfitId: string, outfitOwnerId: string) => Promise<void>;
    unlikeOutfit: (outfitId: string) => Promise<void>;
    isOutfitLiked: (outfitId: string) => boolean;
    canLikeOutfit: (outfitOwnerId: string) => boolean;
}