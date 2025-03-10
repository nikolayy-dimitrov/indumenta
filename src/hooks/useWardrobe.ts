import { useEffect, useState } from "react";
import { collection, getDoc, limit, onSnapshot, orderBy, query, Timestamp, where } from "firebase/firestore";
import { doc as firestoreDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

import { ClothingItem, OutfitFilter, OutfitItem } from "../types/wardrobe";

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
        if (!userId) {
            setIsLoading(false);
            return;
        }

        const outfitsRef = collection(db, "outfits");
        const q = filter === 'owned'
            ? query(outfitsRef, where("userId", "==", userId))
            : query(outfitsRef);

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
                    userId: data.userId,
                    likesCount: data.likesCount
                } as OutfitItem;
            });

            if (filter === 'saved') {
                setOutfits(savedOutfits);
            } else {
                setOutfits(outfitsData);
            }
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
                                stylePreferences: outfitData.stylePreferences,
                                userId: outfitData.userId,
                                likesCount: outfitData.likesCount
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
            orderBy("match", "desc"),
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
                    stylePreferences: data.stylePreferences,
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
    })

    return { scheduledOutfits, isLoading, setScheduledOutfits };
};