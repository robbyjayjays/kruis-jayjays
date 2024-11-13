import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../assets/css/workshop.css';
import { toast } from 'react-toastify';

const Workshop = () => {
    const { id } = useParams(); // Get the workshop ID from the route parameter
    const [workshop, setWorkshop] = useState(null);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isCreator, setIsCreator] = useState(false);
    const navigate = useNavigate();
    const email = localStorage.getItem('email');

    useEffect(() => {
        const fetchWorkshop = async () => {
            try {
                const response = await fetch(`/api/get-workshop?id=${id}`);
                const data = await response.json();

                if (response.ok) {
                    setWorkshop(data.workshop);

                    // Check if the current user is the creator
                    if (email && data.workshop.creator_email === email) {
                        setIsCreator(true);
                    }

                    // Check if the current user email is in the subscribers list
                    if (email && data.workshop.subscribers.some(subscriberEmail => subscriberEmail === email)) {
                        setIsSubscribed(true);
                    }
                } else {
                    console.error('Error fetching workshop:', data.error);
                }
            } catch (error) {
                console.error('Error fetching workshop:', error);
            }
        };

        fetchWorkshop();
    }, [id, email]);

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
        <div className="workshop-container">
            {workshop ? (
                <>
                    <div className="workshop-header">
                        <h1 className="workshop-title">{workshop.title}</h1>
                        <p className="creator-info">
                            Created by: {workshop.creator_firstname} {workshop.creator_lastname} ({workshop.creator_email})
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
    );
};

export default Workshop;
