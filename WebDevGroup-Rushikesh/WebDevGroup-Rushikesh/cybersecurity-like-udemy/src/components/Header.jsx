import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (isMenuOpen && !event.target.closest('.header')) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('click', handleOutsideClick);
        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, [isMenuOpen]);


    return (
        <header className="header">
            <div className="container">
                {/* Use Link for the logo to navigate home */}
                <Link to="/">
                    <img src="/Img/HackvedaLogo1.png" alt="Hackveda" height="32" className="logo" />
                </Link>
                <div className="search">
                    <i className="fas fa-search"></i>
                    <input placeholder="Search for anything" />
                </div>
                <nav className="nav">
                    <a href="#">Plans & Pricing</a>
                    <a href="#">Hackveda Business</a>
                    <a href="#">Teach on Hackveda</a>
                </nav>
                <div className="header-actions">
                    <i className="fas fa-shopping-cart cart-icon"></i>
                    {/* Update buttons to Links */}
                    <Link to="/login" className="login button-as-link">Log in</Link>
                    <Link to="/signup" className="signup button-as-link">Sign up</Link>
                </div>
                <button className="mobile-toggle" id="mobileToggle" onClick={toggleMenu}>
                    <i className={isMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
                </button>
            </div>
            {/* Mobile Menu */}
            <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`} id="mobileMenu">
                <a href="#">Plans & Pricing</a>
                <a href="#">Hackveda Business</a>
                <a href="#">Teach on Hackveda</a>
                <div className="mobile-auth">
                    {/* Update mobile buttons to Links */}
                    <Link to="/login" className="login button-as-link">Log in</Link>
                    <Link to="/signup" className="signup button-as-link">Sign up</Link>
                </div>
            </div>
        </header>
    );
};

export default Header;