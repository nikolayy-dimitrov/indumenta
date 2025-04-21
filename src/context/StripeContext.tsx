import { createContext, useState, useContext, ReactNode } from 'react';
import { toast } from 'react-toastify';
import {AuthContext} from "./AuthContext.tsx";

interface StripeContextType {
    clientSecret: string | null;
    isLoading: boolean;
    createSubscription: (priceId: string, userId: string, email: string) => Promise<void>;
}

const StripeContext = createContext<StripeContextType | null>(null);

export const useStripe = () => {
    const context = useContext(StripeContext);
    if (!context) {
        throw new Error('useStripe must be used within a StripeProvider');
    }
    return context;
};

interface StripeProviderProps {
    children: ReactNode;
}

export const StripeProvider = ({ children }: StripeProviderProps) => {
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const { user } = useContext(AuthContext);

    const apiUrl = import.meta.env.VITE_BACKEND_URL + '/api/subscribe/create-subscription';

    const createSubscription = async (priceId: string, userId: string, email: string) => {
        setIsLoading(true);

        const token = await user?.getIdToken();
        console.log(token);

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    priceId,
                    customerEmail: email,
                    userId
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const { client_secret: clientSecret } = await response.json();
            setClientSecret(clientSecret);
        } catch (error) {
            console.error("Subscription error:", error);
            toast.error(error instanceof Error ? error.message : "Failed to start subscription");
        } finally {
            setIsLoading(false);
        }
    };

    const value = {
        clientSecret,
        isLoading,
        createSubscription
    };

    return (
        <StripeContext.Provider value={value}>
            {children}
        </StripeContext.Provider>
    );
};