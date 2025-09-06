import { useEffect, useState } from "react";
import {
    collection,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    increment,
    limit,
    onSnapshot,
    orderBy,
    query,
    where,
    Timestamp
} from "firebase/firestore";
import { doc as firestoreDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref } from "firebase/storage";

import { db } from "../config/firebaseConfig";
import {
    ClothingItem,
    LikedOutfitsState,
    OutfitFilter,
    OutfitItem,
    UseOutfitLikesReturn
} from "../types/wardrobe";

export const useClothes = (userId: string | undefined) => {
    const [clothes, setClothes] = useState<ClothingItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            setIsLoading(false);
            return;
        }

        const clothesRef = collection(db, "clothes");
        const q = query(clothesRef, where("userId", "==", userId));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const clothesData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as ClothingItem[];

            setClothes(clothesData);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [userId]);

    return { clothes, isLoading, setClothes };
};

export const useOutfits = (userId: string | undefined, filter: OutfitFilter = 'owned') => {
    const [outfits, setOutfits] = useState<OutfitItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { savedOutfits, isLoading: isSavedLoading } = useSavedOutfits(userId);

    useEffect(() => {
        if (!userId && filter !== 'all') {
            setIsLoading(false);
            return;
        }

        if (filter === 'saved') {
            setOutfits(savedOutfits);
            setIsLoading(false);
            return;
        }

        const outfitsRef = collection(db, "outfits");

        let q;
        if (filter === 'owned' && userId) {
            q = query(outfitsRef, where("userId", "==", userId));
        } else if (filter === 'all') {
            q = query(outfitsRef, limit(50));
        } else {
            q = query(outfitsRef);
        }

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const outfitsData = querySnapshot.docs.map((doc) => {
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

            setOutfits(outfitsData);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [userId, filter, savedOutfits]);

    return { outfits, isLoading: isLoading || isSavedLoading, setOutfits };
};

export const useSavedOutfits = (userId: string | undefined) => {
    const [savedOutfits, setSavedOutfits] = useState<OutfitItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            setIsLoading(false);
            return;
        }

        const fetchSavedOutfits = async () => {
            try {
                const outfitsRef = collection(db, "outfits");
                const outfitsQuery = query(outfitsRef);

                const unsubscribe = onSnapshot(outfitsQuery, async (querySnapshot) => {
                    const outfitPromises = querySnapshot.docs.map(async (doc) => {
                        const outfitData = doc.data();
                        const likeRef = firestoreDoc(db, "outfits", doc.id, "likes", userId);
                        const likeDoc = await getDoc(likeRef);

                        if (likeDoc.exists()) {
                            return {
                                id: doc.id,
                                outfitPieces: outfitData.outfit_pieces,
                                createdAt: outfitData.createdAt,
                                match: outfitData.match,
                                label: outfitData.label,
                                stylePreferences: outfitData.stylePreferences || {},
                                userId: outfitData.userId,
                                likesCount: outfitData.likesCount || 0
                            } as OutfitItem;
                        }
                        return null;
                    });

                    const resolvedOutfits = (await Promise.all(outfitPromises)).filter((outfit): outfit is OutfitItem => outfit !== null);
                    setSavedOutfits(resolvedOutfits);
                    setIsLoading(false);
                });

                return () => unsubscribe();
            } catch (error) {
                console.error("Error fetching saved outfits:", error);
                setIsLoading(false);
            }
        };

        fetchSavedOutfits();
    }, [userId]);

    return { savedOutfits, isLoading, setSavedOutfits };
};

export const useTrendingOutfits = (limitCount: number = 10) => {
    const [trendingOutfits, setTrendingOutfits] = useState<OutfitItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const outfitsRef = collection(db, "outfits");

        const q = query(
            outfitsRef,
            where("likesCount", ">", 0),
            orderBy("likesCount", "desc"),
            limit(limitCount)
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const outfitsData = querySnapshot.docs.map((doc) => {
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

            setTrendingOutfits(outfitsData);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [limitCount]);

    return { trendingOutfits, isLoading, setTrendingOutfits };
};

export const useScheduledOutfits = (userId: string) => {
    const [scheduledOutfits, setScheduledOutfits] = useState<OutfitItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const outfitsRef = collection(db, "outfits");

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const q = query(
            outfitsRef,
            where('userId', '==', userId),
            where('scheduledDate', '>=', today)
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
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
            })
                .sort((a, b) => {
                    const dateA = (a.scheduledDate as Timestamp).toDate();
                    const dateB = (b.scheduledDate as Timestamp).toDate();
                    return dateA.getTime() - dateB.getTime();
                });
            setScheduledOutfits(outfitsData);
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, [userId])

    return { scheduledOutfits, isLoading, setScheduledOutfits };
};

