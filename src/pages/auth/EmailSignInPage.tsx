import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

import { containerVariants } from "../../utils/framerMotionUtils.ts";

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

        try {
            const auth = getAuth();
            await signInWithEmailAndPassword(auth, email, password);
            window.location.href = '/';
        } catch (err) {
            setError((err as Error).message);
        }
    };

    return (
        <motion.div
            className="w-11/12 mx-auto flex items-center justify-center md:mt-12 max-md:mt-24 font-Josefin"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <div className="bg-gradient-to-tl from-primary/40 via-primary-blue/60 to-primary/40
            border-t-2 border-l-2 border-b-4 border-r-4 border-t-primary/50 border-l-primary/50 border-primary-blue/60
            shadow-lg rounded-3xl p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-primary drop-shadow text-center">Sign In</h2>
                {error &&
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
                <div className="mb-4">
                    <label htmlFor="email" className="block text-primary font-semibold mb-2">
                        Email
                    </label>
                    <div className="relative">
                        <FontAwesomeIcon icon={faEnvelope}
                                         className="absolute top-1/2 transform -translate-y-1/2 left-3 text-secondary/60" />
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="shadow appearance-none border rounded-xl w-full py-2 pl-10 pr-3 text-secondary placeholder:text-secondary/60 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Enter your email"
                        />
                    </div>
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block text-primary font-semibold mb-2">
                        Password
                    </label>
                    <div className="relative">
                        <FontAwesomeIcon icon={faLock}
                                         className="absolute top-1/2 transform -translate-y-1/2 left-3 text-secondary/60" />
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="shadow appearance-none border rounded-xl w-full py-2 pl-10 pr-3 text-secondary placeholder:text-secondary/60 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Enter your password"
                        />
                    </div>
                </div>
                <div className="flex items-center justify-between mb-2 py-2">
                    <button
                        className="bg-gradient-to-br from-primary-blue to-primary text-secondary font-semibold border border-primary py-2 px-4 rounded-xl transition w-full"
                        type="button"
                        onClick={handleEmailLogin}
                    >
                        Login
                    </button>
                </div>
                <span className="text-secondary text-sm gap-1 flex">
                    Don't have an account?
                    <Link to="/sign-up" className="underline-offset-2 underline">
                        Sign Up
                    </Link>
                </span>
            </div>
        </motion.div>
    );
};