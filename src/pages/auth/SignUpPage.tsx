import React from "react";
import { Link } from "react-router-dom";

import { motion } from "framer-motion";
import { faAt, faUser } from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { containerVariants } from "../../utils/framerMotionUtils.ts";
import {handleAnonymousLogin, handleGoogleLogin} from "../../utils/handleLogin.ts";

export const SignUp: React.FC = () => {
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
                <h1 className="text-primary text-center drop-shadow text-2xl font-semibold">Sign Up</h1>
                <h2 className="text-secondary/70 text-center text-md max-md:text-sm font-normal pt-4 px-2">Join Indumenta and never stress about outfits again.</h2>
                <div className="flex flex-col gap-2 py-4">
                    <Link to="/sign-up/email"
                          className="flex items-center justify-between gap-4 bg-secondary/40 px-4 py-3 rounded-xl font-light
                                    transition-transform duration-150 active:scale-95
                          ">
                        <FontAwesomeIcon icon={faAt}/>
                        Continue with Email
                        <div></div>
                    </Link>
                    <div
                        className="flex items-center justify-between gap-4 bg-secondary/40 px-4 py-3 rounded-xl font-light cursor-pointer
                                   transition-transform duration-150 active:scale-95
                        "
                        onClick={handleGoogleLogin}
                    >
                        <FontAwesomeIcon icon={faGoogle} className="ml-2"/>
                        Continue with Google
                        <div></div>
                    </div>
                    <div
                        className="flex items-center justify-between gap-4 bg-secondary/40 px-4 py-3 rounded-xl font-light cursor-pointer
                                   transition-transform duration-150 active:scale-95
                        "
                        onClick={handleAnonymousLogin}
                    >
                        <FontAwesomeIcon icon={faUser} className="ml-2" />
                        Continue Anonymously
                        <div></div>
                    </div>
                </div>
                <div className="border-t border-primary/50 py-4 text-center">
                    <Link to="/sign-in" className="text-medium text-primary drop-shadow">
                        Sign In
                    </Link>
                </div>
            </div>
        </motion.div>
    )
}