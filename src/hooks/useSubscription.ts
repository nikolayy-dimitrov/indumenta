import { useContext, useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { AuthContext } from "../context/AuthContext.tsx";

export const useSubscription = () => {
    const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
    const [periodEndDate, setPeriodEndDate] = useState<string | null>(null);
    const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
    const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState<boolean | null>(null);
    const [planAmount, setPlanAmount] = useState<number | null>(null);
    const [planInterval, setPlanInterval] = useState<string | null>(null);
    const [priceId, setPriceId] = useState<string | null>(null);

    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (!user) return;

        const userRef = doc(db, 'users', user.uid);

        const unsubscribe = onSnapshot(userRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
                const data = docSnapshot.data();

                if (!data) return;

                setSubscriptionStatus(data.subscriptionStatus ?? null);
                setSubscriptionId(data.subscriptionId ?? null);
                setCancelAtPeriodEnd(data.cancelAtPeriodEnd ?? null);
                setPlanAmount((data.planAmount / 100) || null);
                setPlanInterval(data.planInterval ?? null);
                setPriceId(data.priceId ?? null);

                // convert unix to readable time/date
                const timestamp = data?.currentPeriodEnd;
                if (timestamp) {
                    const date = new Date(timestamp * 1000);
                    // TODO: Fetch the real subscription end period
                    date.setMonth(date.getMonth() + 1); // Add one month
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
                setSubscriptionId(null);
                setPeriodEndDate(null);
                setCancelAtPeriodEnd(null);
                setPlanAmount(null);
                setPlanInterval(null);
                setPriceId(null);
            }
        }, (error) => {
            console.error("Error fetching subscription details: ", error);
            setSubscriptionStatus(null);
            setSubscriptionId(null);
            setPeriodEndDate(null);
            setCancelAtPeriodEnd(null);
            setPlanAmount(null);
            setPlanInterval(null);
            setPriceId(null);
        });

        return () => unsubscribe();
    }, [user]);

    return {
        subscriptionStatus,
        periodEndDate,
        subscriptionId,
        cancelAtPeriodEnd,
        planAmount,
        planInterval,
        priceId
    };
};
