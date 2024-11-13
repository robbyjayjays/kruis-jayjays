import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../assets/css/navbar.css'; // Import the CSS file
import logo from '../assets/images/jayjays.png'; // Import the logo image

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = localStorage.getItem('email');

    const handleLogout = () => {
        // Remove the token and email from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        
        // Navigate to the login page after logging out
        navigate('/');
    };

    return (
        <nav className="navbar">
             <div className="logo-container">
                <Link to="/">
                    <img src={logo} alt="JayJays Logo" className="navbar-logo" />
                </Link>
            </div>
            <div className="navbar-links">
                {email && <span className="navbar-user">Logged in as: {email}</span>}
                {location.pathname === '/Home' ? (
                    <button className="navbar-button" onClick={() => navigate('/Profile')}>Profile</button>
                ) : (
                    <button className="navbar-button" onClick={() => navigate('/Home')}>Home</button>
                )}
                <button className="navbar-button logout" onClick={handleLogout}>Logout</button>
            </div>
        </nav>
    );
};

export default Navbar;
