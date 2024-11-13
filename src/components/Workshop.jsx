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

    useEffect(() => {
        const email = localStorage.getItem('email');

        const fetchWorkshop = async () => {
            try {
                const response = await fetch(`/api/get-workshop?id=${id}`);
                const data = await response.json();

                if (response.ok) {
                    setWorkshop(data.workshop);

                    // Check if the current user is the creator
                    if (data.workshop.creator_id === parseInt(localStorage.getItem('userId'), 10)) {
                        setIsCreator(true);
                    }

                    // Check if the current user is subscribed
                    if (data.workshop.subscribers.includes(parseInt(localStorage.getItem('userId'), 10))) {
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
    }, [id]);

    const handleSubscribe = async () => {
        // Placeholder for subscribe/unsubscribe logic
        alert(isSubscribed ? 'Unsubscribed from the workshop' : 'Subscribed to the workshop');
        setIsSubscribed(!isSubscribed);
    };

    return (
        <div className="workshop-container">
            {workshop ? (
                <>
                    <div className="workshop-header">
                        <h1 className="workshop-title">{workshop.title}</h1>
                        <p className="creator-info">
                            Created by: {workshop.creator_firstname} {workshop.creator_lastname}
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
