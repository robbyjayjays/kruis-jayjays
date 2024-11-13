import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../assets/css/editWorkshop.css';

const EditWorkshop = () => {
    const { id } = useParams(); // Get the workshop ID from the route parameter
    const navigate = useNavigate();
    const [workshop, setWorkshop] = useState({ title: '', description: '', workshop_date: '' });
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token'); // Check token in localStorage

    // Function to format date to mm/dd/yyyy
    const formatDate = (date) => {
        const d = new Date(date);
        const month = String(d.getMonth() + 1).padStart(2, '0'); // Add leading zero if needed
        const day = String(d.getDate()).padStart(2, '0'); // Add leading zero if needed
        const year = d.getFullYear();
        return `${month}/${day}/${year}`;
    };

    useEffect(() => {
        // If no token exists, redirect to login page
        if (!token) {
            navigate('/'); // Redirect to login
            return;
        }

        // Fetch the workshop data
        const fetchWorkshop = async () => {
            try {
                const response = await fetch(`/api/get-workshop?id=${id}`);
                const data = await response.json();

                if (response.ok) {
                    // Format the workshop date to mm/dd/yyyy format
                    const formattedDate = data.workshop.workshop_date 
                        ? formatDate(data.workshop.workshop_date)
                        : '';

                    setWorkshop({
                        title: data.workshop.title,
                        description: data.workshop.description,
                        workshop_date: formattedDate, // Set the formatted date
                    });
                } else {
                    console.error('Error fetching workshop:', data.error);
                    toast.error('Failed to load workshop data');
                }
            } catch (error) {
                console.error('Error fetching workshop:', error);
                toast.error('Error fetching workshop data');
            } finally {
                setLoading(false);
            }
        };

        fetchWorkshop();
    }, [id, token, navigate]); // Include token in dependencies

    const handleChange = (e) => {
        const { name, value } = e.target;
        setWorkshop((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`/api/edit-workshop`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id,
                    title: workshop.title,
                    description: workshop.description,
                    workshop_date: workshop.workshop_date, // Send the updated date
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Workshop updated successfully');
                navigate(`/workshop/${id}`);
            } else {
                toast.error(`Failed to update workshop: ${data.error}`);
            }
        } catch (error) {
            console.error('Error updating workshop:', error);
            toast.error('Error updating workshop');
        }
    };

    if (loading) {
        return <p>Loading workshop...</p>;
    }

    return (
        <div className="edit-workshop-container">
            <h1>Edit Workshop</h1>
            <form onSubmit={handleSubmit} className="edit-workshop-form">
                <label>
                    Title:
                    <input
                        type="text"
                        name="title"
                        value={workshop.title}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Description:
                    <textarea
                        name="description"
                        value={workshop.description}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Workshop Date:
                    <input
                        type="date"
                        name="workshop_date"
                        value={workshop.workshop_date}
                        onChange={handleChange}
                        required
                    />
                </label>
                <button type="submit">Update Workshop</button>
            </form>
        </div>
    );
};

export default EditWorkshop;
