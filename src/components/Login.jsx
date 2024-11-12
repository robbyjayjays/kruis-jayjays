import React from 'react';
import '../assets/css/login.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

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
  
        toast.success('Login successful!');
  
        // Navigate to homepage after successful login
        navigate('/Home');
      } catch (error) {
        console.error('Login error:', error);
        toast.error('Invalid credentials. Please try again.');
      }
    };
    return (
        <div className="login-container">
            <div className="form-container">
                <h2>Login</h2>
                <form>
                    <input type="text" placeholder="Username" />
                    <input type="password" placeholder="Password" />
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;