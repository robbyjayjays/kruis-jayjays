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
    const [departments, setDepartments] = useState([]);
    const [department, setDepartment] = useState('');
    const [province, setProvince] = useState('');
    const [provincies, setProvincies] = useState([]);
    const [functions, setFunctions] = useState([]);
    const [availableFunctions, setAvailableFunctions] = useState([]);
    const [isInfoOpen, setIsInfoOpen] = useState(true);
    const [workshops, setWorkshops] = useState([]);
    const [workshopMorning, setWorkshopMorning] = useState('');
    const [workshopAfternoon, setWorkshopAfternoon] = useState('');
    const [dietaryPreferences, setDietaryPreferences] = useState('');
    const [dietaryOptions, setDietaryOptions] = useState([]); // Options for the dropdown
    const [allergies, setAllergies] = useState('');
    const [allergyOptions, setAllergyOptions] = useState([]); // Allergy options
    const [carpoolPreferences, setCarpoolPreferences] = useState('');
    const [carpoolOptions, setCarpoolOptions] = useState([]);
    const [hasInschrijving, setHasInschrijving] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [showRkvForm, setShowRkvForm] = useState(false);
    const [inschrijvingDetails, setInschrijvingDetails] = useState(null);

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

        const fetchWorkshops = async () => {
            try {
                const response = await fetch(`/api/get-workshops?email=${email}&isAdmin=false`);
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


        const fetchDepartments = async () => {
            try {
                const response = await fetch('/api/get-workshops?Departement=true');
                const data = await response.json();
                if (response.ok) {
                    setDepartments(data.departementen || []); // Populate options
                } else {
                    console.error('Error fetching departments:', data.error);
                }
            } catch (error) {
                console.error('Error fetching departments:', error);
            }
        };

        fetchDepartments();

        const fetchProvincies = async () => {
            try {
                const response = await fetch('/api/get-workshops?Province=true');
                const data = await response.json();
                if (response.ok) {
                    setProvincies(data.provincies || []); // Populate options
                } else {
                    console.error('Error fetching provincies:', data.error);
                }
            } catch (error) {
                console.error('Error fetching provincies:', error);
            }
        };

        fetchProvincies();

        const fetchFunctions = async () => {
            try {
                const response = await fetch('/api/get-workshops?Functie=true'); // Adjust API endpoint
                const data = await response.json();
                if (response.ok) {
                    setAvailableFunctions(data.functies || []); // Populate available functions
                } else {
                    console.error('Error fetching functions:', data.error);
                }
            } catch (error) {
                console.error('Error fetching functions:', error);
            }
        };

        fetchFunctions();


        const fetchInschrijvingen = async () => {
            try {
                const email = localStorage.getItem('email');
                if (!email) {
                    console.error('No email found in localStorage');
                    return;
                }
        
                const response = await fetch(`/api/inschrijvingen?email=${email}`);
                const data = await response.json();
                if (response.ok) {
                    if (data.exists) {
                        setInschrijvingDetails({
                            department: data.inschrijving.department || 'N/A',
                            province: data.inschrijving.province || 'N/A',
                            workshopMorning: data.inschrijving.workshop_morning || 'N/A',
                            workshopAfternoon: data.inschrijving.workshop_afternoon || 'N/A',
                            dietaryPreferences: data.inschrijving.food_choice || 'N/A',
                            allergies: data.inschrijving.allergies || 'N/A',
                            carpoolPreferences: data.inschrijving.carpool || 'N/A',
                        });
                        setHasInschrijving(true); // Update state if an inschrijving exists
                    } else {
                        setHasInschrijving(false); // No inschrijving found
                    }
                } else {
                    console.error('Error fetching inschrijvingen:', data.error);
                }
            } catch (error) {
                console.error('Error fetching inschrijvingen:', error);
            }
        };
        
        fetchInschrijvingen();

        const fetchDietaryOptions = async () => {
            try {
                const response = await fetch('/api/eetvoorkeuren'); // Replace with your API route
                if (response.ok) {
                    const data = await response.json();
                    console.log('Fetched dietary options:', data); // Debugging log
                    setDietaryOptions(data); // Set fetched options
                } else {
                    console.error('Failed to fetch dietary preferences');
                }
            } catch (error) {
                console.error('Error fetching dietary preferences:', error);
            }
        };

        const fetchAllergyOptions = async () => {
            try {
                const response = await fetch('/api/allergies'); // API for allergies
                if (response.ok) {
                    const data = await response.json();
                    console.log('Allergy options:', data);
                    setAllergyOptions(data);
                } else {
                    console.error('Failed to fetch allergies');
                }
            } catch (error) {
                console.error('Error fetching allergies:', error);
            }
        };
    
        const fetchCarpoolOptions = async () => {
            try {
                const response = await fetch('/api/carpool'); // API for carpool options
                if (response.ok) {
                    const data = await response.json();
                    console.log('Carpool options:', data);
                    setCarpoolOptions(data);
                } else {
                    console.error('Failed to fetch carpool options');
                }
            } catch (error) {
                console.error('Error fetching carpool options:', error);
            }
        };
    
        fetchDietaryOptions();
        fetchAllergyOptions();
        fetchCarpoolOptions();

    }, [navigate, email]);

    // Filtered workshops for the afternoon based on the morning selection
    const filteredAfternoonWorkshops = workshops.filter(
        (workshop) => workshop.title !== workshopMorning
    );

    // Filtered workshops for the morning based on the afternoon selection
    const filteredMorningWorkshops = workshops.filter(
        (workshop) => workshop.title !== workshopAfternoon
    );

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
                window.location.reload();
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

    const handleAnnuleren = async () => {
        const email = localStorage.getItem('email');
      
        if (!email) {
          console.error('No email found in localStorage');
          return;
        }
      
        try {
          const response = await fetch(`/api/inschrijvingen?email=${email}`, {
            method: 'DELETE',
          });
      
          const data = await response.json();
      
          if (response.ok) {
            console.log('Inschrijving deleted:', data.message);
            // Optional: Trigger a page reload or UI update
            window.location.reload();
          } else {
            console.error('Error deleting inschrijving:', data.error);
          }
        } catch (error) {
          console.error('Error:', error);
        }
    };
    
    const handleAanpassen = async () => {
        // Perform form validation (if needed)
        if (!department.trim() || !province.trim() || functions.length === 0) {
            alert('Please fill out all required fields.');
            return;
        }
    
        try {
            // Send the updated data to the backend
            const response = await fetch(`/api/inschrijvingen`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email, // Unique identifier for the user
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
                alert('Inschrijving successfully updated!');
                setShowRkvForm(false); // Close the form after updating
                setShowOptions(false);
            } else {
                const errorData = await response.json();
                alert(`Failed to update inschrijving: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error updating inschrijving:', error);
            alert('An error occurred while updating inschrijving.');
        }
    };
    
    
    const handleEditInschrijving = async () => {
        try {
            const response = await fetch(`/api/inschrijvingen?email=${email}`);
            const data = await response.json();

            if (response.ok && data.exists) {
                const { inschrijving } = data;
                setDepartment(inschrijving.department || '');
                setProvince(inschrijving.province || '');
                setFunctions(inschrijving.functions || []);
                setWorkshopMorning(inschrijving.workshop_morning || '');
                setWorkshopAfternoon(inschrijving.workshop_afternoon || '');
                setDietaryPreferences(inschrijving.food_choice || '');
                setAllergies(inschrijving.allergies || '');
                setCarpoolPreferences(inschrijving.carpool || '');
                setShowRkvForm(true);
            } else {
                alert('No inschrijving found.');
            }
        } catch (error) {
            console.error('Error fetching inschrijving:', error);
            alert('An error occurred while fetching inschrijving.');
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
                                <button onClick={() => setIsInfoOpen(true)}>Informatie aanpassen.</button>
                            </div>
                        )}
                    </div>
                </form>
                {!isInfoOpen && (!hasInschrijving || showRkvForm) && (
                <form className="profile-form" onSubmit={handleSubmitRkv}>
                    {/* RKV Information Section */}
                    <div className="profile-section">
                        <h2>Jouw RKV informatie</h2>
                        <label>
                            In welk departement ben je actief?
                            <select value={department} onChange={(e) => setDepartment(e.target.value)}>
                            <option value="">Selecteer departement</option>
                            {departments.map((dept) => (
                                <option key={dept.id} value={dept.departement_name}>
                                    {dept.departement_name}
                                </option>
                            ))}
                            </select>
                        </label>
                        <label>
                            In welke provincie ben je actief?
                            <select value={province} onChange={(e) => setProvince(e.target.value)}>
                                <option value="">No choice</option>
                                {provincies.map((prov) => (
                                    <option key={prov.id} value={prov.provincie_name}>
                                        {prov.provincie_name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label>Welke functie(s) heb je?</label>
                        <div className="function-checkboxes">
                            {availableFunctions.map((func) => (
                                <label key={func.id}>
                                    <input
                                        type="checkbox"
                                        value={func.function_name} // Assuming `name` is the column for function names
                                        checked={functions.includes(func.function_name)}
                                        onChange={handleFunctionChange}
                                    />
                                    {func.function_name}
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
                                        >
                                            <div className="workshop-title">{workshop.title}</div>
                                            <div className="workshop-description">{workshop.description}</div>
                                        </div>
                                    ))
                                ) : (
                                    <p>Geen workshops gevonden.</p>
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
                                {filteredMorningWorkshops.map((workshop) => (
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
                                {filteredAfternoonWorkshops.map((workshop) => (
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
                            <select
                                value={allergies}
                                onChange={(e) => setAllergies(e.target.value)}
                            >
                                <option value="">Selecteer allergieën</option>
                                {allergyOptions.map((option, index) => (
                                    <option key={index} value={option.allergy_name}>
                                        {option.allergy_name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Carpool:
                            <select
                                value={carpoolPreferences}
                                onChange={(e) => setCarpoolPreferences(e.target.value)}
                            >
                                <option value="">Selecteer carpool voorkeur</option>
                                {carpoolOptions.map((option, index) => (
                                    <option key={index} value={option.carpool_role}>
                                        {option.carpool_role}
                                    </option>
                                ))}
                            </select>
                        </label>
                        {!showRkvForm && (
                            <button type="submit">Opslaan</button>
                        )}
                    </div>
                </form>
                )};

                {/* Edit or Cancel inschrijving */}
                {!isInfoOpen && (
                    <div className="profile-section">
                        {hasInschrijving ? (
                            <div className="edit-cancel-section">
                                {!showOptions ? (
                                    <>
                                        <p>Als je jouw inschrijving wilt annuleren of aanpassen klik hier:</p>
                                        <div className="inschrijving-details">
                                            <h3>Jouw Inschrijving Details</h3>
                                            <p>Departement: {inschrijvingDetails?.department || 'N/A'}</p>
                                            <p>Provincie: {inschrijvingDetails?.province || 'N/A'}</p>
                                            <p>Ochtend Workshop: {inschrijvingDetails?.workshopMorning || 'N/A'}</p>
                                            <p>Namiddag Workshop: {inschrijvingDetails?.workshopAfternoon || 'N/A'}</p>
                                            <p>Eetvoorkeur: {inschrijvingDetails?.dietaryPreferences || 'N/A'}</p>
                                            <p>Allergieën: {inschrijvingDetails?.allergies || 'N/A'}</p>
                                            <p>Carpool Optie: {inschrijvingDetails?.carpoolPreferences || 'N/A'}</p>
                                        </div>
                                        <button
                                            className="edit-cancel-button"
                                            onClick={() => {
                                                setShowOptions(true);
                                                handleEditInschrijving();

                                                }}
                                        >
                                            Annuleren of aanpassen van inschrijving.
                                        </button>
                                    </>
                                ) : (
                                    <div className="option-buttons">
                                        <button
                                            className="cancel-button"
                                            onClick={handleAnnuleren} // Add your logic for annuleren
                                        >
                                            Annuleren
                                        </button>
                                        <button
                                            className="edit-button"
                                            onClick={handleAanpassen} // Add your logic for aanpassen
                                        >
                                            Aanpassen
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p>Er is nog geen inschrijving gevonden.</p>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default Profile;
