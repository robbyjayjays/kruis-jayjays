import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './Navbar';

const Home = () => {
    // State to hold the username (part of the email before the @)
    const [username, setUsername] = useState('');

    useEffect(() => {
        // Get the email from localStorage and extract the part before the @
        const storedEmail = localStorage.getItem('email');
        if (storedEmail) {
            const namePart = storedEmail.split('@')[0]; // Extracts everything before the @
            setUsername(namePart);
        }

        // Display a welcome toast when landing on the page
        toast.success(`Welcome, ${storedEmail ? storedEmail.split('@')[0] : ''}!`);
    }, []);

    return (
        <div>
            <Navbar />
            <ToastContainer />
            <h1>Homepage!</h1> {/* Display only the part before the @ */}
        </div>
    );
};

export default Home;
