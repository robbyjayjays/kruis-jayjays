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
    const [allergies, setAllergies] = useState('');
    const [carpoolPreferences, setCarpoolPreferences] = useState('');
    const email = localStorage.getItem('email');

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

        if (savedFirstname) {
            setIsFirstname(true);
            setFirstname(savedFirstname);
            setLastname(savedLastname || '');
            setGebruiker(savedGebruiker || '');
            setIsInfoOpen(false);
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

        fetchSubscribedWorkshops();
    }, [navigate]);

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
            alert('An error occurred while updating information');
        }
    };

    return (
        <>
            <Navbar />
            <form className="profile-form" onSubmit={handleSubmit}>
                {/* RKV Information Section */}
                <div className="profile-section">
                    <h2>Jouw RKV informatie.</h2>
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

                {/* Workshops and Personal Info Section */}
                <div className="profile-section">
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
                    <h3>Persoonlijke info</h3>
                    <label>
                        Eetvoorkeuren:
                        <input
                            type="text"
                            placeholder="Eetvoorkeuren"
                            value={dietaryPreferences}
                            onChange={(e) => setDietaryPreferences(e.target.value)}
                        />
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
                </div>

                {/* Submit Button */}
                <button type="submit">Ga door.</button>
            </form>
        </>
    );
};

export default Profile;
