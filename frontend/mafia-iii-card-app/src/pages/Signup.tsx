import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api';
import { useAuth } from '../AuthContext';

const Signup: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous error messages
    try {
      const { data } = await registerUser({ username, password });
      console.log('Token received:', data.token); // Debugging
      localStorage.setItem('token', data.token);
      login();
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Registration failed. Please try again.'); // Set error message
    }
  };

  return (
    <div className="container">
      <h1>Signup</h1>
      {error && <p className="error-message">{error}</p>} {/* Display error message */}
      <form onSubmit={handleSubmit} className="form-fade-in">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
