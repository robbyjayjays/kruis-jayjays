import React, { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
    useEffect(() => {
        // Display a toast when landing on this page
        toast.success('Welcome to the Home Page!');
    }, []);

    return (
        <div>
            <ToastContainer />
            <h1>Home Page</h1>
        </div>
    );
}

export default Home