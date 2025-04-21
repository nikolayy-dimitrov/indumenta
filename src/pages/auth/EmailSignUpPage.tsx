import React, { useState } from 'react';
import {
    getAuth,
    createUserWithEmailAndPassword,
    UserCredential,
} from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons';

import { motion } from 'framer-motion';
import { containerVariants } from "../../utils/framerMotionUtils.ts";
import { Link } from "react-router-dom";

export const EmailSignUp: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    const validateInputs = (): boolean => {
        if (!name.trim()) {
            setError('Name is required.');
            return false;
        }
        if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('A valid email is required.');
            return false;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
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
            console.log('User registered:', userCredential.user);
            const userId = userCredential.user.uid;

            await fetch(apiUrl + "/api/subscribe/create-customer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ customerEmail: email, userId }),
            }).then(r => r.json());

            window.location.href = '/sign-in';
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
                <h2 className="text-2xl font-bold mb-4 text-primary drop-shadow text-center">Sign Up</h2>
                {error && <div
                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">{error}</div>}
                <div className="mb-4">
                    <label htmlFor="name" className="block text-primary font-semibold mb-2">
                        Name
                    </label>
                    <div className="relative">
                        <FontAwesomeIcon icon={faUser}
                                         className="absolute top-1/2 transform -translate-y-1/2 left-3 text-secondary/60"/>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="shadow appearance-none border rounded-xl w-full py-2 pl-10 pr-3 text-secondary placeholder:text-secondary/60 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Enter your name"
                        />
                    </div>
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-primary font-semibold mb-2">
                        Email
                    </label>
                    <div className="relative">
                        <FontAwesomeIcon icon={faEnvelope}
                                         className="absolute top-1/2 transform -translate-y-1/2 left-3 text-secondary/60"/>
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
                                         className="absolute top-1/2 transform -translate-y-1/2 left-3 text-secondary/60"/>
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
                <div className="mb-6">
                    <label htmlFor="password" className="block text-primary font-semibold mb-2">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <FontAwesomeIcon icon={faLock}
                                         className="absolute top-1/2 transform -translate-y-1/2 left-3 text-secondary/60"/>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="shadow appearance-none border rounded-xl w-full py-2 pl-10 pr-3 text-secondary placeholder:text-secondary/60 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Enter your password"
                        />
                    </div>
                </div>
                <div className="flex items-center justify-between mb-2 py-2">
                    <button
                        className="bg-gradient-to-br from-primary-blue to-primary text-secondary font-semibold border border-primary py-2 px-4 rounded-xl transition w-full"
                        type="button"
                        onClick={handleRegister}
                    >
                        Sign Up
                    </button>
                </div>
                <span className="text-secondary text-sm gap-1 flex">
                    Already have an account?
                    <Link to="/sign-in" className="underline-offset-2 underline">
                        Sign In
                    </Link>
                </span>
            </div>
        </motion.div>
    );
};
