import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { toast } from 'react-toastify';
import Navbar from './Navbar';
import '../assets/css/calendar.css';

const CalendarPage = () => {
    const [subscribedWorkshops, setSubscribedWorkshops] = useState([]);
    const [date, setDate] = useState(new Date()); // Current date
    const navigate = useNavigate();

    useEffect(() => {
        const email = localStorage.getItem('email');
        const token = localStorage.getItem('token');

        // If no token exists, redirect to login page
        if (!token) {
            navigate('/'); // Redirect to login
            return;
        }

        const fetchSubscribedWorkshops = async () => {
            try {
                const response = await fetch(`/api/get-subbed?email=${email}`);
                const data = await response.json();

                if (response.ok) {
                    setSubscribedWorkshops(data.workshops);
                } else {
                    toast.error(`Error fetching subscribed workshops: ${data.error}`);
                }
            } catch (error) {
                console.error('Error fetching subscribed workshops:', error);
                toast.error('Error fetching subscribed workshops');
            }
        };

        fetchSubscribedWorkshops();
    }, [navigate]);

    // Event handler to mark dates on the calendar
    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            const dateString = date.toISOString().split('T')[0]; // Format the date as yyyy-mm-dd
            // Check if the date matches any workshop date
            const isEventDate = subscribedWorkshops.some(workshop =>
                new Date(workshop.workshop_date).toISOString().split('T')[0] === dateString
            );
            return isEventDate ? 'highlight' : null;
        }
    };

    // Add titles of workshops to the calendar tile
    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const dateString = date.toISOString().split('T')[0]; // Format the date as yyyy-mm-dd
            const workshopsOnDay = subscribedWorkshops.filter(workshop =>
                new Date(workshop.workshop_date).toISOString().split('T')[0] === dateString
            );
            return workshopsOnDay.length > 0 ? (
                <ul>
                    {workshopsOnDay.map((workshop, index) => (
                        <li key={index} className="workshop-title">
                            {workshop.title}
                        </li>
                    ))}
                </ul>
            ) : null;
        }
    };

    return (
        <div>
            <Navbar />
            <h2>Upcoming Workshops</h2>
            <Calendar
                onChange={setDate}
                value={date}
                tileClassName={tileClassName}
                tileContent={tileContent}  // Add the content inside the tiles
            />
            <div className="events">
                <h3>Upcoming Events</h3>
                <ul>
                    {subscribedWorkshops.length > 0 ? (
                        subscribedWorkshops.map((workshop) => (
                            <li key={workshop.id}>
                                <strong>{workshop.title}</strong>
                                <br />
                                {new Date(workshop.workshop_date).toLocaleDateString()}
                            </li>
                        ))
                    ) : (
                        <p>No upcoming workshops</p>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default CalendarPage;
