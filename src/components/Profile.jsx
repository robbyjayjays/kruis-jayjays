import React, { useState } from 'react';
import '../assets/css/profile.css';
import Navbar from './Navbar';

const Profile = () => {
    // Placeholder for logic to determine if the user is a creator
    const isCreator = true; // Replace with real logic
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Retrieve the email from localStorage to identify the current user
            const email = localStorage.getItem('email');

            if (!email) {
                alert('User email not found. Please log in.');
                return;
            }

            // Make the PUT request to update the user's firstname and lastname
            const response = await fetch('/api/add-info', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, firstname, lastname }),
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
                  <h2>Add Info to Your Account</h2>
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
                      <button type="submit">Save Info</button>
                  </form>
              </div>

              {isCreator && (
                  <div className="profile-section">
                      <h2>Created Workshops</h2>
                      <ul className="workshop-list">
                          <li>Workshop 1</li>
                          <li>Workshop 2</li>
                          {/* Replace with a dynamic list later */}
                      </ul>
                  </div>
              )}

              <div className="profile-section">
                  <h2>Subscribed Workshops</h2>
                  <ul className="workshop-list">
                      <li>Subscribed Workshop 1</li>
                      <li>Subscribed Workshop 2</li>
                      {/* Replace with a dynamic list later */}
                  </ul>
              </div>
          </div>
        </>
    );
};

export default Profile;
