import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from './Navbar';

const CreateProvince = () => {
    const [provinceName, setProvinceName] = useState('');
    const navigate = useNavigate();
    const email = localStorage.getItem('email'); // Get the user's email from localStorage
    const token = localStorage.getItem('token'); // Get the user's token from localStorage

    useEffect(() => {
        if (!token || !email) {
            toast.error('You must be logged in to create a province.');
            navigate('/');
        }
    }, [navigate, token, email]);

    const handleSubmitProvince = async (e) => {
        e.preventDefault();

        if (!provinceName.trim()) {
            toast.error('Province name cannot be empty.');
            return;
        }

        try {
            const response = await fetch('/api/create-workshop?province=true', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // Include the token for authentication
                },
                body: JSON.stringify({
                    email,
                    province_name: provinceName,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Province created successfully');
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
            <div className="create-province-container">
                <h1>Create New Province</h1>
                <form onSubmit={handleSubmitProvince} className="create-province-form">
                    <label>
                        Province Name:
                        <input
                            type="text"
                            name="province_name"
                            value={provinceName}
                            onChange={(e) => setProvinceName(e.target.value)}
                            required
                        />
                    </label>
                    <button type="submit">Create Province</button>
                </form>
            </div>
        </>
    );
};

export default CreateProvince;
