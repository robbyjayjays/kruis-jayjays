import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from './Navbar';

const CreateCarpool = () => {
    const [carpoolRole, setCarpoolRole] = useState('');
    const navigate = useNavigate();
    const email = localStorage.getItem('email'); // Get the user's email from localStorage
    const token = localStorage.getItem('token'); // Get the user's token from localStorage

    useEffect(() => {
        if (!token || !email) {
            toast.error('You must be logged in to create a carpool role.');
            navigate('/');
        }
    }, [navigate, token, email]);

    const handleSubmitCarpool = async (e) => {
        e.preventDefault();

        if (!carpoolRole.trim()) {
            toast.error('Carpool role cannot be empty.');
            return;
        }

        try {
            const response = await fetch('/api/create-workshop?carpool=true', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    carpool_role: carpoolRole,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Carpool role created successfully');
                navigate('/Admin');
            } else {
                toast.error(`Failed to create carpool role: ${data.error}`);
            }
        } catch (error) {
            console.error('Error creating carpool role:', error);
            toast.error('An error occurred while creating the carpool role.');
        }
    };

    return (
        <>
            <Navbar />
            <div className="create-workshop-container">
                <h1>Nieuwe Carpool Rollen aanmaken</h1>
                <form onSubmit={handleSubmitCarpool} className="create-workshop-form">
                    <label>
                        Carpool Rol:
                        <input
                            type="text"
                            name="carpool_role"
                            value={carpoolRole}
                            onChange={(e) => setCarpoolRole(e.target.value)}
                            required
                        />
                    </label>
                    <button type="submit">Carpool Rol aanmaken</button>
                </form>
            </div>
        </>
    );
};

export default CreateCarpool;