export const useUserPhotos = (userIds: string[]) => {
    const [userPhotos, setUserPhotos] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!userIds.length) return;

        const uniqueUserIds = [...new Set(userIds)];
        setIsLoading(true);
        setError(null);

        const fetchUserPhotos = async () => {
            try {
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
                const photoMap = photos.reduce((acc, { userId, photoURL }) => {
                    if (userId && photoURL) {
                        acc[userId] = photoURL;
                    }
                    return acc;
                }, {} as Record<string, string>);

                setUserPhotos(photoMap);
            } catch (err) {
                console.error("Error in useUserPhotos hook:", err);
                setError(err instanceof Error ? err : new Error("Unknown error in useUserPhotos"));
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserPhotos();
    }, [userIds]);

    return { userPhotos, isLoading, error };
};

export const useOutfitLikes = (currentUserId: string | undefined | null): UseOutfitLikesReturn => {
    const [state, setState] = useState<LikedOutfitsState>({
        likedOutfitIds: [],
        isLoading: true,
        error: null
    });

    useEffect(() => {
        if (!currentUserId) {
            setState({
                likedOutfitIds: [],
                isLoading: false,
                error: null
            });
            return;
        }

        const likesQuery = query(
            collection(db, "userLikes"),
            where("userId", "==", currentUserId)
        );

        const unsubscribe = onSnapshot(
            likesQuery,
            (snapshot) => {
                try {
                    const likedIds = snapshot.docs.map((doc) => doc.data().outfitId);
                    setState({
                        likedOutfitIds: likedIds,
                        isLoading: false,
                        error: null
                    });
                } catch (error) {
                    console.error("Error getting liked outfits:", error);
                    setState((prev) => ({
                        ...prev,
                        isLoading: false,
                        error: error instanceof Error ? error : new Error("Failed to fetch liked outfits")
                    }));
                }
            },
            (error) => {
                console.error("Error in likes snapshot:", error);
                setState((prev) => ({
                    ...prev,
                    isLoading: false,
                    error: error
                }));
            }
        );

        return () => unsubscribe();
    }, [currentUserId]);

    /**
     * Like an outfit - updates the likesCount on the outfit and records the like
     */
    const likeOutfit = async (outfitId: string, outfitOwnerId: string): Promise<void> => {
        if (!currentUserId) {
            throw new Error("User must be logged in to like an outfit");
        }

        if (outfitOwnerId === currentUserId) {
            throw new Error("You cannot like your own outfit");
        }

        if (state.likedOutfitIds.includes(outfitId)) {
            throw new Error("You have already liked this outfit");
        }

        try {
            const outfitRef = doc(db, "outfits", outfitId);
            const userLikeRef = doc(db, "userLikes", `${currentUserId}_${outfitId}`);
            const outfitLikeRef = doc(db, "outfits", outfitId, "likes", currentUserId);

            await updateDoc(outfitRef, {
                likesCount: increment(1)
            });

            await setDoc(userLikeRef, {
                userId: currentUserId,
                outfitId: outfitId,
                timestamp: new Date()
            });

            await setDoc(outfitLikeRef, {
                userId: currentUserId,
                timestamp: new Date()
            });

            setState((prev) => ({
                ...prev,
                likedOutfitIds: [...prev.likedOutfitIds, outfitId]
            }));
        } catch (error) {
            console.error("Error liking outfit:", error);
            throw error instanceof Error ? error : new Error("Failed to like outfit");
        }
    };

    /**
     * Unlike an outfit - decrements the likesCount and removes the like record
     */
    const unlikeOutfit = async (outfitId: string): Promise<void> => {
        if (!currentUserId) {
            throw new Error("User must be logged in to unlike an outfit");
        }

        if (!state.likedOutfitIds.includes(outfitId)) {
            throw new Error("You have not liked this outfit");
        }

        try {
            const outfitRef = doc(db, "outfits", outfitId);
            const userLikeRef = doc(db, "userLikes", `${currentUserId}_${outfitId}`);
            const outfitLikeRef = doc(db, "outfits", outfitId, "likes", currentUserId);

            await updateDoc(outfitRef, {
                likesCount: increment(-1)
            });

            await deleteDoc(userLikeRef);

            await deleteDoc(outfitLikeRef);

            setState((prev) => ({
                ...prev,
                likedOutfitIds: prev.likedOutfitIds.filter(id => id !== outfitId)
            }));
        } catch (error) {
            console.error("Error unliking outfit:", error);
            throw error instanceof Error ? error : new Error("Failed to unlike outfit");
        }
    };

    /**
     * Check if the current user has liked a specific outfit
     */
    const isOutfitLiked = (outfitId: string): boolean => {
        return state.likedOutfitIds.includes(outfitId);
    };

    /**
     * Check if the current user can like an outfit (they can't like their own outfits)
     */
    const canLikeOutfit = (outfitOwnerId: string): boolean => {
        return currentUserId !== undefined && currentUserId !== outfitOwnerId;
    };

    return {
        likedOutfitIds: state.likedOutfitIds,
        isLoading: state.isLoading,
        error: state.error,
        likeOutfit,
        unlikeOutfit,
        isOutfitLiked,
        canLikeOutfit
    };
};