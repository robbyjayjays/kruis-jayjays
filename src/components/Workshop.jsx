import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Workshop = () => {
    const { id } = useParams(); // Get the workshop ID from the route parameter
    const [workshop, setWorkshop] = useState(null);

    useEffect(() => {
        const fetchWorkshop = async () => {
            try {
                const response = await fetch(`/api/get-workshop?id=${id}`);
                const data = await response.json();

                if (response.ok) {
                    setWorkshop(data.workshop);
                } else {
                    console.error('Error fetching workshop:', data.error);
                }
            } catch (error) {
                console.error('Error fetching workshop:', error);
            }
        };

        fetchWorkshop();
    }, [id]);

    return (
        <div>
            {workshop ? (
                <div>
                    <h1>{workshop.title}</h1>
                    <p>{workshop.description}</p>
                    {/* Add more details as needed */}
                </div>
            ) : (
                <p>Loading workshop details...</p>
            )}
        </div>
    );
};

export default Workshop;
