import { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

import { AuthContext } from "../../context/AuthContext.tsx";
import { useFirebaseCustomerId } from "../../hooks/useFirebaseCustomerId.ts";

export const SubscriptionPlans: React.FC = () => {
    const [selectedPlan] = useState<string | null>(null);
    const [ , setPrices] = useState([]);
    const { user } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const location = useLocation();

    const stripeCustomerId = useFirebaseCustomerId();

    useEffect(() => {
        const fetchPrices = async () => {
            const {prices} = await fetch('api/config').then(r => r.json());
            setPrices(prices);
        };
        fetchPrices();
    }, [])

    const apiUrl = import.meta.env.VITE_BACKEND_URL;

    const createSubscription = async (priceId: string) => {
        setIsLoading(true);

        if (!user) return;

        const token = await user.getIdToken();

        console.log(stripeCustomerId);

        const {subscriptionId, clientSecret} = await fetch(apiUrl + '/api/subscribe/create-subscription', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                priceId,
                userId: user.uid,
                customerEmail: user.email,
                customerId: stripeCustomerId,
            }),
        }).then(r => r.json());

        setIsLoading(false);

        navigate('/checkout', {
            state: {
                from: location,
                subscriptionId,
                clientSecret,
            },
            replace: false
        });
    }

    const Plans = [
        {
            id: import.meta.env.VITE_STRIPE_PRICE_ID_BASIC,
            name: "Basic Tier",
            price: 1,
            features: [
                "Advanced features",
                "Priority support",
                "Exclusive content"
            ]
        },
        {
            id: import.meta.env.VITE_STRIPE_PRICE_ID_PREMIUM,
            name: "Premium Tier",
            price: 10,
            features: [
                "All Premium features",
                "Team access",
                "24/7 support"
            ]
        }
    ];

    return (
        <div className="flex flex-col gap-8 my-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Plans.map(plan => (
                    <div
                        key={plan.id}
                        className={`p-6 rounded-lg border ${
                            selectedPlan === plan.id
                                ? "border-primary bg-primary/10"
                                : "border-secondary/20 hover:border-primary/40"
                        }`}
                    >
                        <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                        <p className="text-xl mb-4">${plan.price}/month</p>
                        <ul className="mb-6">
                            {plan.features.map(feature => (
                                <li key={feature} className="flex items-center gap-2 mb-2">
                                    <FontAwesomeIcon icon={faCircleCheck} className="text-green-500" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => createSubscription(plan.id)}
                            className="w-full py-2 rounded bg-primary text-secondary hover:bg-primary/90"
                            disabled={!user || isLoading}
                        >
                            {isLoading ? "Processing..." : selectedPlan === plan.id ? "Selected" : "Choose Plan"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};