import React, { useState } from 'react';
import {
    getAuth,
    createUserWithEmailAndPassword,
    UserCredential, updateProfile,
} from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import {useEnterKey} from "../hooks/useEnterKey.ts";

export const EmailSignUp: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    function validatePassword(password: string): string | null {
        // 1) Check length
        if (password.length < 8) {
            return 'Password must be at least 8 characters long.';
        }

        // 2) Check for uppercase letter
        if (!/[A-Z]/.test(password)) {
            return 'Password must include at least one uppercase letter.';
        }

        // 3) Check for lowercase letter
        if (!/[a-z]/.test(password)) {
            return 'Password must include at least one lowercase letter.';
        }

        // 4) Check for digit
        if (!/\d/.test(password)) {
            return 'Password must include at least one number.';
        }

        // 5) Check for special character
        if (!/[!@#$%^&*(),.?":{}|<>_\-\\[\]/]/.test(password)) {
            return 'Password must include at least one special character.';
        }

        // All checks passed
        return null;
    }

    const validateInputs = (): boolean => {
        if (!name.trim()) {
            setError('Name is required.');
            return false;
        }
        if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('A valid email is required.');
            return false;
        }
        const pwdError = validatePassword(password);
        if (pwdError) {
            setError(pwdError);
            return false;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return false;
        }
        return true;
    };

    const handleRegister = async () => {
        setError('');
        if (!validateInputs()) return;

        const apiUrl = import.meta.env.VITE_BACKEND_URL;
        try {
            const auth = getAuth();
            const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
            // console.log('User registered:', userCredential.user);
            const userId = userCredential.user.uid;

            if (name) {
                await updateProfile(userCredential.user, { displayName: name });
            }

            await fetch(apiUrl + "/api/subscribe/create-customer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, userId }),
            }).then(r => r.json());

            window.location.href = '/profile';
        } catch (err) {
            setError((err as Error).message);
        }
    };

    useEnterKey(handleRegister);

    return (
        <div>
            {error &&
                <div className="text-red-500 text-center text-sm py-1 mx-2">
                    {error}
                </div>
            }
            <div className="mb-4">
                <label htmlFor="name" className="block text-primary font-semibold mb-2">
                    Name
                </label>
                <div className="relative">
                    <FontAwesomeIcon
                        icon={faUser}
                        className="absolute top-1/2 transform -translate-y-1/2 left-3 text-primary/80"
                    />
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="shadow bg-secondary border border-primary/20 rounded-md w-full py-2 pl-10 pr-3
                             text-primary placeholder:text-primary/60 leading-tight
                             focus:outline-primary/10"
                        placeholder="Your name"
                        required
                    />
                </div>
            </div>
            <div className="mb-4">
                <label htmlFor="email" className="block text-primary font-medium text-sm mb-2">
                    Email
                </label>
                <div className="relative">
                    <FontAwesomeIcon icon={faEnvelope}
                                     className="absolute top-1/2 transform -translate-y-1/2 left-3 text-primary/80"/>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="shadow bg-secondary border border-primary/20 rounded-md w-full py-2 pl-10 pr-3
                             text-primary placeholder:text-primary/60 leading-tight
                             focus:outline-primary/10"
                        placeholder="your@email.com"
                        required
                    />
                </div>
            </div>
            <div className="mb-4">
                <label htmlFor="password" className="block text-primary font-medium text-sm mb-2">
                    Password
                </label>
                <div className="relative">
                    <FontAwesomeIcon icon={faLock}
                                     className="absolute top-1/2 transform -translate-y-1/2 left-3 text-primary/80"/>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="shadow bg-secondary border border-primary/20 rounded-md w-full py-2 pl-10 pr-3
                             text-primary placeholder:text-primary/60 leading-tight
                             focus:outline-primary/10"
                        placeholder="••••••••"
                        required
                    />
                </div>
            </div>
            <div className="mb-4">
                <label htmlFor="password" className="block text-primary font-semibold mb-2">
                    Confirm Password
                </label>
                <div className="relative">
                    <FontAwesomeIcon icon={faLock}
                                     className="absolute top-1/2 transform -translate-y-1/2 left-3 text-primary/80"/>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="shadow bg-secondary border border-primary/20 rounded-md w-full py-2 pl-10 pr-3
                             text-primary placeholder:text-primary/60 leading-tight
                             focus:outline-primary/10"
                        placeholder="••••••••"
                        required
                    />
                </div>
            </div>
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="custom-checkbox"
                    required
                />
                <label htmlFor="custom-checkbox" className="text-sm font-medium">
                    I agree to the&nbsp;
                    <a
                        href="https://www.freeprivacypolicy.com/live/4e5fb20e-13f5-4300-ae43-bc628c45395e"
                        target="_blank"
                        className="transition duration-200 hover:underline"
                    >
                        Privacy Policy
                    </a>
                </label>
            </div>
            <div className="flex items-center justify-between mb-2 py-2">
                <button
                    className="py-2 px-4 text-secondary font-medium text-sm bg-primary
                        hover:bg-opacity-80 rounded-md transition duration-300 w-full focus:outline-primary"
                    type="button"
                    onClick={handleRegister}
                >
                    Sign Up
                </button>
            </div>
        </div>
    );
};
