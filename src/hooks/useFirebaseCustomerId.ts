import { useState, useEffect, useContext } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { AuthContext } from '../context/AuthContext';

/**
 * A custom React Hook that fetches and returns
 * the current user's stripeCustomerId from Firestore.
 */
export const useFirebaseCustomerId = (): string | null => {
    const [stripeCustomerId, setStripeCustomerId] = useState<string | null>(null);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (!user) {
            setStripeCustomerId(null);
            return;
        }

        const fetchCustomerId = async () => {
            const userRef = doc(db, 'users', user.uid);
            const snap = await getDoc(userRef);

            if (snap.exists()) {
                const data = snap.data();

                setStripeCustomerId(data.stripeCustomerId || null);
            } else {
                console.warn(`No user doc for UID ${user.uid}`);
                setStripeCustomerId(null);
            }
        };

        fetchCustomerId();
    }, [user]);

    return stripeCustomerId;
};
