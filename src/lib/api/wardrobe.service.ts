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
import { db } from "../config/firebaseConfig";
import { ClothingItem, OutfitFilter, OutfitItem } from "../../types/wardrobe";

export const fetchClothes = async (userId: string): Promise<ClothingItem[]> => {
    const clothesRef = collection(db, "clothes");
    const q = query(clothesRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as ClothingItem[];
};

export const fetchOutfits = async (userId: string | undefined, filter: OutfitFilter): Promise<OutfitItem[]> => {
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
};

export const fetchSavedOutfits = async (userId: string): Promise<OutfitItem[]> => {
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
};

export const fetchTrendingOutfits = async (limitCount: number): Promise<OutfitItem[]> => {
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
};

export const fetchScheduledOutfits = async (userId: string): Promise<OutfitItem[]> => {
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
};

export const fetchUserPhotos = async (userIds: string[]): Promise<Record<string, string>> => {
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
};

export const fetchLikedOutfitIds = async (userId: string): Promise<string[]> => {
    const likesQuery = query(
        collection(db, "userLikes"),
        where("userId", "==", userId)
    );
    const snapshot = await getDocs(likesQuery);
    return snapshot.docs.map((doc) => doc.data().outfitId as string);
};

export const likeOutfitRecord = async (userId: string, outfitId: string): Promise<string> => {
    const outfitRef = doc(db, "outfits", outfitId);
    const userLikeRef = doc(db, "userLikes", `${userId}_${outfitId}`);
    const outfitLikeRef = doc(db, "outfits", outfitId, "likes", userId);

    await updateDoc(outfitRef, { likesCount: increment(1) });
    await setDoc(userLikeRef, { userId: userId, outfitId: outfitId, timestamp: new Date() });
    await setDoc(outfitLikeRef, { userId: userId, timestamp: new Date() });
    return outfitId;
};

export const unlikeOutfitRecord = async (userId: string, outfitId: string): Promise<string> => {
    const outfitRef = doc(db, "outfits", outfitId);
    const userLikeRef = doc(db, "userLikes", `${userId}_${outfitId}`);
    const outfitLikeRef = doc(db, "outfits", outfitId, "likes", userId);

    await updateDoc(outfitRef, { likesCount: increment(-1) });
    await deleteDoc(userLikeRef);
    await deleteDoc(outfitLikeRef);
    return outfitId;
};
