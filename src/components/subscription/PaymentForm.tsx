import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { FormEvent, useState } from 'react';

export const PaymentForm: React.FC = () => {
    const [isProcessing, setIsProcessing] = useState(false);

    const stripe = useStripe();
    const elements = useElements();

    if (!stripe || !elements) return;

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        // Confirm the payment using the clientSecret bound in <Elements>
        const { error } = await stripe!.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/payment-success`,
            },
            // (Optional) Only redirect if required:
            // redirect: 'if_required',
        });

        if (error) {
            // Display error to the customer
            console.error(error);
        }


        setIsProcessing(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 my-2">
            <div className="p-4 border rounded-lg">
                <PaymentElement />
            </div>
            <button
                type="submit"
                disabled={isProcessing || !stripe || !elements}
                className="w-full py-2 rounded bg-primary hover:bg-primary/90 disabled:bg-gray-400 text-secondary"
            >
                {isProcessing ? 'Processing...' : 'Subscribe Now'}
            </button>
        </form>
    );
};