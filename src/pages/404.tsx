import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export const NotFoundPage = () => {
    return (
        <section id="not-found" className="h-screen flex items-center justify-center bg-secondary font-Josefin">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0, y: -50 },
                    visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5 }}
                className="text-center"
            >
                <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
                <h2 className="text-3xl font-semibold text-primary mb-6">Page Not Found</h2>
                <p className="text-xl text-primary/70 mb-8">
                    Oops! The page you're looking for doesn't exist.
                </p>
                <Link
                    to="/">
                    <span className="bg-gradient-to-br from-primary-blue to-primary text-secondary font-semibold border border-primary py-2 px-6 rounded-xl transition duration-300 hover:opacity-80 w-full">
                        Go Back Home
                    </span>
                </Link>
            </motion.div>
        </section>
    );
};
