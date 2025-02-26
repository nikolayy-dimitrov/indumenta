import React from "react";
import { motion } from "framer-motion";
import { containerVariants } from "../../utils/framerMotionUtils.ts";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAt } from "@fortawesome/free-solid-svg-icons";
import { handleGoogleLogin } from "../../utils/handleLogin.ts";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

export const SignIn: React.FC = () => {
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
                <h1 className="text-primary text-center drop-shadow text-2xl font-semibold">Sign In</h1>
                <h2 className="text-secondary/70 text-center text-md max-md:text-sm font-normal pt-4 px-2">Welcome back to your personalized style hub.</h2>
                <div className="flex flex-col gap-2 py-4">
                    <Link to="/sign-in/email"
                          className="flex items-center justify-start gap-4 bg-secondary/40 px-4 py-3 rounded-xl font-light
                                    transition-transform duration-150 active:scale-95
                          ">
                        <FontAwesomeIcon icon={faAt}/>
                        Continue with Email
                    </Link>
                    <div
                        className="flex items-center justify-start gap-4 bg-secondary/40 px-4 py-3 rounded-xl font-light cursor-pointer
                                    transition-transform duration-150 active:scale-95
                        "
                        onClick={handleGoogleLogin}
                    >
                        <FontAwesomeIcon icon={faGoogle} className="ml-2"/>
                        Continue with Google
                    </div>
                </div>
                <div className="border-t border-primary/50 py-4 text-center">
                    <Link to="/sign-up" className="text-medium text-primary drop-shadow">
                        Sign Up
                    </Link>
                </div>
            </div>
        </motion.div>
    )
}