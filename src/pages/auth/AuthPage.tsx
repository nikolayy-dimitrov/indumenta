import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faApple, faGoogle } from "@fortawesome/free-brands-svg-icons";

import { handleGoogleLogin } from "../../utils/handleLogin.ts";
import { EmailSignIn } from "../../components/EmailSignIn.tsx";
import { EmailSignUp } from "../../components/EmailSignUp.tsx";

type AuthMode = 'login' | 'register';

export const AuthPage: React.FC = () => {
    const [authMode, setAuthMode] = useState<AuthMode>('login');

    const handleToggleMode = (mode: AuthMode) => {
        setAuthMode(mode);
    };

    return (
        <section id="auth-page" className="flex flex-col items-center justify-center m-auto h-full px-4 w-full max-w-lg">
            {/* Header */}
            <div className="flex flex-col items-center justify-center my-4">
                <h1 className="text-4xl font-bold uppercase">
                    INDUMENTA
                </h1>
                <p className="text-sm font-light lowercase">
                    Manage your style, digitally
                </p>
            </div>

            {/* Tabs */}
            <div className="flex items-center justify-center w-full my-2 py-1 px-1 bg-primary/20 rounded-lg">
                <div
                    className={`flex-1 text-center font-medium cursor-pointer py-2 rounded-lg
                    ${authMode === 'login' ? 'bg-secondary text-primary' : ''}`}
                    onClick={() => handleToggleMode('login')}
                >
                    <span
                        className={`${authMode === 'login' ? 'text-primary' : 'text-primary/40'}`}
                    >
                        Sign In
                    </span>
                </div>
                <div
                    className={`flex-1 text-center font-medium cursor-pointer py-2 rounded-lg 
                    ${authMode === 'register' ? 'bg-secondary text-primary' : ''}`}
                    onClick={() => handleToggleMode('register')}
                >
                    <span
                        className={`${authMode === 'register' ? 'text-primary' : 'text-primary/40'}`}
                    >
                        Sign Up
                    </span>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center w-full my-2 py-6 px-4 border border-primary/20 shadow-sm rounded-lg">
                <div className="w-full">
                    {authMode === 'login' ? (
                        <EmailSignIn />
                    ) : (
                        <EmailSignUp />
                    )}
                </div>

                <div className="flex flex-col items-center justify-center gap-4 w-full">
                    <div className="border-t w-full text-center py-1 -mb-2">
                        <span className="uppercase font-light text-sm">Or continue with</span>
                    </div>

                    <div className="flex w-full justify-center gap-4 sm:flex-row flex-col">
                        <button
                            className="flex-1 cursor-pointer border py-2 px-4 rounded-md transition duration-300 hover:bg-primary/10 flex items-center justify-center"
                            onClick={handleGoogleLogin}
                        >
                            <FontAwesomeIcon icon={faGoogle} className="mr-2" />
                            <span>Google</span>
                        </button>
                        <button
                            className="flex-1 cursor-not-allowed border py-2 px-4 rounded-md transition duration-300 hover:bg-primary/10 flex items-center justify-center"
                        >
                            <FontAwesomeIcon icon={faApple} className="mr-2" />
                            <span>Apple</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};