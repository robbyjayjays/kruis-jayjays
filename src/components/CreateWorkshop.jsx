import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../assets/css/createWorkshop.css';
import Navbar from './Navbar';

const CreateWorkshop = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const email = localStorage.getItem('email'); // Get the user's email from localStorage
    const token = localStorage.getItem('token'); // Get the user's token from localStorage

    useEffect(() => {
        // Redirect to login if no token or email is found
        if (!token || !email) {
            toast.error('You must be logged in to create a workshop.');
            navigate('/'); // Redirect to login page
        }
    }, [navigate, token, email]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !description) {
            toast.error('Please provide both title and description.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/create-workshop', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    title,
                    description,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Workshop created successfully');
                navigate(`/workshop/${data.workshopId}`);
            } else {
                toast.error(`Failed to create workshop: ${data.error}`);
            }
        } catch (error) {
            console.error('Error creating workshop:', error);
            toast.error('An error occurred while creating the workshop.');
        } finally {
            setLoading(false);
        }
    };

    return (
      <>
        <Navbar />
        <div className="create-workshop-container">
            <h1>Create New Workshop</h1>
            <form onSubmit={handleSubmit} className="create-workshop-form">
                <label>
                    Title:
                    <input
                        type="text"
                        name="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Description:
                    <textarea
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </label>
                <button type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Workshop'}
                </button>
            </form>
        </div>
      </>
    );
};

export default CreateWorkshop;
