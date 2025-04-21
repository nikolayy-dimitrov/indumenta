import { useStripe } from "@stripe/react-stripe-js";
import {Link} from "react-router-dom";

export const PaymentSuccessPage = () => {
    const stripe = useStripe();

    const clientSecret = new URLSearchParams(window.location.search).get(
        'payment_intent_client_secret'
    );

    const intentId = new URLSearchParams(window.location.search).get(
        'payment_intent'
    );

    stripe?.retrievePaymentIntent(clientSecret!).then(({paymentIntent}) => {
        const message = document.querySelector('#message')

        switch (paymentIntent?.status) {
            case 'succeeded':
                message!.innerHTML = 'Success! Payment received.';
                break;
            case 'processing':
                message!.innerHTML = "Payment processing. We'll update you when payment is received.";
                break;

            case 'requires_payment_method':
                message!.innerHTML = 'Payment failed. Please try another payment method.';
                break;

            default:
                message!.innerHTML = 'Something went wrong.';
                break;
        }
    });

    return (
        <section id='payment-success' className="w-11/12 mx-auto flex items-center justify-center md:mt-12 max-md:mt-24 font-Josefin">
            <div className="text-center">
                <h1 className="text-4xl font-bold">
                    Thank you for your purchase!
                </h1>
                <p className="text-md font-light mt-1">
                    Your payment {intentId} was successful. 🎉
                </p>
                <Link
                    to='/profile'
                    className="hover:underline underline-offset-2 font-semibold text-2xl p-2"
                >
                    <p className="mt-4">Back to Profile</p>
                </Link>
            </div>
        </section>
    );
};
