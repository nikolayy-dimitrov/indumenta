import { db } from '../config/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export const getUserProfile = async (uid: string) => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
};