import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faLock } from "@fortawesome/free-solid-svg-icons";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { auth } from "../../config/firebaseConfig.ts";

export const ResetPasswordPage = () => {
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [actionCode, setActionCode] = useState<string>('');
    const [isValidCode, setIsValidCode] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const oobCode = queryParams.get('oobCode');

        if (!oobCode) {
            setError("Invalid password reset link. Please try again.");
            setLoading(false);
            return;
        }

        const verifyCode = async () => {
            try {
                const email = await verifyPasswordResetCode(auth, oobCode);
                setEmail(email);
                setActionCode(oobCode);
                setIsValidCode(true);
                setLoading(false);
            } catch (err) {
                setError((err as Error).message);
                setLoading(false);
            }
        };

        verifyCode();
    }, [location]);

    const handlePasswordReset = async () => {
        setError('');

        if (!newPassword.trim()) {
            setError("Please enter a new password.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }

        if (!/[A-Z]/.test(newPassword)) {
            setError('Password must include at least one uppercase letter.');
            return;
        }

        if (!/[a-z]/.test(newPassword)) {
            setError('Password must include at least one lowercase letter.');
            return;
        }

        if (!/\d/.test(newPassword)) {
            setError('Password must include at least one number.');
            return;
        }

        if (!/[!@#$%^&*(),.?":{}|<>_\-\\[\]/]/.test(newPassword)) {
            setError('Password must include at least one special character.');
            return;
        }


        try {
            setLoading(true);
            await confirmPasswordReset(auth, actionCode, newPassword);
            setSuccess(true);
            setLoading(false);
        } catch (err) {
            setError((err as Error).message);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <section id="reset-password"
                     className="flex flex-col items-center justify-center m-auto h-full px-4 w-full max-w-lg">
                <div className="flex flex-col items-center justify-center my-4">
                    <h1 className="text-4xl font-bold uppercase">INDUMENTA</h1>
                    <p className="text-sm font-light lowercase">Reset Your Password</p>
                </div>
                <div
                    className="flex flex-col items-center justify-center w-full my-2 py-6 px-6 border border-primary/20 shadow-sm rounded-lg">
                    <p>Verifying your reset link...</p>
                </div>
            </section>
        );
    }

    if (success) {
        return (
            <section id="reset-password"
                     className="flex flex-col items-center justify-center m-auto h-full px-4 w-full max-w-lg">
                <div className="flex flex-col items-center justify-center my-4">
                    <h1 className="text-4xl font-bold uppercase">INDUMENTA</h1>
                    <p className="text-sm font-light lowercase">Reset Your Password</p>
                </div>
                <div
                    className="flex flex-col items-center justify-center w-full my-2 py-6 px-6 border border-primary/20 shadow-sm rounded-lg">
                    <div className="text-center mb-4 space-y-2">
                        <h2 className="font-medium text-2xl">Password Reset Successful!</h2>
                        <p className="font-light text-sm opacity-60">
                            Your password has been successfully reset. You can now login with your
                            new password.
                        </p>
                    </div>
                    <button
                        className="py-2 px-4 text-secondary font-medium text-sm bg-primary 
                        hover:bg-opacity-80 rounded-md transition duration-300 w-full focus:outline-primary"
                        type="button"
                        onClick={() => navigate('/authentication')}
                    >
                        Go to Login
                    </button>
                </div>
            </section>
        );
    }

    if (!isValidCode) {
        return (
            <section id="reset-password"
                     className="flex flex-col items-center justify-center m-auto h-full px-4 w-full max-w-lg">
                <div className="flex flex-col items-center justify-center my-4">
                    <h1 className="text-4xl font-bold uppercase">INDUMENTA</h1>
                    <p className="text-sm font-light lowercase">Reset Your Password</p>
                </div>
                <div
                    className="flex flex-col items-center justify-center w-full my-2 py-6 px-6 border border-primary/20 shadow-sm rounded-lg">
                    <div className="text-center mb-4 space-y-2">
                        <h2 className="font-medium text-2xl">Invalid Reset Link</h2>
                        <p className="font-light text-sm opacity-60 text-red-500">
                            {error}
                        </p>
                    </div>
                    <button
                        className="py-2 px-4 text-secondary font-medium text-sm bg-primary 
                        hover:bg-opacity-80 rounded-md transition duration-300 w-full focus:outline-primary"
                        type="button"
                        onClick={() => navigate('/authentication/forgot-password')}
                    >
                        Try Again
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section id="reset-password"
                 className="flex flex-col items-center justify-center m-auto h-full px-4 w-full max-w-lg">
            <div className="flex flex-col items-center justify-center my-4">
                <h1 className="text-4xl font-bold uppercase">INDUMENTA</h1>
                <p className="text-sm font-light lowercase">Reset Your Password</p>
            </div>
            <div
                className="flex flex-col items-center justify-center w-full my-2 py-6 px-6 border border-primary/20 shadow-sm rounded-lg">
                <div className="text-center mb-4 space-y-2">
                    <h2 className="font-medium text-2xl">Create New Password</h2>
                    <p className="font-light text-sm opacity-60">
                        Enter a new password for <span className="font-medium">{email}</span>
                    </p>
                </div>
                <div className="mb-4 w-full space-y-4">
                    <div>
                        <label htmlFor="newPassword"
                               className="block text-primary font-medium text-sm mb-2">
                            New Password
                        </label>
                        <div className="relative">
                            <FontAwesomeIcon
                                icon={faLock}
                                className="absolute top-1/2 transform -translate-y-1/2 left-3 text-primary/80"
                            />
                            <input
                                type="password"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="shadow bg-secondary border border-primary/20 rounded-md w-full py-2 pl-10 pr-3
                                 text-primary placeholder:text-primary/60 leading-tight
                                 focus:outline-primary/10"
                                placeholder="Enter new password"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="confirmPassword"
                               className="block text-primary font-medium text-sm mb-2">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <FontAwesomeIcon
                                icon={faLock}
                                className="absolute top-1/2 transform -translate-y-1/2 left-3 text-primary/80"
                            />
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="shadow bg-secondary border border-primary/20 rounded-md w-full py-2 pl-10 pr-3
                                 text-primary placeholder:text-primary/60 leading-tight
                                 focus:outline-primary/10"
                                placeholder="Confirm new password"
                                required
                            />
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <button
                        className="py-2 px-4 text-secondary font-medium text-sm bg-primary
                        hover:bg-opacity-80 rounded-md transition duration-300 w-full focus:outline-primary"
                        type="button"
                        onClick={handlePasswordReset}
                    >
                        Reset Password
                    </button>
                </div>
                <Link
                    className="flex items-center justify-center gap-2 py-1 px-4 text-primary font-medium text-sm w-full"
                    type="button"
                    to="/authentication"
                >
                    <FontAwesomeIcon icon={faArrowLeft}/>
                    <span className="transition duration-300 hover:underline">
                        Back to login
                    </span>
                </Link>
            </div>
        </section>
    );
};