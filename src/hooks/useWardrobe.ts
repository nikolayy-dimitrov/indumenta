import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ClothingItem, OutfitFilter, OutfitItem, UseOutfitLikesReturn } from "../types/wardrobe";
import {
    fetchClothes,
    fetchOutfits,
    fetchSavedOutfits,
    fetchTrendingOutfits,
    fetchScheduledOutfits,
    fetchUserPhotos,
    fetchLikedOutfitIds,
    likeOutfitRecord,
    unlikeOutfitRecord
} from "../lib/api/wardrobe.service";

export const useClothes = (userId: string | undefined) => {
    const queryClient = useQueryClient();

    const { data: clothes = [], isLoading } = useQuery({
        queryKey: ['clothes', userId],
        queryFn: () => userId ? fetchClothes(userId) : Promise.resolve([]),
        enabled: !!userId,
    });

    const setClothes = (newData: ClothingItem[] | ((prev: ClothingItem[]) => ClothingItem[])) => {
        queryClient.setQueryData(['clothes', userId], newData);
    };

    return { clothes, isLoading, setClothes };
};

export const useOutfits = (userId: string | undefined, filter: OutfitFilter = 'owned') => {
    const queryClient = useQueryClient();
    const { savedOutfits, isLoading: isSavedLoading } = useSavedOutfits(userId);

    const { data: fetchedOutfits = [], isLoading: isFetchingOutfits } = useQuery({
        queryKey: ['outfits', userId, filter],
        queryFn: () => fetchOutfits(userId, filter),
        enabled: filter !== 'saved' && (filter === 'all' || !!userId),
    });

    const outfits = filter === 'saved' ? savedOutfits : fetchedOutfits;

    const sortedOutfits = [...outfits].sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);

    const setOutfits = (newData: OutfitItem[] | ((prev: OutfitItem[]) => OutfitItem[])) => {
        if (filter === 'saved') {
             queryClient.setQueryData(['savedOutfits', userId], newData);
        } else {
             queryClient.setQueryData(['outfits', userId, filter], newData);
        }
    };

    return {
        outfits: sortedOutfits,
        isLoading: filter === 'saved' ? isSavedLoading : isFetchingOutfits,
        setOutfits,
    };
};

export const useSavedOutfits = (userId: string | undefined) => {
    const queryClient = useQueryClient();

    const { data: savedOutfits = [], isLoading } = useQuery({
        queryKey: ['savedOutfits', userId],
        queryFn: () => userId ? fetchSavedOutfits(userId) : Promise.resolve([]),
        enabled: !!userId,
    });

    const setSavedOutfits = (newData: OutfitItem[] | ((prev: OutfitItem[]) => OutfitItem[])) => {
        queryClient.setQueryData(['savedOutfits', userId], newData);
    };

    return { savedOutfits, isLoading, setSavedOutfits };
};

export const useTrendingOutfits = (limitCount: number = 10) => {
    const queryClient = useQueryClient();

    const { data: trendingOutfits = [], isLoading } = useQuery({
        queryKey: ['trendingOutfits', limitCount],
        queryFn: () => fetchTrendingOutfits(limitCount),
    });

    const setTrendingOutfits = (newData: OutfitItem[] | ((prev: OutfitItem[]) => OutfitItem[])) => {
        queryClient.setQueryData(['trendingOutfits', limitCount], newData);
    };

    return { trendingOutfits, isLoading, setTrendingOutfits };
};

export const useScheduledOutfits = (userId: string) => {
    const queryClient = useQueryClient();

    const { data: scheduledOutfits = [], isLoading } = useQuery({
        queryKey: ['scheduledOutfits', userId],
        queryFn: () => userId ? fetchScheduledOutfits(userId) : Promise.resolve([]),
        enabled: !!userId,
    });

    const setScheduledOutfits = (newData: OutfitItem[] | ((prev: OutfitItem[]) => OutfitItem[])) => {
        queryClient.setQueryData(['scheduledOutfits', userId], newData);
    };

    return { scheduledOutfits, isLoading, setScheduledOutfits };
};

