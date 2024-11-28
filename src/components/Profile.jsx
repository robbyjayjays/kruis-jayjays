import React, { useState, useEffect } from 'react';
import '../assets/css/profile.css';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const Profile = () => {
    const navigate = useNavigate();
    const [isCreator, setIsCreator] = useState(false);
    const [isFirstname, setIsFirstname] = useState(false);
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [gebruiker, setGebruiker] = useState('');
    const [department, setDepartment] = useState('');
    const [province, setProvince] = useState('');
    const [functions, setFunctions] = useState([]);
    const [isInfoOpen, setIsInfoOpen] = useState(true);
    const [workshops, setWorkshops] = useState([]);
    const [subscribedWorkshops, setSubscribedWorkshops] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('email');
        const savedFirstname = localStorage.getItem('firstname');
        const savedLastname = localStorage.getItem('lastname');
        const savedGebruiker = localStorage.getItem('gebruiker');

        if (!token) {
            alert('You need to be logged in to access this page.');
            navigate('/'); // Redirect to login page
            return;
        }

        const creatorStatus = localStorage.getItem('isCreator') === 'true';
        setIsCreator(creatorStatus);

        // Set other state values if they exist
        if (savedFirstname) {
            setIsFirstname(true);
            setFirstname(savedFirstname);
            setLastname(savedLastname || '');
            setGebruiker(savedGebruiker || '');
            setIsInfoOpen(false); // Switch to read-only mode
        }

        // Fetch workshops if the user is a creator
        if (creatorStatus) {
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

        // Fetch subscribed workshops
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
        setFunctions((prevFunctions) =>
            prevFunctions.includes(value)
                ? prevFunctions.filter((func) => func !== value) // Remove if already selected
                : [...prevFunctions, value] // Add if not already selected
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!firstname.trim()) {
            alert('Firstname is required. Please fill it in.');
            return;
        }

        if (!lastname.trim()) {
            alert('Lastname is required. Please fill it in.');
            return;
        }

        if (!gebruiker.trim()) {
            alert('Please select your department.');
            return;
        }

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
                body: JSON.stringify({ email, firstname, lastname, gebruiker }),
            });

            if (response.ok) {
                alert('Information updated successfully');
                // Update localStorage and state
                localStorage.setItem('firstname', firstname);
                localStorage.setItem('lastname', lastname);
                localStorage.setItem('gebruiker', gebruiker);

                setIsFirstname(true);
                setIsInfoOpen(false); // Switch to read-only mode
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
                    <div>
                        <h2>Voeg info toe aan jouw profiel</h2>
                    </div>
                    {isInfoOpen ? (
                        <form className="profile-form" onSubmit={handleSubmit}>
                            <label>
                                Voornaam:
                                <input
                                    type="text"
                                    placeholder="Vul jouw voornaam in."
                                    value={firstname}
                                    onChange={(e) => setFirstname(e.target.value)}
                                />
                            </label>
                            <label>
                                Naam:
                                <input
                                    type="text"
                                    placeholder="Vul jouw naam in."
                                    value={lastname}
                                    onChange={(e) => setLastname(e.target.value)}
                                />
                            </label>
                            <label>
                                Gebruiker:
                                <input
                                    type="text"
                                    placeholder="Vul jouw gebruiker in."
                                    value={gebruiker}
                                    onChange={(e) => setGebruiker(e.target.value)}
                                />
                            </label>
                            <button type="submit">Ga door.</button>
                        </form>
                    ) : (
                        <div className="profile-form">
                            <label>
                                Voornaam:
                                <input type="text" value={firstname} disabled />
                            </label>
                            <label>
                                Naam:
                                <input type="text" value={lastname} disabled />
                            </label>
                            <label>
                                Gebruiker:
                                <input type="text" value={gebruiker} disabled />
                            </label>
                            <button onClick={() => setIsInfoOpen(true)}>Edit Info</button>
                            <form className="profile-form" onSubmit={handleSubmit}>
                            <div>
                                <h2>Jouw RKV informatie.</h2>
                            </div>
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
                                        'Simulant lesgever',
                                    ].map((func, index) => (
                                        <label key={index}>
                                            <input
                                                type="checkbox"
                                                value={func}
                                                checked={functions.includes(func)}
                                                onChange={handleFunctionChange}
                                            />
                                            {func}
                                        </label>
                                    ))}
                                </div>
                            </form>
                        </div>
                    )}
                </div>
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
                {isFirstname && (
                    <div className="profile-section">
                        <h2>Subscribed Workshops</h2>
                        <div className="workshop-container">
                            {subscribedWorkshops.length > 0 ? (
                                subscribedWorkshops.map((workshop) => (
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
                                <div>
                                    <p>No subscribed workshops yet.</p>
                                    <button
                                        className="navbar-button"
                                        onClick={() => navigate('/Home')}
                                    >
                                        Look at workshops
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Profile;
