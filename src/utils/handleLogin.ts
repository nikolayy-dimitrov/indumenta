import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

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