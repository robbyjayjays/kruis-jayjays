import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../assets/css/workshop.css';
import { toast } from 'react-toastify';
import Navbar from './Navbar';

const Workshop = () => {
    const { id } = useParams(); // Get the workshop ID from the route parameter
    const [workshop, setWorkshop] = useState(null);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isCreator, setIsCreator] = useState(false);
    const navigate = useNavigate();
    const email = localStorage.getItem('email');
    const token = localStorage.getItem('token');

    useEffect(() => {
        // If no token exists, redirect to login page
        if (!token) {
            navigate('/');
            return;
        }

        const fetchWorkshopAndUserId = async () => {
            try {
                // Fetch user ID based on the email stored in localStorage
                const userResponse = await fetch(`/api/get-user-id?email=${email}`);
                const userData = await userResponse.json();

                if (!userResponse.ok || !userData.userId) {
                    console.error('Error fetching user ID:', userData.error || 'No user ID found');
                    return;
                }

                const userId = userData.userId;

                const response = await fetch(`/api/get-workshop?id=${id}`);
                const data = await response.json();

                if (response.ok) {
                    setWorkshop(data.workshop);

                    // Check if the current user is the creator
                    if (userId === data.workshop.creator_id) {
                        setIsCreator(true);
                    }

                    // Check if the current user ID is in the subscribers list
                    if (data.workshop.subscribers.includes(userId)) {
                        setIsSubscribed(true);
                    }
                } else {
                    console.error('Error fetching workshop:', data.error);
                }
            } catch (error) {
                console.error('Error fetching workshop or user ID:', error);
            }
        };

        fetchWorkshopAndUserId();
    }, [id, email, token, navigate]);

    const handleSubscribe = async () => {
        try {
            const response = await fetch(`/api/subscribe-workshop`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, workshopId: id, action: isSubscribed ? 'unsubscribe' : 'subscribe' }),
            });

            if (response.ok) {
                setIsSubscribed(!isSubscribed);
                toast.success(isSubscribed ? 'Successfully unsubscribed' : 'Successfully subscribed');
                // Navigate to /Profile after successful subscription/unsubscription
                navigate('/Profile');
            } else {
                const errorData = await response.json();
                toast.error(`Failed to ${isSubscribed ? 'unsubscribe' : 'subscribe'}: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error updating subscription:', error);
            toast.error('An error occurred while updating subscription.');
        }
    };

    return (
        <>
        <Navbar />
        <div className="workshop-container">
            {workshop ? (
                <>
                    <div className="workshop-header">
                        <h1 className="workshop-title">{workshop.title}</h1>
                        <p className="creator-info">
                            Created by: {workshop.creator_firstname} {workshop.creator_lastname} ({workshop.creator_email})
                        </p>
                        <p className="workshop-date">
                            <strong>Date of workshop:</strong> {new Date(workshop.workshop_date).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                            })}
                        </p>
                    </div>
                    <div className="workshop-description">
                        <h3>Description</h3>
                        <p>{workshop.description}</p>
                    </div>
                    <div className="workshop-actions">
                        {!isCreator && (
                            <button className="subscribe-button" onClick={handleSubscribe}>
                                {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
                            </button>
                        )}
                        {isCreator && (
                            <button
                                className="edit-button"
                                onClick={() => navigate(`/edit-workshop/${id}`)}
                            >
                                Edit Workshop
                            </button>
                        )}
                    </div>
                </>
            ) : (
                <p>Loading workshop details...</p>
            )}
        </div>
        </>
    );
};

export default Workshop;
