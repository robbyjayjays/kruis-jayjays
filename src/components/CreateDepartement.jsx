import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from './Navbar';
import '../assets/css/createWorkshop.css';

const CreateDepartement = () => {
    const [departement, setDepartement] = useState('');
    const navigate = useNavigate();
    const email = localStorage.getItem('email'); // Get the user's email from localStorage
    const token = localStorage.getItem('token'); // Get the user's token from localStorage

    useEffect(() => {
        if (!token || !email) {
            toast.error('You must be logged in to create a province.');
            navigate('/');
        }
    }, [navigate, token, email]);

    const handleSubmitDepartement = async (e) => {
        e.preventDefault();

        if (!departement.trim()) {
            toast.error('Departement name cannot be empty.');
            return;
        }

        try {
            const response = await fetch('/api/create-workshop?departement=true', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // Include the token for authentication
                },
                body: JSON.stringify({
                    email,
                    departement_name: departement,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Departement created successfully');
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
                <h1>Nieuwe Departementen aanmaken</h1>
                <form onSubmit={handleSubmitDepartement} className="create-workshop-form">
                    <label>
                        Departement Naam:
                        <input
                            type="text"
                            name="departement_name"
                            value={departement}
                            onChange={(e) => setDepartement(e.target.value)}
                            required
                        />
                    </label>
                    <button type="submit">Departement aanmaken</button>
                </form>
            </div>
        </>
    );
};

export default CreateDepartement;
