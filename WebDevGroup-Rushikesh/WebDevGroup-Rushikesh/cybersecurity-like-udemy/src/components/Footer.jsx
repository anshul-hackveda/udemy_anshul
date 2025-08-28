import React from 'react';

const Footer = () => {
    return (
        <footer className="site-footer">
            <div className="container">
                <div className="footer-about">
                    <img src="/Img/HackvedaLogo1.png" alt="Hackveda Logo" height="42" style={{ filter: 'brightness(0) invert(1)' }} />
                    <p>Empowering the Next Generation of Tech Talent Through Real-World Experience and Job-Ready Skills.</p>
                </div>
                <div className="footer-contact">
                    <h3>&nbsp;&nbsp;&nbsp;&nbsp;Contact Us</h3>
                    <p><i className="fas fa-location-dot"></i> 511, Patparganj Industrial Area, Delhi – 110092</p>
                    <p><i className="fas fa-phone"></i> +91 9667964138</p>
                    <p><i className="fas fa-envelope"></i> director@hackveda.in</p>
                </div>
            </div>
            <div className="copyright">
                <p>© 2025 Hackveda Solutions. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;