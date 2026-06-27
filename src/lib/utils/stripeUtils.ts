const fetchClientSecret = async (): Promise<string> => {
    const res = await fetch('/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    return data.clientSecret;
};

const appearance = {
    theme: 'stripe' as const,
};

export const checkoutOptions = {
    fetchClientSecret,
    elementsOptions: { appearance },
};