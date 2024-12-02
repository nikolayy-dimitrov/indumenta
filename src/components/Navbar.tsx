import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { signOut } from 'firebase/auth';
import { auth } from "../config/firebaseConfig";
import { Link } from "react-router-dom";

import Logo from "../assets/logo-no-background.png";
import useMediaQuery from "../utils/useMediaQuery.ts";

export const Navbar = () => {
    const { user} = useContext(AuthContext);

    const isAboveMediumScreens = useMediaQuery("(min-width: 1060px)");

    const [isMenuToggled, setIsMenuToggled] = useState<boolean>(false)

    const toggleMenu = () => {
        setIsMenuToggled(!isMenuToggled);
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            window.location.href = '/';
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <nav className="bg-gray-100 py-3 px-8 font-Josefin text-gray-500 flex justify-between items-center">
            {/* Logo */}
            <a href="/">
                <img src={Logo} alt="logo" className="max-w-44 hover:opacity-85" />
            </a>
            {/* Main menu */}
            {isAboveMediumScreens ? (
                <>
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
                            className="bg-primary/75 hover:bg-primary/90 text-white px-4 py-1 rounded"
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
                </>
            ) : (
                <div className="block cursor-pointer z-20" onClick={toggleMenu}>
                    <div
                        className={`relative w-[30px] h-[20px] z-40 transform transition-transform duration-500 ease-in-out ${
                            isMenuToggled ? "rotate-0" : ""
                        }`}
                    >
                        <span
                            className={`block absolute h-[3px] w-full bg-black rounded-[9px] left-0 transition-all duration-250 ease-in-out ${
                                isMenuToggled ? "top-[10px] rotate-[135deg]" : "top-0"
                            }`}
                        ></span>
                        <span
                            className={`block absolute h-[3px] w-full top-[10px] bg-black rounded-[9px] left-0 transition-all duration-250 ease-in-out ${
                                isMenuToggled ? "opacity-0 left-[-60px]" : ""
                            }`}
                        ></span>
                        <span
                            className={`block absolute h-[3px] w-full bg-black rounded-[9px] left-0 transition-all duration-250 ease-in-out ${
                                isMenuToggled ? "top-[10px] rotate-[-135deg]" : "top-[20px]"
                            }`}
                        ></span>
                    </div>
                </div>
            )}
            {/*TODO:FINISH MOBILE MENU MODAL */}
            {/* MOBILE MENU */}
            {!isAboveMediumScreens && isMenuToggled && (
                <div className="fixed right-0 bottom-0 top-0 z-10 h-full w-full bg-gray-200 text-gray-900 font-semibold">

                </div>
            )}
        </nav>
    );
};