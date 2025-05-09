import { useState } from "react";
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';

export const MainLayout = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <Navbar onMenuToggle={setIsMenuOpen} />
            <div className={`content-wrapper ${isMenuOpen && 'blur-md'}`}>
                <Outlet/>
            </div>
        </>
    );
};