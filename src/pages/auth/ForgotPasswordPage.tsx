import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { sendPasswordResetEmail } from "firebase/auth"
import { auth } from "../../config/firebaseConfig.ts";

export const ForgotPasswordPage = () => {
    const [email, setEmail] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [emailSent, setEmailSent] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const navigate = useNavigate();

    const handleReset = async () => {
        if (!email.trim()) {
            setError("Please enter your email address.");
            return;
        }

        try {
            setLoading(true);
            // The optional ActionCodeSettings parameter configures the reset link
            const actionCodeSettings = {
                // URL you want to redirect to after password reset is complete
                url: window.location.origin + '/authentication',
                // This must be true for the link to work properly
                handleCodeInApp: false
            };

            await sendPasswordResetEmail(auth, email, actionCodeSettings);
            setEmailSent(true);
            setError('');
            setLoading(false);
        } catch (err) {
            setError((err as Error).message);
            setLoading(false);
        }
    }

    // If email was sent successfully, show a confirmation message
    if (emailSent) {
        return (
            <section
                id="forgot-password"
                className="flex flex-col items-center justify-center m-auto h-full px-4 w-full max-w-lg"
            >
                <div className="flex flex-col items-center justify-center my-4">
                    <h1 className="text-4xl font-bold uppercase">
                        INDUMENTA
                    </h1>
                    <p className="text-sm font-light lowercase">
                        Reset Your Password
                    </p>
                </div>
                <div
                    className="flex flex-col items-center justify-center w-full my-2 py-6 px-6 border border-primary/20 shadow-sm rounded-lg">
                    <div className="text-center mb-4 space-y-2">
                        <h2 className="font-medium text-2xl">Check Your Email</h2>
                        <p className="font-light text-sm opacity-60">
                            We've sent a password reset link to <span className="font-medium">{email}</span>.
                            The link will expire after 1 hour.
                        </p>
                    </div>
                    <div className="mb-4 w-full space-y-4">
                        <button
                            className="py-2 px-4 text-secondary font-medium text-sm bg-primary
                            hover:bg-opacity-80 rounded-md transition duration-300 w-full focus:outline-primary"
                            type="button"
                            onClick={() => navigate('/authentication')}
                        >
                            Return to Login
                        </button>
                        <button
                            className="py-2 px-4 text-primary font-medium text-sm border border-primary
                            hover:bg-primary/10 rounded-md transition duration-300 w-full focus:outline-primary"
                            type="button"
                            onClick={() => {
                                setEmailSent(false);
                                setEmail('');
                            }}
                        >
                            Try Another Email
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section
            id="forgot-password"
            className="flex flex-col items-center justify-center m-auto h-full px-4 w-full max-w-lg"
        >
            <div className="flex flex-col items-center justify-center my-4">
                <h1 className="text-4xl font-bold uppercase">
                    INDUMENTA
                </h1>
                <p className="text-sm font-light lowercase">
                    Reset Your Password
                </p>
            </div>
            <div
                className="flex flex-col items-center justify-center w-full my-2 py-6 px-6 border border-primary/20 shadow-sm rounded-lg">
                <div className="text-center mb-4 space-y-2">
                    <h2 className="font-medium text-2xl">Forgot your password?</h2>
                    <p className="font-light text-sm opacity-60">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>
                <div className="mb-4 w-full space-y-4">
                    <div>
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
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        className="py-2 px-4 text-secondary font-medium text-sm bg-primary
                        hover:bg-opacity-80 rounded-md transition duration-300 w-full focus:outline-primary"
                        type="button"
                        onClick={handleReset}
                        disabled={loading}
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </div>
                <button
                    className="flex items-center justify-center gap-2 py-1 px-4 text-primary font-medium text-sm w-full"
                    type="button"
                    onClick={() => navigate(-1)}
                >
                    <FontAwesomeIcon icon={faArrowLeft} />
                    <span className="transition duration-300 hover:underline">
                        Back
                    </span>
                </button>
            </div>
        </section>
    )
}