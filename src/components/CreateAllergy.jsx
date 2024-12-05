import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from './Navbar';

const CreateAllergy = () => {
    const [allergy, setAllergy] = useState('');
    const navigate = useNavigate();
    const email = localStorage.getItem('email'); // Get the user's email from localStorage
    const token = localStorage.getItem('token'); // Get the user's token from localStorage

    useEffect(() => {
        if (!token || !email) {
            toast.error('You must be logged in to create an allergy.');
            navigate('/');
        }
    }, [navigate, token, email]);

    const handleSubmitAllergy = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/create-workshop?allergy=true', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    allergy_name: allergy,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Allergy created successfully');
                navigate('/Admin');
            } else {
                toast.error(`Failed to create allergy: ${data.error}`);
            }
        } catch (error) {
            console.error('Error creating allergy:', error);
            toast.error('An error occurred while creating the allergy.');
        }
    };

    return (
        <>
            <Navbar />
            <div className="create-workshop-container">
                <h1>Create New Allergy</h1>
                <form onSubmit={handleSubmitAllergy} className="create-workshop-form">
                    <label>
                        Allergy:
                        <input
                            type="text"
                            name="allergy_name"
                            value={allergy}
                            onChange={(e) => setAllergy(e.target.value)}
                            required
                        />
                    </label>
                    <button type="submit">Create Allergy</button>
                </form>
            </div>
        </>
    );
};

export default CreateAllergy;
