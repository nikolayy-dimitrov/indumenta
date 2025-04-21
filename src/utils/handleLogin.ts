import { getAuth, GoogleAuthProvider, signInWithPopup, signInAnonymously } from "firebase/auth";

const apiUrl = import.meta.env.VITE_BACKEND_URL;

export const handleGoogleLogin = async () => {
    const setError = String;
    setError('');
    try {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);

        const email = result.user.email;
        const userId = result.user.uid;

        await fetch(apiUrl + "/api/subscribe/create-customer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ customerEmail: email, userId }),
        }).then(r => r.json());

        window.location.href = '/stylist';
    } catch (err) {
        setError((err as Error).message);
    }
};

export const handleAnonymousLogin = async () => {
    const setError = String;
    setError('');
    try {
        const auth = getAuth();
        await signInAnonymously(auth);
        window.location.href = '/stylist';
    } catch (err) {
        setError((err as Error).message);
    }
};
