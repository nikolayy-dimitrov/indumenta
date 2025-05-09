import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword, UserCredential } from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

import { useEnterKey } from "../hooks/useEnterKey.ts";

export const EmailSignIn: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    const validateInputs = (): boolean => {
        if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('A valid email is required.');
            return false;
        }
        if (password.length < 6) {
            setError('Invalid password.');
            return false;
        }

        return true;
    };

    const handleEmailLogin = async () => {
        setError('');
        if (!validateInputs()) return;

        const apiUrl = import.meta.env.VITE_BACKEND_URL;
        try {
            const auth = getAuth();
            const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
            const userId = userCredential.user.uid;

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

    useEnterKey(handleEmailLogin);

    return (
            <div>
                {error &&
                    <div className="text-red-500 text-center text-sm py-1 mx-2">
                        {error}
                    </div>
                }
                <div className="mb-4">
                    <label htmlFor="email" className="block text-primary font-medium text-sm mb-2">
                        Email
                    </label>
                    <div className="relative">
                        <FontAwesomeIcon icon={faEnvelope}
                                         className="absolute top-1/2 transform -translate-y-1/2 left-3 text-primary/80" />
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
                <div className="mb-6">
                    <div className="flex items-center justify-between">
                        <label htmlFor="password" className="block text-primary font-medium text-sm mb-2">
                            Password
                        </label>
                        <Link
                            to='/authentication/forgot-password'
                            className="block text-primary font-light text-xs mb-2 transition duration-200 hover:underline">
                            Forgot Password?
                        </Link>
                    </div>
                    <div className="relative">
                        <FontAwesomeIcon icon={faLock}
                                         className="absolute top-1/2 transform -translate-y-1/2 left-3 text-primary/80" />
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
                <div className="flex items-center justify-between mb-2 py-2">
                    <button
                        className="py-2 px-4 text-secondary font-medium text-sm bg-primary
                        hover:bg-opacity-80 rounded-md transition duration-300 w-full focus:outline-primary"
                        type="button"
                        onClick={handleEmailLogin}
                    >
                        Sign In
                    </button>
                </div>
            </div>
    );
};