import React from "react";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OutfitItem } from "../../types/wardrobe";
import { useOutfitLikes } from "../../hooks/useWardrobe";

interface LikeHandlerProps {
    outfit: OutfitItem;
    currentUserId?: string | null;
    className?: string;
    title?: string;
}

export const LikeOutfitHandler = ({
                                      outfit,
                                      currentUserId,
                                      title,
                                      className = ""
                                  }: LikeHandlerProps) => {
    const {
        isOutfitLiked,
        canLikeOutfit,
        likeOutfit,
        unlikeOutfit
    } = useOutfitLikes(currentUserId);

    const handleToggleLike = async (e: React.MouseEvent) => {
        e.stopPropagation();

        try {
            if (!canLikeOutfit(outfit.userId)) {
                return;
            }

            if (isOutfitLiked(outfit.id)) {
                await unlikeOutfit(outfit.id);
            } else {
                await likeOutfit(outfit.id, outfit.userId);
            }
        } catch (error) {
            console.error("Error toggling like:", error);
            // TODO: Show error toast or message
        }
    };

    const liked = isOutfitLiked(outfit.id);
    const canLike = canLikeOutfit(outfit.userId);

    if (!currentUserId) {
        return null;
    }

    return (
        <button
            onClick={handleToggleLike}
            disabled={!currentUserId || !canLike}
            className={`flex items-center justify-center gap-2 p-2 transition-colors ${
                !currentUserId
                    ? "hidden"
                    : canLike
                        ? liked
                            ? "bg-primary hover:bg-primary/80"
                            : "bg-primary hover:bg-primary/80"
                        : "hidden"
            }
            ${!title ? 'rounded-full' : 'rounded-md'} 
            ${className}`}
        >
            {title && <span className="text-sm font-medium text-secondary">{title}</span>}
            <FontAwesomeIcon
                icon={faHeart}
                className={`h-4 w-4 ${liked ? "text-red-700" : "text-secondary"}`}
            />
        </button>
    );
};