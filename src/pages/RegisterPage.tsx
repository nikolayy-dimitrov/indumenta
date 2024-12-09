import React, { useState } from 'react';
import {
    getAuth,
    createUserWithEmailAndPassword,
    UserCredential,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";

export const Register: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleRegister = async () => {
        try {
            const auth = getAuth();
            const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log('User registered:', userCredential.user);
            window.location.href = '/login';
        } catch (err) {
            setError((err as Error).message);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const auth = getAuth();
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            window.location.href = '/';
        } catch (err) {
            setError((err as Error).message);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen font-Josefin">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-secondary">Register for Indumenta</h2>
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
                        Name
                    </label>
                    <div className="relative">
                        <FontAwesomeIcon icon={faUser} className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Enter your name"
                        />
                    </div>
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
                        Email
                    </label>
                    <div className="relative">
                        <FontAwesomeIcon icon={faEnvelope} className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Enter your email"
                        />
                    </div>
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
                        Password
                    </label>
                    <div className="relative">
                        <FontAwesomeIcon icon={faLock} className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Enter your password"
                        />
                    </div>
                </div>
                <div className="flex items-center justify-between mb-2">
                    <button
                        className="bg-content hover:bg-content/90 text-secondary font-bold py-2 px-4 rounded transition"
                        type="button"
                        onClick={handleRegister}
                    >
                        Register
                    </button>
                    <button
                        className="text-secondary font-bold py-2 px-4"
                        type="button"
                        onClick={handleGoogleLogin}
                    >
                        Sign Up
                        <FontAwesomeIcon icon={faGoogle} className="ml-2"/>
                    </button>
                </div>
                <span className="text-secondary text-sm gap-1 flex">
                    Already have an account?
                    <Link to="/login" className="underline-offset-2 underline">
                        Login.
                    </Link>
                </span>
            </div>
        </div>
    );
};
