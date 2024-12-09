import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { signOut } from 'firebase/auth';
import { auth } from "../config/firebaseConfig";

// import Logo from "../assets/logo-no-background.png";
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
        <nav className="md:w-11/12 mx-auto z-40 py-4 px-8 font-Josefin text-gray-500 flex justify-between items-center">
            {/* Logo */}
            <a href="/" className="z-40">
                {/*<img src={Logo} alt="logo" className="max-w-44 hover:opacity-85" />*/}

                <span className="text-primary/70 transition duration-300 hover:text-primary text-2xl font-extrabold">
                    INDUMENTA
                </span>
            </a>
            {/* Main menu */}
            {isAboveMediumScreens ? (
                <>
                <div className="flex gap-4 font-semibold z-40">
                    <Link to="/" className="hover:text-primary/90">Home</Link>
                    <Link to="/stylist" className="hover:text-primary/90">Stylist</Link>
                    <Link to="/wardrobe" className="hover:text-primary/90">Wardrobe</Link>
                    <Link to="/contact" className="hover:text-primary/90">Contact</Link>
                </div>
                {/* User menu */}
                {user ? (
                    <div className="flex items-center gap-4 z-40">
                        <h3 className="text-primary">Hello, {user.displayName}</h3>
                        <button
                            onClick={handleLogout}
                            className="bg-primary hover:bg-transparent text-secondary hover:text-primary
                             px-4 py-1 rounded"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="flex gap-4 z-40 font-light">
                        <a href="/login" className="hover:text-primary/80">Login</a>
                        <a href="/register" className="hover:text-primary/80">Register</a>
                    </div>
                )}
                </>
            ) : (
                <div className="block cursor-pointer z-40" onClick={toggleMenu}>
                    <div
                        className={`relative w-[30px] h-[20px] z-40 transform transition-transform duration-500 ease-in-out ${
                            isMenuToggled ? "rotate-0" : ""
                        }`}
                    >
                        <span
                            className={`block absolute h-[3px] w-full bg-primary rounded-[9px] left-0 transition-all duration-250 ease-in-out ${
                                isMenuToggled ? "top-[10px] rotate-[135deg]" : "top-0"
                            }`}
                        ></span>
                        <span
                            className={`block absolute h-[3px] w-full top-[10px] bg-primary rounded-[9px] left-0 transition-all duration-250 ease-in-out ${
                                isMenuToggled ? "opacity-0 left-[-60px]" : ""
                            }`}
                        ></span>
                        <span
                            className={`block absolute h-[3px] w-full bg-primary rounded-[9px] left-0 transition-all duration-250 ease-in-out ${
                                isMenuToggled ? "top-[10px] rotate-[-135deg]" : "top-[20px]"
                            }`}
                        ></span>
                    </div>
                </div>
            )}
            {/*TODO:FINISH MOBILE MENU MODAL */}
            {/* MOBILE MENU */}
            <AnimatePresence>
                {!isAboveMediumScreens && isMenuToggled && (
                    <motion.div
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -100, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="fixed top-20 z-30 w-10/12 p-8
            bg-primary/70 backdrop-blur text-primary rounded-xl"
                    >
                        <div className="flex flex-col items-center justify-center gap-4
                         text-secondary text-3xl font-extrabold">
                            <Link to="/">
                                <button onClick={toggleMenu}>
                                    Home
                                </button>
                            </Link>
                            <Link to="/stylist">
                                <button onClick={toggleMenu}>
                                    Stylist
                                </button>
                            </Link>
                            <Link to="/wardrobe">
                                <button onClick={toggleMenu}>
                                    Wardrobe
                                </button>
                            </Link>
                            <Link to="/">
                                <button onClick={toggleMenu}>
                                    Contact
                                </button>
                            </Link>
                            {!user ? (
                                <Link to="/login"
                                      className="bg-secondary rounded-lg py-1.5 px-12 text-primary font-medium text-lg"
                                >
                                    <button onClick={toggleMenu}>
                                        Login
                                    </button>
                                </Link>
                            ) : (
                                <span
                                    onClick={handleLogout}
                                    className="text-content drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
                                    Logout
                                </span>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};