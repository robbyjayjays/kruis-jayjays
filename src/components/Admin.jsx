import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/profile.css';
import Navbar from './Navbar';

const Admin = () => {
    const navigate = useNavigate();
    const [workshops, setWorkshops] = useState([]);
    const [eetvoorkeur, setEetvoorkeuren] = useState([]);
    const [allergies, setAllergies] = useState([]);
    const [carpoolRoles, setCarpoolRoles] = useState([]);
    const email = localStorage.getItem('email');
    const isCreator = localStorage.getItem('isCreator') === 'true'; // Convert string to boolean

    // Fetch Workshops
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

    // Fetch Eetvoorkeuren
    const fetchEetvoorkeuren = async () => {
        try {
            const response = await fetch(`/api/get-workshops?Eetvoorkeuren=true`);
            const data = await response.json();
            if (response.ok) {
                setEetvoorkeuren(data.food_preferences); // Correctly assign the array
            } else {
                console.error('Error fetching eetvoorkeuren:', data.error);
            }
        } catch (error) {
            console.error('Error fetching eetvoorkeuren:', error);
        }
    };

    // Fetch Allergies
    const fetchAllergies = async () => {
        try {
            const response = await fetch(`/api/get-workshops?Allergies=true`);
            const data = await response.json();
            if (response.ok) {
                setAllergies(data.allergies); // Correctly assign the array
            } else {
                console.error('Error fetching allergies:', data.error);
            }
        } catch (error) {
            console.error('Error fetching allergies:', error);
        }
    };

    // Fetch Carpool Roles
    const fetchCarpoolRoles = async () => {
        try {
            const response = await fetch(`/api/get-workshops?Carpool=true`);
            const data = await response.json();
            if (response.ok) {
                setCarpoolRoles(data.carpool_roles); // Correctly assign the array
            } else {
                console.error('Error fetching carpool roles:', data.error);
            }
        } catch (error) {
            console.error('Error fetching carpool roles:', error);
        }
    };

    // Use useEffect to trigger API calls once on component mount
    useEffect(() => {
        fetchWorkshops();
        fetchEetvoorkeuren();
        fetchAllergies();
        fetchCarpoolRoles();
    }, []);

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
                                        key={workshop.id} // Ensure a unique key
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
                                        key={eetvoorkeur.id} // Ensure a unique key
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
                            onClick={() => navigate('/create-eetvoorkeur')}
                        >
                            Create Eetvoorkeur
                        </button>
                    </div>
                )}

                {/* Allergies Section */}
                {isCreator && (
                    <div className="profile-section">
                        <h2>Allergies</h2>
                        <div className="workshop-container">
                            {allergies.length > 0 ? (
                                allergies.map((allergy) => (
                                    <div
                                        key={allergy.id} // Ensure a unique key
                                        className="workshop-box"
                                    >
                                        <div className="workshop-title">{allergy.allergy_name}</div>
                                    </div>
                                ))
                            ) : (
                                <p>No allergies created yet.</p>
                            )}
                        </div>
                        <button
                            className="create-workshop-button"
                            onClick={() => navigate('/create-allergy')}
                        >
                            Create Allergy
                        </button>
                    </div>
                )}

                {/* Carpool Roles Section */}
                {isCreator && (
                    <div className="profile-section">
                        <h2>Carpool Roles</h2>
                        <div className="workshop-container">
                            {carpoolRoles.length > 0 ? (
                                carpoolRoles.map((carpoolRole) => (
                                    <div
                                        key={carpoolRole.id} // Ensure a unique key
                                        className="workshop-box"
                                    >
                                        <div className="workshop-title">{carpoolRole.carpool_role}</div>
                                    </div>
                                ))
                            ) : (
                                <p>No carpool roles created yet.</p>
                            )}
                        </div>
                        <button
                            className="create-workshop-button"
                            onClick={() => navigate('/create-carpool')}
                        >
                            Create Carpool Role
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default Admin;
