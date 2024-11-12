import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

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
        <nav>
            <div>
                {email && <span>Logged in as: {email}</span>}
            </div>
            <div>
                {location.pathname === '/Home' ? (
                    <button onClick={() => navigate('/Profile')}>Profile</button>
                ) : (
                    <button onClick={() => navigate('/Home')}>Home</button>
                )}
                <button onClick={handleLogout}>Logout</button>
            </div>
        </nav>
    );
};

export default Navbar;
