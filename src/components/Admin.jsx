import React, { useState, useEffect } from 'react';
import '../assets/css/profile.css';

const Admin = () => {
    const [workshops, setWorkshops] = useState([]);

    const fetchWorkshops = async () => {
        try {
            const response = await fetch(`/api/get-workshops?email=${email}`);
            const data = await response.json();
            if (response.ok) {
                setWorkshops(data.workshops);
            } else {
                console.error('Error fetching workshops:', data.error);
            }
        } catch (error) {
            console.error('Error fetching workshops:', error);
        }
    };

    fetchWorkshops();

    return (
        <>
            {/* Created Workshops Section */}
            {isCreator && (
                <div className="profile-section">
                    <h2>Created Workshops</h2>
                    <div className="workshop-container">
                        {workshops.length > 0 ? (
                            workshops.map((workshop) => (
                                <div
                                    key={workshop.id}
                                    className="workshop-box"
                                    onClick={() => navigate(`/workshop/${workshop.id}`)}
                                >
                                    <div className="workshop-title">{workshop.title}</div>
                                    <div className="workshop-description">{workshop.description}</div>
                                </div>
                            ))
                        ) : (
                            <p>No workshops created yet.</p>
                        )}
                    </div>
                    <button
                        className="create-workshop-button"
                        onClick={() => navigate('/create-workshop')}
                    >
                        Create Workshop
                    </button>
                </div>
            )}
        </>
    )
}

export default Admin