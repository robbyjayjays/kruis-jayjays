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
    const [workshopMorning, setWorkshopMorning] = useState('');
    const [workshopAfternoon, setWorkshopAfternoon] = useState('');
    const [dietaryPreferences, setDietaryPreferences] = useState('');
    const [dietaryOptions, setDietaryOptions] = useState([]); // Options for the dropdown
    const [allergies, setAllergies] = useState('');
    const [carpoolPreferences, setCarpoolPreferences] = useState('');
    const email = localStorage.getItem('email');

    useEffect(() => {
        const token = localStorage.getItem('token');
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

        if (savedFirstname) {
            setIsFirstname(true);
            setFirstname(savedFirstname);
            setLastname(savedLastname || '');
            setGebruiker(savedGebruiker || '');
            setIsInfoOpen(false); // Switch to read-only mode
        }

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

        const fetchDietaryOptions = async () => {
            try {
                const response = await fetch('/api/eetvoorkeuren'); // Replace with your API route
                if (response.ok) {
                    const data = await response.json();
                    console.log(data)
                    setDietaryOptions(data);
                } else {
                    console.error('Failed to fetch dietary preferences');
                }
            } catch (error) {
                console.error('Error fetching dietary preferences:', error);
            }
        };
        fetchDietaryOptions();


        fetchSubscribedWorkshops();
    }, [navigate, email]);

    const handleFunctionChange = (e) => {
        const value = e.target.value;
        setFunctions((prevFunctions) =>
            prevFunctions.includes(value)
                ? prevFunctions.filter((func) => func !== value)
                : [...prevFunctions, value]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!firstname.trim() || !lastname.trim() || !gebruiker.trim()) {
            alert('Please fill out all required fields.');
            return;
        }

        try {
            const response = await fetch('/api/add-info', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, firstname, lastname, gebruiker }),
            });

            if (response.ok) {
                alert('Information updated successfully.');
                localStorage.setItem('firstname', firstname);
                localStorage.setItem('lastname', lastname);
                localStorage.setItem('gebruiker', gebruiker);
                setIsFirstname(true);
                setIsInfoOpen(false);
            } else {
                const errorData = await response.json();
                alert(`Failed to update information: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error updating user info:', error);
            alert('An error occurred while updating information.');
        }
    };

    const handleSubmitRkv = async (e) => {
        e.preventDefault();
    
        // Validate required fields
        if (
            !department.trim() ||
            !province.trim() ||
            functions.length === 0 ||
            !workshopMorning.trim() ||
            !workshopAfternoon.trim() ||
            !dietaryPreferences.trim() ||
            !allergies.trim() ||
            !carpoolPreferences.trim()
        ) {
            alert('Please fill out all required fields in the RKV form.');
            return;
        }
    
        try {
            // API call to save RKV and workshop info
            const response = await fetch('/api/save-rkv-info', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    department,
                    province,
                    functions,
                    morningWorkshop: workshopMorning,
                    afternoonWorkshop: workshopAfternoon,
                    dietaryPreferences,
                    allergies,
                    carpoolPreferences,
                }),
            });

            if (response.ok) {
                alert('RKV and workshop information saved successfully.');
                // Optionally clear the form or provide user feedback
            } else {
                const errorData = await response.json();
                alert(`Failed to save RKV information: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error saving RKV information:', error);
            alert('An error occurred while saving RKV information.');
        }
    };
    

    return (
        <>
            <Navbar />
            <div className="profile-container">
                <form className="profile-form" onSubmit={handleSubmit}>
                    {/* Profile Information Section */}
                    <div className="profile-section">
                        <div>
                            <h2>Voeg info toe aan jouw profiel</h2>
                        </div>
                        {isInfoOpen ? (
                            <>
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
                            </>
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
                            </div>
                        )}
                    </div>
                </form>
                <form className="profile-form" onSubmit={handleSubmitRkv}>
                    {/* RKV Information Section */}
                    <div className="profile-section">
                        <h2>Jouw RKV informatie</h2>
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
                    </div>

                    {/* Workshops Section */}
                    {!isInfoOpen && (
                        <div className="profile-section">
                            <h2>Workshops</h2>
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
                                    <p>No workshops available.</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Workshop Selection Section */}
                    <div className="profile-section">
                        <h2>Jouw Keuze</h2>
                        <label>
                            Voormiddag:
                            <select value={workshopMorning} onChange={(e) => setWorkshopMorning(e.target.value)}>
                                <option value="">Selecteer een workshop</option>
                                {workshops.map((workshop) => (
                                    <option key={workshop.id} value={workshop.title}>
                                        {workshop.title}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Namiddag:
                            <select value={workshopAfternoon} onChange={(e) => setWorkshopAfternoon(e.target.value)}>
                                <option value="">Selecteer een workshop</option>
                                {workshops.map((workshop) => (
                                    <option key={workshop.id} value={workshop.title}>
                                        {workshop.title}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Eetvoorkeuren:
                            <select
                                value={dietaryPreferences}
                                onChange={(e) => setDietaryPreferences(e.target.value)}
                            >
                                <option value="">Selecteer eetvoorkeur</option>
                                {dietaryOptions.map((option) => (
                                    <option key={option.id} value={option.preference_name}>
                                        {option.preference_name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Allergiën:
                            <input
                                type="text"
                                placeholder="Allergieën"
                                value={allergies}
                                onChange={(e) => setAllergies(e.target.value)}
                            />
                        </label>
                        <label>
                            Carpool:
                            <input
                                type="text"
                                placeholder="Carpool voorkeuren"
                                value={carpoolPreferences}
                                onChange={(e) => setCarpoolPreferences(e.target.value)}
                            />
                        </label>
                        <button type="submit">Opslaan</button>
                    </div>
                </form>

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

                {/* Subscribed Workshops Section */}
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
