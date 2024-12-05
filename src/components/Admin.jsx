import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/profile.css';
import Navbar from './Navbar';

const Admin = () => {
    const navigate = useNavigate();
    const [workshops, setWorkshops] = useState([]);
    const [eetvoorkeur, setEetvoorkeuren] = useState([]);
    const email = localStorage.getItem('email')
    const isCreator = localStorage.getItem('isCreator')

    const fetchWorkshops = async () => {
        try {
            const response = await fetch(`/api/get-workshops?email=${email}&isAdmin=true`);
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

    const fetchEetvoorkeuren = async () => {
        try {
            const response = await fetch(`/api/get-workshops?email=${email}&Eetvoorkeuren=true`);
            const data = await response.json();
            if (response.ok) {
                setEetvoorkeuren(data.preference_name);
            } else {
                console.error('Error fetching workshops:', data.error);
            }
        } catch (error) {
            console.error('Error fetching workshops:', error);
        }
    };

    fetchEetvoorkeuren();

    return (
        <>
            <Navbar />
            <div className="profile-container">
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

                {/* Eetvoorkeuren Section */}
                {isCreator && (
                    <div className="profile-section">
                        <h2>Eetvoorkeuren</h2>
                        <div className="workshop-container">
                            {eetvoorkeur.length > 0 ? (
                                eetvoorkeur.map((eetvoorkeur) => (
                                    <div
                                        className="workshop-box"
                                    >
                                        <div className="workshop-title">{eetvoorkeur.preference_name}</div>
                                    </div>
                                ))
                            ) : (
                                <p>No eetvoorkeur created yet.</p>
                            )}
                        </div>
                        <button
                            className="create-workshop-button"
                            onClick={() => navigate('/create-workshop')}
                        >
                            Create Eetvoorkeur
                        </button>
                    </div>
                )}
            </div>
        </>
    )
}

export default Admin