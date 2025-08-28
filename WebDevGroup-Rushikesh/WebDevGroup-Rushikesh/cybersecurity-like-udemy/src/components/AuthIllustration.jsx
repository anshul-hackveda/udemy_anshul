import React from 'react';

const AuthIllustration = () => {
  return (
    // This is a placeholder illustration similar to the one in the screenshot.
    // You can replace this SVG with your own brand's illustration.
    <svg width="100%" height="100%" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">
        <g fill="none" fillRule="evenodd">
            {/* Background shapes */}
            <circle fill="#F0F8FF" cx="400" cy="300" r="300" />
            <path d="M100 600 Q200 400 400 500 T700 450" stroke="#E6E6FA" strokeWidth="2" />
            <path d="M50 100 Q150 200 250 150 T450 200" stroke="#E6E6FA" strokeWidth="2" />

            {/* Person on the left */}
            <g transform="translate(150, 250)">
                <path d="M50,150 C50,100 100,100 100,150 Z" fill="#FFDAB9" />
                <circle cx="75" cy="75" r="25" fill="#FFDAB9" />
                <path d="M25,150 L125,150 L125,250 L25,250 Z" fill="#FFFFFF" stroke="#333" strokeWidth="2" />
                <path d="M75,100 v50" stroke="#333" strokeWidth="2" />
            </g>

            {/* Person in the middle (main figure) */}
            <g transform="translate(350, 150)">
                <path d="M75,150 C75,50 175,50 175,150 Z" fill="#D3D3D3" />
                <circle cx="125" cy="90" r="40" fill="#696969" />
                <path d="M50,150 L200,150 L175,350 L75,350 Z" fill="#000000" />
                <path d="M50,150 L200,150 L188,250 L62,250 Z" fill="#FFFFFF" stroke="#333" strokeWidth="2" />
                 {/* Checker pattern pants */}
                <rect x="75" y="250" width="25" height="25" fill="#fff" stroke="#000" />
                <rect x="100" y="250" width="25" height="25" fill="#000" />
                <rect x="125" y="250" width="25" height="25" fill="#fff" stroke="#000" />
                <rect x="150" y="250" width="25" height="25" fill="#000" />
                <rect x="75" y="275" width="25" height="25" fill="#000" />
                <rect x="100" y="275" width="25" height="25" fill="#fff" stroke="#000" />
                <rect x="125" y="275" width="25" height="25" fill="#000" />
                <rect x="150" y="275" width="25" height="25" fill="#fff" stroke="#000" />

            </g>
            
            {/* Floating UI elements */}
            <rect x="280" y="200" width="50" height="50" fill="#fff" stroke="#333" strokeWidth="2" rx="5" />
            <text x="295" y="235" fontFamily="Arial" fontSize="24" fill="#333">@</text>

            <circle cx="550" cy="120" r="30" fill="#fff" stroke="#333" strokeWidth="2" />
            <path d="M535 120 h30 M550 105 v30" stroke="#333" strokeWidth="2"/>

            <rect x="300" y="400" width="100" height="60" fill="#fff" stroke="#333" strokeWidth="2" rx="5" />
            <path d="M320 430 l20 -20 l40 20" stroke="#5624d0" strokeWidth="3" fill="none"/>
        </g>
    </svg>
  );
};

export default AuthIllustration;