import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    collection,
    doc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    increment,
    limit,
    orderBy,
    query,
    where,
    Timestamp,
    documentId
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref } from "firebase/storage";

import { db } from "../lib/config/firebaseConfig";
import {
    ClothingItem,
    OutfitFilter,
    OutfitItem,
    UseOutfitLikesReturn
} from "../types/wardrobe";

export const useClothes = (userId: string | undefined) => {
    const queryClient = useQueryClient();

    const { data: clothes = [], isLoading } = useQuery({
        queryKey: ['clothes', userId],
        queryFn: async () => {
            if (!userId) return [];
            const clothesRef = collection(db, "clothes");
            const q = query(clothesRef, where("userId", "==", userId));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as ClothingItem[];
        },
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
        queryFn: async () => {
            if (!userId && filter !== 'all') return [];

            const outfitsRef = collection(db, "outfits");
            let q;
            if (filter === 'owned' && userId) {
                q = query(outfitsRef, where("userId", "==", userId));
            } else if (filter === 'all') {
                q = query(outfitsRef, limit(50));
            } else {
                q = query(outfitsRef);
            }

            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    outfitPieces: data.outfit_pieces,
                    createdAt: data.createdAt,
                    match: data.match,
                    label: data.label,
                    stylePreferences: data.stylePreferences || {},
                    userId: data.userId,
                    likesCount: data.likesCount || 0
                } as OutfitItem;
            });
        },
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
        queryFn: async () => {
            if (!userId) return [];

            const likesQuery = query(
                collection(db, "userLikes"),
                where("userId", "==", userId)
            );
            const likesSnapshot = await getDocs(likesQuery);
            const likedIds = likesSnapshot.docs.map(doc => doc.data().outfitId as string);

            if (likedIds.length === 0) return [];

            const chunks: string[][] = [];
            for (let i = 0; i < likedIds.length; i += 30) {
                chunks.push(likedIds.slice(i, i + 30));
            }

            const outfitsRef = collection(db, "outfits");
            const chunkPromises = chunks.map(async (chunk) => {
                const q = query(outfitsRef, where(documentId(), "in", chunk));
                const snapshot = await getDocs(q);
                return snapshot.docs.map((doc) => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        outfitPieces: data.outfit_pieces,
                        createdAt: data.createdAt,
                        match: data.match,
                        label: data.label,
                        stylePreferences: data.stylePreferences || {},
                        userId: data.userId,
                        likesCount: data.likesCount || 0
                    } as OutfitItem;
                });
            });

            const resolvedChunks = await Promise.all(chunkPromises);
            return resolvedChunks.flat();
        },
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
        queryFn: async () => {
            const outfitsRef = collection(db, "outfits");
            const q = query(
                outfitsRef,
                where("likesCount", ">", 0),
                orderBy("likesCount", "desc"),
                limit(limitCount)
            );

            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    outfitPieces: data.outfit_pieces,
                    createdAt: data.createdAt,
                    match: data.match,
                    label: data.label,
                    stylePreferences: data.stylePreferences || {},
                    userId: data.userId,
                    likesCount: data.likesCount || 0
                } as OutfitItem;
            });
        }
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
        queryFn: async () => {
            if (!userId) return [];
            const outfitsRef = collection(db, "outfits");

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const q = query(
                outfitsRef,
                where('userId', '==', userId),
                where('scheduledDate', '>=', today)
            );

            const querySnapshot = await getDocs(q);
            const outfitsData = querySnapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    outfitPieces: data.outfit_pieces,
                    createdAt: data.createdAt,
                    match: data.match,
                    label: data.label,
                    stylePreferences: data.stylePreferences,
                    ...doc.data()
                } as OutfitItem;
            });

            return outfitsData.sort((a, b) => {
                const dateA = (a.scheduledDate as Timestamp).toDate();
                const dateB = (b.scheduledDate as Timestamp).toDate();
                return dateA.getTime() - dateB.getTime();
            });
        },
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
        queryFn: async () => {
            if (!userIds.length) return {};
            const uniqueUserIds = [...new Set(userIds)];
            const storage = getStorage();

            const photoPromises = uniqueUserIds.map(async (userId) => {
                try {
                    const fileName = `profilePhotos/${userId}`;
                    const storageRef = ref(storage, fileName);
                    const photoURL = await getDownloadURL(storageRef);
                    return { userId, photoURL };
                } catch (error) {
                    console.error(`Error fetching profile photo for ${userId}:`, error);
                    return { userId, photoURL: null };
                }
            });

            const photos = await Promise.all(photoPromises);
            return photos.reduce((acc, { userId, photoURL }) => {
                if (userId && photoURL) {
                    acc[userId] = photoURL;
                }
                return acc;
            }, {} as Record<string, string>);
        },
        enabled: userIds.length > 0,
    });

    return { userPhotos, isLoading, error: error as Error | null };
};