export const useUserPhotos = (userIds: string[]) => {
    const { data: userPhotos = {}, isLoading, error } = useQuery({
        queryKey: ['userPhotos', userIds],
        queryFn: () => fetchUserPhotos(userIds),
        enabled: userIds.length > 0,
    });

    return { userPhotos, isLoading, error: error as Error | null };
};

export const useOutfitLikes = (currentUserId: string | undefined | null): UseOutfitLikesReturn => {
    const queryClient = useQueryClient();

    const { data: likedOutfitIds = [], isLoading, error } = useQuery({
        queryKey: ['likedOutfits', currentUserId],
        queryFn: () => currentUserId ? fetchLikedOutfitIds(currentUserId) : Promise.resolve([]),
        enabled: !!currentUserId,
    });

    const likeMutation = useMutation({
        mutationFn: async ({ outfitId, outfitOwnerId }: { outfitId: string, outfitOwnerId: string }) => {
            if (!currentUserId) throw new Error("User must be logged in");
            if (outfitOwnerId === currentUserId) throw new Error("Cannot like own outfit");
            if (likedOutfitIds.includes(outfitId)) throw new Error("Already liked");
            return likeOutfitRecord(currentUserId, outfitId);
        },
        onMutate: async ({ outfitId }) => {
            await queryClient.cancelQueries({ queryKey: ['likedOutfits', currentUserId] });
            const previousLikes = queryClient.getQueryData<string[]>(['likedOutfits', currentUserId]) || [];
            queryClient.setQueryData(['likedOutfits', currentUserId], [...previousLikes, outfitId]);
            return { previousLikes };
        },
        onError: (err, variables, context) => {
            if (context?.previousLikes) {
                queryClient.setQueryData(['likedOutfits', currentUserId], context.previousLikes);
            }
            console.error("Error liking outfit:", err);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['likedOutfits', currentUserId] });
            queryClient.invalidateQueries({ queryKey: ['outfits'] });
            queryClient.invalidateQueries({ queryKey: ['trendingOutfits'] });
            queryClient.invalidateQueries({ queryKey: ['savedOutfits'] });
        }
    });

    const unlikeMutation = useMutation({
        mutationFn: async ({ outfitId }: { outfitId: string }) => {
            if (!currentUserId) throw new Error("User must be logged in");
            if (!likedOutfitIds.includes(outfitId)) throw new Error("Not liked");
            return unlikeOutfitRecord(currentUserId, outfitId);
        },
        onMutate: async ({ outfitId }) => {
            await queryClient.cancelQueries({ queryKey: ['likedOutfits', currentUserId] });
            const previousLikes = queryClient.getQueryData<string[]>(['likedOutfits', currentUserId]) || [];
            queryClient.setQueryData(['likedOutfits', currentUserId], previousLikes.filter(id => id !== outfitId));
            return { previousLikes };
        },
        onError: (err, variables, context) => {
            if (context?.previousLikes) {
                queryClient.setQueryData(['likedOutfits', currentUserId], context.previousLikes);
            }
            console.error("Error unliking outfit:", err);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['likedOutfits', currentUserId] });
            queryClient.invalidateQueries({ queryKey: ['outfits'] });
            queryClient.invalidateQueries({ queryKey: ['trendingOutfits'] });
            queryClient.invalidateQueries({ queryKey: ['savedOutfits'] });
        }
    });

    const isOutfitLiked = (outfitId: string): boolean => {
        return likedOutfitIds.includes(outfitId);
    };

    const canLikeOutfit = (outfitOwnerId: string): boolean => {
        return currentUserId !== undefined && currentUserId !== null && currentUserId !== outfitOwnerId;
    };

    return {
        likedOutfitIds,
        isLoading,
        error: error as Error | null,
        likeOutfit: async (outfitId: string, outfitOwnerId: string) => { await likeMutation.mutateAsync({ outfitId, outfitOwnerId }); },
        unlikeOutfit: async (outfitId: string) => { await unlikeMutation.mutateAsync({ outfitId }); },
        isOutfitLiked,
        canLikeOutfit
    };
};