import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { signOut } from 'firebase/auth';
import { auth } from "../config/firebaseConfig";
import { Link } from "react-router-dom";

import Logo from "../assets/logo-no-background.png";

export const Navbar = () => {
    const { user} = useContext(AuthContext);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            window.location.href = '/';
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <nav className="bg-gray-100 py-4 px-8 font-Josefin text-gray-500 flex justify-between items-center">
            {/* Logo */}
            <a href="/"><img src={Logo} alt="logo" className="max-w-44 hover:opacity-85" /> </a>
            {/* Main menu */}
            <div className="flex gap-4 font-semibold">
                <Link to="/" className="hover:text-primary/90">Home</Link>
                <Link to="/stylist" className="hover:text-primary/90">Stylist</Link>
                <Link to="/wardrobe" className="hover:text-primary/90">Wardrobe</Link>
                <Link to="/" className="hover:text-primary/90">About</Link>
                <Link to="/" className="hover:text-primary/90">Contact</Link>
            </div>
            {/* User menu */}
            {user ? (
                <div className="flex items-center gap-4">
                    <h3>Hello, {user.displayName}</h3>
                    <button
                        onClick={handleLogout}
                        className="bg-primary/75 hover:bg-primary/90 text-white px-4 py-2 rounded"
                    >
                        Logout
                    </button>
                </div>
            ) : (
                <div className="flex gap-4">
                    <a href="/login" className="hover:text-primary/80">Login</a>
                    <a href="/register" className="hover:text-primary/80">Register</a>
                </div>
            )}
        </nav>
    );
};