import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from './Navbar';
import '../assets/css/createWorkshop.css';

const CreateDepartement = () => {
    const [functie, setFunctie] = useState('');
    const navigate = useNavigate();
    const email = localStorage.getItem('email'); // Get the user's email from localStorage
    const token = localStorage.getItem('token'); // Get the user's token from localStorage

    useEffect(() => {
        if (!token || !email) {
            toast.error('You must be logged in to create a province.');
            navigate('/');
        }
    }, [navigate, token, email]);

    const handleSubmitFunctie = async (e) => {
        e.preventDefault();

        if (!functie.trim()) {
            toast.error('Functie name cannot be empty.');
            return;
        }

        try {
            const response = await fetch('/api/create-workshop?functie=true', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // Include the token for authentication
                },
                body: JSON.stringify({
                    email,
                    function_name: functie,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Functie created successfully');
                navigate('/Admin');
            } else {
                toast.error(`Failed to create province: ${data.error}`);
            }
        } catch (error) {
            console.error('Error creating province:', error);
            toast.error('An error occurred while creating the province.');
        }
    };

    return (
        <>
            <Navbar />
            <div className="create-workshop-container">
                <h1>Nieuwe functie aanmaken</h1>
                <form onSubmit={handleSubmitFunctie} className="create-workshop-form">
                    <label>
                        Functie naam:
                        <input
                            type="text"
                            name="function_name"
                            value={functie}
                            onChange={(e) => setFunctie(e.target.value)}
                            required
                        />
                    </label>
                    <button type="submit">Functie aanmaken</button>
                </form>
            </div>
        </>
    );
};

export default CreateDepartement;
