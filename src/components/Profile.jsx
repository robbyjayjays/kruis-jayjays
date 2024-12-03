import React, { useState, useEffect } from 'react';
import '../assets/css/profile.css';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const Profile = () => {
    const navigate = useNavigate();
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [gebruiker, setGebruiker] = useState('');
    const [department, setDepartment] = useState('');
    const [province, setProvince] = useState('');
    const [functions, setFunctions] = useState([]);
    const [workshopMorning, setWorkshopMorning] = useState('');
    const [workshopAfternoon, setWorkshopAfternoon] = useState('');
    const [foodChoice, setFoodChoice] = useState('');
    const [allergies, setAllergies] = useState('');
    const [carpool, setCarpool] = useState('');

    useEffect(() => {
        const savedFirstname = localStorage.getItem('firstname');
        const savedLastname = localStorage.getItem('lastname');
        const savedGebruiker = localStorage.getItem('gebruiker');

        if (savedFirstname) setFirstname(savedFirstname);
        if (savedLastname) setLastname(savedLastname);
        if (savedGebruiker) setGebruiker(savedGebruiker);
    }, []);

    // Handle submission of personal info form
    const handlePersonalInfoSubmit = async (e) => {
        e.preventDefault();

        if (!firstname || !lastname || !gebruiker) {
            alert('Please fill out all required fields in Personal Info.');
            return;
        }

        try {
            const email = localStorage.getItem('email');
            if (!email) {
                alert('User email not found. Please log in.');
                return;
            }

            const userResponse = await fetch('/api/get-user-id', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (!userResponse.ok) {
                const errorData = await userResponse.json();
                throw new Error(errorData.error || 'Failed to fetch user ID.');
            }

            const { user_id } = await userResponse.json();

            const personalInfoData = {
                user_id,
                firstname,
                lastname,
                gebruiker,
            };

            const saveResponse = await fetch('/api/save-personal-info', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(personalInfoData),
            });

            if (saveResponse.ok) {
                alert('Personal info updated successfully.');
                localStorage.setItem('firstname', firstname);
                localStorage.setItem('lastname', lastname);
                localStorage.setItem('gebruiker', gebruiker);
            } else {
                const errorData = await saveResponse.json();
                throw new Error(errorData.error || 'Failed to update personal info.');
            }
        } catch (error) {
            console.error('Error updating personal info:', error);
            alert('An error occurred while updating personal info.');
        }
    };

    // Handle submission of RKV info form
    const handleRKVSubmit = async (e) => {
        e.preventDefault();

        try {
            const email = localStorage.getItem('email');
            if (!email) {
                alert('User email not found. Please log in.');
                return;
            }

            const userResponse = await fetch('/api/get-user-id', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (!userResponse.ok) {
                const errorData = await userResponse.json();
                throw new Error(errorData.error || 'Failed to fetch user ID.');
            }

            const { user_id } = await userResponse.json();

            const rkvData = {
                user_id,
                department,
                province,
                functions,
                workshop_morning: workshopMorning,
                workshop_afternoon: workshopAfternoon,
                food_choice: foodChoice,
                allergies,
                carpool,
            };

            const saveResponse = await fetch('/api/save-rkv-info', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(rkvData),
            });

            if (saveResponse.ok) {
                alert('RKV info submitted successfully.');
            } else {
                const errorData = await saveResponse.json();
                throw new Error(errorData.error || 'Failed to submit RKV info.');
            }
        } catch (error) {
            console.error('Error submitting RKV info:', error);
            alert('An error occurred while submitting RKV info.');
        }
    };

    return (
        <>
            <Navbar />
            <div className="profile-container">
                <form className="profile-form" onSubmit={handlePersonalInfoSubmit}>
                    <h2>Personal Info</h2>
                    <label>
                        Voornaam:
                        <input
                            type="text"
                            value={firstname}
                            onChange={(e) => setFirstname(e.target.value)}
                        />
                    </label>
                    <label>
                        Achternaam:
                        <input
                            type="text"
                            value={lastname}
                            onChange={(e) => setLastname(e.target.value)}
                        />
                    </label>
                    <label>
                        Gebruiker:
                        <input
                            type="text"
                            value={gebruiker}
                            onChange={(e) => setGebruiker(e.target.value)}
                        />
                    </label>
                    <button type="submit">Save Personal Info</button>
                </form>

                <form className="profile-form" onSubmit={handleRKVSubmit}>
                    <h2>RKV Info</h2>
                    <label>
                        Department:
                        <select value={department} onChange={(e) => setDepartment(e.target.value)}>
                            <option value="">Select department</option>
                            <option value="IT">IT Department</option>
                            <option value="Marketing">Marketing Department</option>
                            <option value="not-active">Not active</option>
                        </select>
                    </label>
                    <label>
                        Province:
                        <select value={province} onChange={(e) => setProvince(e.target.value)}>
                            <option value="">Select province</option>
                            <option value="vlaams-brabant">Vlaams-Brabant</option>
                            <option value="waals-brabant">Waals-Brabant</option>
                        </select>
                    </label>
                    <label>Functions:</label>
                    <div>
                        {['Func1', 'Func2'].map((func, i) => (
                            <label key={i}>
                                <input
                                    type="checkbox"
                                    value={func}
                                    checked={functions.includes(func)}
                                    onChange={(e) => {
                                        setFunctions((prev) =>
                                            prev.includes(func)
                                                ? prev.filter((f) => f !== func)
                                                : [...prev, func]
                                        );
                                    }}
                                />
                                {func}
                            </label>
                        ))}
                    </div>
                    <button type="submit">Submit RKV Info</button>
                </form>
            </div>
        </>
    );
};

export default Profile;
