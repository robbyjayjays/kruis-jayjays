import React from 'react';
import '../assets/css/profile.css';

const Profile = () => {
    // Placeholder for logic to determine if the user is a creator
    const isCreator = true; // Replace with real logic

    return (
        <div className="profile-container">
            <div className="profile-section">
                <h2>Add Info to Your Account</h2>
                <form className="profile-form">
                    <label>
                        Name:
                        <input type="text" placeholder="Enter your name" />
                    </label>
                    <label>
                        Bio:
                        <textarea placeholder="Tell us about yourself"></textarea>
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
    );
};

export default Profile;
