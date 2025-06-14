import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';   
import { useRole } from './RoleContext'; 
import "./Login.css";

function LoginPage() {
  const [username, setUsername] = useState('');  // Email input field
  const [password, setPassword] = useState('');  // Password input field
  const [error, setError] = useState(null);  // State to hold error message
  const [loading, setLoading] = useState(false);  // State to handle loading state
  const navigate = useNavigate();  // Hook to navigate to the next page
  const { login } = useAuth(); 
  const { setRole } = useRole();

  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent default form submission

    // Basic form validation
    if (!username || !password) {
      setError('Email and password are required');
      return;
    }

    setLoading(true);  // Set loading state to true

    // Mock user role assignment (as the API part has been removed)
    const userRole = 'admin'; // Replace with role based on your app's logic

    try {
      // Simulating a successful login
      login();
      setRole(userRole);  // Set the role for the user

      // Navigate to the Take Order page with role as state
      navigate('/takeorder', { state: { role: userRole } });
  
    } catch (err) {
      console.log(err);
      setError('Invalid Email/Password');
    } finally {
      setLoading(false);  // Reset loading state after the request
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-shape"></div>
        <div className="login-shape"></div>
      </div>

      <form onSubmit={handleSubmit} className="login-form">
        <h3>Login Here</h3>
        <p>Enter Details of your choice</p>

        <label htmlFor="username">Email</label>
        <input
          type="email"
          placeholder="Enter your Email"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}  // Set username when input changes
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          placeholder="Enter your Password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}  // Set password when input changes
        />

        <div className="login-button">
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </div>

        {error && <p className="error-message">{error}</p>}

        <a href="/signup">Create an account</a>
      </form>
    </div>
  );
}

export default LoginPage;
