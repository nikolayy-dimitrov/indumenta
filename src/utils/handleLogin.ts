import { getAuth, GoogleAuthProvider, signInWithPopup, signInAnonymously } from "firebase/auth";

export const handleGoogleLogin = async () => {
    const setError = String;
    setError('');
    try {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        window.location.href = '/';
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
}