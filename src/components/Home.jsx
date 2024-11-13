import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../assets/css/home.css';

const Home = () => {
    const [workshops, setWorkshops] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('email');

        if (!token) {
            // Redirect to login if no token is found
            navigate('/');
        } else if (email) {
            // Fetch all workshops excluding the ones created by the current user
            const fetchWorkshops = async () => {
                try {
                    const response = await fetch(`/api/all-workshops?email=${email}`);
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

            toast.success(`Welcome, ${email.split('@')[0]}!`);
        }
    }, [navigate]);

    const handleWorkshopClick = (workshopId) => {
        // Navigate to the Workshop.jsx component with the workshop ID as a route parameter
        navigate(`/workshop/${workshopId}`);
    };

    return (
        <div>
            <Navbar />
            <ToastContainer />
            <div className="homepage-container">
                <h2>All Workshops</h2>
                <div className="workshop-list">
                    {workshops.length > 0 ? (
                        workshops.map((workshop) => (
                            <div
                                key={workshop.id}
                                className="workshop-box"
                                onClick={() => handleWorkshopClick(workshop.id)}
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
        </div>
    );
};

export default Home;
