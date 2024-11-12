import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedEmail = localStorage.getItem('email');

        if (!token) {
            // Redirect to login if no token is found
            navigate('/');
        } else if (storedEmail) {
            const namePart = storedEmail.split('@')[0];
            setUsername(namePart);
        }

        toast.success(`Welcome, ${storedEmail ? storedEmail.split('@')[0] : ''}!`);
    }, [navigate]);

    return (
        <div>
            <Navbar />
            <ToastContainer />
            <h1>Welcome, {username}!</h1>
        </div>
    );
};

export default Home;
