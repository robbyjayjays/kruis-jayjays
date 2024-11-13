import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react'; 
import dayGridPlugin from '@fullcalendar/daygrid'; 
import interactionPlugin from '@fullcalendar/interaction'; 
import { toast } from 'react-toastify';
import Navbar from './Navbar';
import '../assets/css/calendar.css';

const CalendarPage = () => {
    const [subscribedWorkshops, setSubscribedWorkshops] = useState([]);
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

    // Format the workshops for FullCalendar
    const calendarEvents = subscribedWorkshops.map((workshop) => ({
        title: workshop.title,
        date: new Date(workshop.workshop_date).toISOString().split('T')[0], // Ensure correct format (YYYY-MM-DD)
        description: workshop.description,
    }));

    return (
        <div>
            <Navbar />
            <h2>Upcoming Workshops</h2>
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={calendarEvents} // Pass the formatted workshops as events
                dateClick={(info) => {
                    // Optionally, handle date click (e.g., show more workshop details or a form)
                    console.log('Clicked on date: ', info.dateStr);
                }}
                eventClick={(info) => {
                    // Navigate to the workshop detail page when clicking on an event
                    const clickedWorkshop = subscribedWorkshops.find(
                        (workshop) => workshop.title === info.event.title
                    );
                    navigate(`/workshop/${clickedWorkshop.id}`);
                }}
            />
        </div>
    );
};

export default CalendarPage;