export const useOutfitLikes = (currentUserId: string | undefined | null): UseOutfitLikesReturn => {
    const queryClient = useQueryClient();

    const { data: likedOutfitIds = [], isLoading, error } = useQuery({
        queryKey: ['likedOutfits', currentUserId],
        queryFn: async () => {
            if (!currentUserId) return [];
            const likesQuery = query(
                collection(db, "userLikes"),
                where("userId", "==", currentUserId)
            );
            const snapshot = await getDocs(likesQuery);
            return snapshot.docs.map((doc) => doc.data().outfitId as string);
        },
        enabled: !!currentUserId,
    });

    const likeMutation = useMutation({
        mutationFn: async ({ outfitId, outfitOwnerId }: {
            outfitId: string,
            outfitOwnerId: string
        }) => {
            if (!currentUserId) throw new Error("User must be logged in");
            if (outfitOwnerId === currentUserId) throw new Error("Cannot like own outfit");
            if (likedOutfitIds.includes(outfitId)) throw new Error("Already liked");

            const outfitRef = doc(db, "outfits", outfitId);
            const userLikeRef = doc(db, "userLikes", `${currentUserId}_${outfitId}`);
            const outfitLikeRef = doc(db, "outfits", outfitId, "likes", currentUserId);

            await updateDoc(outfitRef, { likesCount: increment(1) });
            await setDoc(userLikeRef, {
                userId: currentUserId,
                outfitId: outfitId,
                timestamp: new Date()
            });
            await setDoc(outfitLikeRef, { userId: currentUserId, timestamp: new Date() });
            return outfitId;
        },
        onMutate: async ({ outfitId }) => {
            await queryClient.cancelQueries({ queryKey: ['likedOutfits', currentUserId] });
            const previousLikes = queryClient.getQueryData<string[]>(['likedOutfits', currentUserId]) || [];
            queryClient.setQueryData(['likedOutfits', currentUserId], [...previousLikes, outfitId]);
            return { previousLikes };
        },
        onError: (err, _variables, context) => {
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

            const outfitRef = doc(db, "outfits", outfitId);
            const userLikeRef = doc(db, "userLikes", `${currentUserId}_${outfitId}`);
            const outfitLikeRef = doc(db, "outfits", outfitId, "likes", currentUserId);

            await updateDoc(outfitRef, { likesCount: increment(-1) });
            await deleteDoc(userLikeRef);
            await deleteDoc(outfitLikeRef);
            return outfitId;
        },
        onMutate: async ({ outfitId }) => {
            await queryClient.cancelQueries({ queryKey: ['likedOutfits', currentUserId] });
            const previousLikes = queryClient.getQueryData<string[]>(['likedOutfits', currentUserId]) || [];
            queryClient.setQueryData(['likedOutfits', currentUserId], previousLikes.filter(id => id !== outfitId));
            return { previousLikes };
        },
        onError: (err, _variables, context) => {
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
        likeOutfit: async (outfitId: string, outfitOwnerId: string) => {
            await likeMutation.mutateAsync({ outfitId, outfitOwnerId });
        },
        unlikeOutfit: async (outfitId: string) => {
            await unlikeMutation.mutateAsync({ outfitId });
        },
        isOutfitLiked,
        canLikeOutfit
    };
};