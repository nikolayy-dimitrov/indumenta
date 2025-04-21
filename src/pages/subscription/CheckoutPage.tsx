import { Navigate, useLocation } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';

import { stripePromise } from '../../config/stripe.ts';
import { PaymentForm } from '../../components/subscription/PaymentForm.tsx';

export const CheckoutPage = () => {
    const {
        state: {
            clientSecret,
        }
    } = useLocation();

    if (!clientSecret) {
        // Redirect back to subscription page if no client secret is available
        return <Navigate to="/profile" />;
    }

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Complete Your Subscription</h2>
            <Elements
                stripe={stripePromise}
                options={{ clientSecret }}
            >
                <PaymentForm />
            </Elements>
        </div>
    );
};