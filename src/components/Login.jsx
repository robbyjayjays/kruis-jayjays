import React, { useState } from 'react';
import '../assets/css/login.css';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
  
    const submitForm = async (e) => {
      e.preventDefault();
  
      const userData = { email, password };
  
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });
  
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Server error: ${response.status}, ${errorText}`);
        }
  
        const data = await response.json();
  
        // Store the JWT token in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('email', data.user.email);
        localStorage.setItem('isCreator', data.user.creator)
        if (data.user.firstname) {
          localStorage.setItem('firstname', data.user.firstname); // Store firstname if it exists
        }
        if (data.user.lastname) {
          localStorage.setItem('lastname', data.user.lastname); // Store firstname if it exists
        }
        if (data.user.gebruiker) {
          localStorage.setItem('gebruiker', data.user.gebruiker); // Store firstname if it exists
        }
        if (data.user.department) {
          localStorage.setItem('department', data.user.department);
        }
        if (data.user.province) {
          localStorage.setItem('province', data.user.province);
        }
        if (data.user.functions) {
          localStorage.setItem('functions', JSON.stringify(data.user.functions));
        }

  
        toast.success('Login successvol!');
  
        // Navigate to homepage after successful login
        navigate('/Profile');
      } catch (error) {
        console.error('Login error:', error);
        toast.error('Foutive gegevens.');
      }
    };
    return (
        <div className="login-container">
            <ToastContainer />
            <div className="form-container">
                <h2>Login</h2>
                <form onSubmit={submitForm}>
                    <input
                        type="text"
                        placeholder="Geef je email hier."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Geef je passwoord hier."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit" className='loginbutton'>Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
