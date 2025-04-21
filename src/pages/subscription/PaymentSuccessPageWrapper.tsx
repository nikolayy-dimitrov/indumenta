import { Elements } from '@stripe/react-stripe-js';
import { PaymentSuccessPage } from "./PaymentSuccessPage.tsx";
import { stripePromise } from "../../config/stripe.ts";

export const PaymentSuccessPageWrapper = () => {
    const clientSecret = new URLSearchParams(window.location.search)
        .get('payment_intent_client_secret')!;

    return (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
            <PaymentSuccessPage />
        </Elements>
    );
};
