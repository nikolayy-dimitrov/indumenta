import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext.tsx";

interface UsageStats {
    imageUploads: {
        used: number;
        remaining: number;
        total: number;
    };
    outfitGenerations: {
        used: number;
        remaining: number;
        total: number;
    };
    subscriptionTier: string;
    resetsOn: string;
}

export const useFetchUsageData = () => {
    const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchUsageData = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);

                // Get auth token
                const token = await user.getIdToken();

                const apiUrl = import.meta.env.VITE_BACKEND_URL;

                // Make API request with auth token
                const response = await fetch(apiUrl + '/api/subscribe/user/usage', {
                    method: 'GET',
                    headers: {
                        "Content-Type": 'application/json',
                        "Authorization": `Bearer ${token}`
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setUsageStats(data);
                setError(null);
            } catch (error: any) {
                console.error('Error fetching usage data:', error);
                setError(error.message || 'Failed to load usage data');
                setUsageStats(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUsageData();
    }, [user]);

    return { usageStats, loading, error };
};