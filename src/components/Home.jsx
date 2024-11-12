import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
// State to hold the email retrieved from localStorage
const [email, setEmail] = useState('');

useEffect(() => {
    // Get the email from localStorage and set it in the state
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
        setEmail(storedEmail);
    }

    // Display a welcome toast when landing on the page
    toast.success(`Welcome, ${storedEmail}!`);
    }, []);

    return (
        <div>
            <ToastContainer />
            <h1>Home Page</h1>
        </div>
    );
}

export default Home