import { faFacebook, faInstagram, faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

export const Footer = () => {
    return (
        <footer className="bg-gradient-to-t from-primary/5 to-secondary to-60% text-primary py-12 font-Josefin">
            <div className="container mx-auto px-4">
                {/* Top Section */}
                <div className="grid md:grid-cols-3 gap-8 items-center">
                    <div className="text-center md:text-left">
                        <h2 className="text-2xl font-bold">INDUMENTA</h2>
                        <p className="text-sm mt-2">Your AI-powered wardrobe assistant</p>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex justify-center gap-4">
                        <a href="#faq" className="hover:underline">FAQ</a>
                        <a href="#how-it-works" className="hover:underline">How It Works</a>
                        <Link to="/wardrobe" className="hover:underline">Wardrobe</Link>
                        <Link to="/contact" className="hover:underline">Contact</Link>
                    </div>

                    {/* Social Media Links */}
                    <div className="flex justify-center md:justify-end gap-4 text-primary">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faFacebook} size={"xl"} />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faXTwitter} size={"xl"} />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faInstagram} size={"xl"} />
                        </a>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-secondary mt-4"></div>

                {/* Bottom Section */}
                <div className="mt-4 text-center text-sm">
                    <p>&copy; {new Date().getFullYear()} Indumenta. All rights reserved.</p>
                    <p>
                        Made by <a href="https://nikolay-dimitrov.xyz" target="_blank" className="hover:underline">Nikolay Dimitrov</a>.
                    </p>
                </div>
            </div>
        </footer>
    );
};
