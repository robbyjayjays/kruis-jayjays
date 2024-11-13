import React, { useState, useEffect } from 'react';
import '../assets/css/profile.css';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const Profile = () => {
    const navigate = useNavigate();
    const [isCreator, setIsCreator] = useState(false);
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [department, setDepartment] = useState('');
    const [province, setProvince] = useState('');
    const [functions, setFunctions] = useState([]);
    const [isInfoOpen, setIsInfoOpen] = useState(true);
    const [workshops, setWorkshops] = useState([]);
    const [subscribedWorkshops, setSubscribedWorkshops] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('email');

        if (!token) {
            alert('You need to be logged in to access this page.');
            navigate('/'); // Redirect to login page
            return;
        }

        const creatorStatus = localStorage.getItem('isCreator') === 'true';
        setIsCreator(creatorStatus);

        if (creatorStatus) {
            // Fetch workshops created by the current user
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
        }

        // Fetch workshops the current user is subscribed to
        const fetchSubscribedWorkshops = async () => {
            try {
                const response = await fetch(`/api/get-subbed?email=${email}`);
                const data = await response.json();

                if (response.ok) {
                    setSubscribedWorkshops(data.workshops);
                } else {
                    console.error('Error fetching subscribed workshops:', data.error);
                }
            } catch (error) {
                console.error('Error fetching subscribed workshops:', error);
            }
        };

        fetchSubscribedWorkshops();
    }, [navigate]);

    const handleFunctionChange = (e) => {
        const value = e.target.value;
        if (functions.includes(value)) {
            setFunctions(functions.filter(func => func !== value));
        } else {
            setFunctions([...functions, value]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const email = localStorage.getItem('email');
            if (!email) {
                alert('User email not found. Please log in.');
                return;
            }

            const response = await fetch('/api/add-info', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, firstname, lastname, department, province, functions }),
            });

            if (response.ok) {
                const result = await response.json();
                alert('Information updated successfully');
                console.log('Updated fields:', result.updatedFields);
            } else {
                const errorData = await response.json();
                alert(`Failed to update information: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error updating user info:', error);
            alert('An error occurred while updating information');
        }
    };

    return (
        <>
            <Navbar />
            <div className="profile-container">
                <div className="profile-section">
                    <div className="collapsible-header" onClick={() => setIsInfoOpen(!isInfoOpen)}>
                        <h2>Add Info to Your Account</h2>
                        <span className={`arrow-icon ${isInfoOpen ? 'open' : ''}`}></span>
                    </div>
                    {isInfoOpen && (
                        <form className="profile-form" onSubmit={handleSubmit}>
                            <label>
                                Firstname:
                                <input
                                    type="text"
                                    placeholder="Enter your firstname"
                                    value={firstname}
                                    onChange={(e) => setFirstname(e.target.value)}
                                />
                            </label>
                            <label>
                                Lastname:
                                <input
                                    type="text"
                                    placeholder="Enter your lastname"
                                    value={lastname}
                                    onChange={(e) => setLastname(e.target.value)}
                                />
                            </label>
                            <label>
                                In which department are you active?
                                <select value={department} onChange={(e) => setDepartment(e.target.value)}>
                                    <option value="">Select department</option>
                                    <option value="IT">IT Department</option>
                                    <option value="Marketing">Marketing Department</option>
                                    <option value="not-active">I am not active in a department</option>
                                </select>
                            </label>
                            <label>
                                In which province are you active?
                                <select value={province} onChange={(e) => setProvince(e.target.value)}>
                                    <option value="">No choice</option>
                                    <option value="vlaams-brabant">Vlaams-Brabant</option>
                                    <option value="waals-brabant">Waals-Brabant</option>
                                </select>
                            </label>
                            <label>What function(s) do you have?</label>
                            <div className="function-checkboxes">
                                {[
                                    'Animator Hartveilig',
                                    'Arts-lesgever',
                                    'Hoofdzetel Team Eerste Hulp',
                                    'Initiator JRK',
                                    'Kleuterinitiator',
                                    'Lesgever eerste hulp bij psychische problemen',
                                    'Lesgever eerstehulpverlening',
                                    'Lesgever eerstehulpverlening jeugd',
                                    'Lesgever eerstehulpverlening jeugd begeleider',
                                    'Lesgever reanimeren en defibrilleren',
                                    'Provincieverantwoordelijke Vorming',
                                    'Simulant lesgever'
                                ].map((func, index) => (
                                    <label key={index}>
                                        <input
                                            type="checkbox"
                                            value={func}
                                            onChange={handleFunctionChange}
                                        />
                                        {func}
                                    </label>
                                ))}
                            </div>
                            <button type="submit">Save Info</button>
                        </form>
                    )}
                </div>

                {isCreator && (
                    <div className="profile-section">
                        <h2>Created Workshops</h2>
                        <div className="workshop-container">
                            {workshops.length > 0 ? (
                                workshops.map((workshop) => (
                                    <div key={workshop.id} className="workshop-box">
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

                <div className="profile-section">
                    <h2>Subscribed Workshops</h2>
                    <div className="workshop-container">
                        {subscribedWorkshops.length > 0 ? (
                            subscribedWorkshops.map((workshop) => (
                                <div key={workshop.id} className="workshop-box">
                                    <div className="workshop-title">{workshop.title}</div>
                                    <div className="workshop-description">{workshop.description}</div>
                                </div>
                            ))
                        ) : (
                            <p>No subscribed workshops yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;
