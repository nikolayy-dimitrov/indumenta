import { useContext, useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { AuthContext } from "../context/AuthContext.tsx";

export const useSubscription = () => {
    const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
    const [periodEndDate, setPeriodEndDate] = useState<string | null>(null);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (!user) return;

        const userRef = doc(db, 'users', user.uid);

        const unsubscribe = onSnapshot(userRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                setSubscriptionStatus(data?.subscriptionStatus ?? null);

                // convert unix to readable time/date
                const timestamp = data?.currentPeriodEnd;
                if (timestamp) {
                    const date = new Date(timestamp * 1000);
                    const formattedDate = date.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    });
                    setPeriodEndDate(formattedDate);
                } else {
                    setPeriodEndDate(null);
                }
            } else {
                setSubscriptionStatus(null);
                setPeriodEndDate(null);
            }
        }, (error) => {
            console.error("Error fetching subscription details: ", error);
            setSubscriptionStatus(null);
            setPeriodEndDate(null);
        });

        return () => unsubscribe();
    }, [user]);

    return { subscriptionStatus, periodEndDate };
};
