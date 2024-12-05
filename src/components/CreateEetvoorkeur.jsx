import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../assets/css/createWorkshop.css';
import Navbar from './Navbar';

const CreateEetvoorkeur = () => {
    const [eetvoorkeur, setEetvoorkeur] = useState('');
    const navigate = useNavigate();
    const email = localStorage.getItem('email'); // Get the user's email from localStorage
    const token = localStorage.getItem('token'); // Get the user's token from localStorage

    useEffect(() => {
        // Redirect to login if no token or email is found
        if (!token || !email) {
            toast.error('You must be logged in to create a food preference.');
            navigate('/'); // Redirect to login page
        }
    }, [navigate, token, email]);

    const handleSubmitEetvoorkeur = async () => {
        try {
            const response = await fetch('/api/create?eetvoorkeur=true', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    preference_name: eetvoorkeur,
                }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                toast.success('Food preference created successfully');
                navigate('/admin');
            } else {
                toast.error(`Failed to create food preference: ${data.error}`);
            }
        } catch (error) {
            console.error('Error creating food preference:', error);
            toast.error('An error occurred while creating the food preference.');
        }
    };
    

    return (
      <>
        <Navbar />
        <div className="create-eetvoorkeur-container">
            <h1>Create New Food Preference</h1>
            <form onSubmit={handleSubmitEetvoorkeur} className="create-eetvoorkeur-form">
                <label>
                    Eetvoorkeur:
                    <input
                        type="text"
                        name="preference_name"
                        value={eetvoorkeur}
                        onChange={(e) => setEetvoorkeur(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Create Eetvoorkeur</button>
            </form>
        </div>
      </>
    );
};

export default CreateEetvoorkeur;
