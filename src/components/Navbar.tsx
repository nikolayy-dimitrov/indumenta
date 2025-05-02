import { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";

import Logo from "../assets/indumenta-logo-primary.png";
import useMediaQuery from "../utils/useMediaQuery.ts";

export const Navbar = () => {
    const { user } = useContext(AuthContext);

    const isAboveMediumScreens = useMediaQuery("(min-width: 1060px)");

    const [isMenuToggled, setIsMenuToggled] = useState<boolean>(false)

    const toggleMenu = () => {
        setIsMenuToggled(!isMenuToggled);
    };

    return (
        <nav className="md:w-11/12 mx-auto relative flex items-center justify-between py-4 px-8 font-Josefin text-gray-200">
            {/* Logo */}
            <Link to="/" className="flex items-center justify-center z-40 transition duration-300 active:scale-90 group-hover:opacity-85">
                {!isAboveMediumScreens ?
                    <img src={Logo} alt="logo" className="max-w-8" />
                :
                    <span className="transition duration-300 hover:text-primary text-2xl font-extrabold">
                        INDUMENTA
                    </span>
                }
            </Link>
            {/* Main menu */}
            {isAboveMediumScreens ? (
                <>
                <div className="absolute left-1/2 transform -translate-x-1/2 flex gap-8 font-semibold z-40">
                    <NavLink to="/stylist"
                             className={({ isActive }) =>
                        `${isActive && "text-primary/20"} transition duration-300 active:scale-90 hover:text-primary/90 text-sm uppercase tracking-wide`
                    }>
                        Stylist
                    </NavLink>
                    <NavLink to="/"
                             className={({ isActive }) =>
                        `${isActive && "text-primary/20"} transition duration-300 active:scale-90 hover:text-primary/90 text-sm uppercase tracking-wide border-x border-primary/20 px-8`
                    }>
                        Home
                    </NavLink>
                    <NavLink to="/wardrobe"
                             className={({ isActive }) =>
                        `${isActive && "text-primary/20"} transition duration-300 active:scale-90 hover:text-primary/90 text-sm uppercase tracking-wide`
                    }>
                        Wardrobe
                    </NavLink>
                    {/*<Link to="/contact" className="hover:text-primary/90">Contact</Link>*/}
                </div>
                {/* User menu */}
                {user ? (
                    <div className="flex items-center gap-4 z-40">
                        <Link to="/profile">
                            {user.displayName ? `Welcome, ${user.displayName} ` : 'Welcome to INDUMENTA'}
                        </Link>
                    </div>
                ) : (
                    <div className="flex gap-4 z-40 font-light">
                        <Link to="/authentication" className="hover:text-primary/80">Sign In</Link>
                    </div>
                )}
                </>
            ) : (
                // Hamburger Menu for Mobile
                <button className="flex items-center z-40" onClick={toggleMenu}>
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
                </button>
            )}

            {/* MOBILE MENU */}
            <AnimatePresence>
                {!isAboveMediumScreens && isMenuToggled && (
                    <motion.div
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -100, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="fixed top-20 z-30 w-10/12 h-[50vh] flex flex-col items-center justify-center
                        bg-secondary/80 backdrop-blur rounded-3xl"
                    >
                        <div className="flex flex-col items-center justify-center gap-16
                        text-primary text-3xl font-normal">
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
                            {!user ? (
                                <Link to="/authentication">
                                    <button onClick={toggleMenu}>
                                        Sign In
                                    </button>
                                </Link>
                            ) : (
                                <Link
                                    to="/profile"
                                    className="text-content"
                                    onClick={toggleMenu}
                                >
                                    Profile
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};