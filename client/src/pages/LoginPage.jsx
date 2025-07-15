import React, { useState } from 'react';
import { Link } from "react-router-dom"

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (event) => {
    event.preventDefault();

      // Replace with real auth logic using PostGres Database
      if (username === 'admin' && password === '1234') {
        setError('');
        setIsLoggedIn(true);
      } else {
        setError('Invalid credentials');
        setIsLoggedIn(false);
      }
  }
  
  const handleLogout = () => {
    setUsername('');
    setPassword('');
    setIsLoggedIn(false);
  };

  return (
    <div className="flex items-center justify-center">
      <form onSubmit={handleLogin}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Login</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
      <Link to="/admin" className="text-blue-700 font-bold ml-4">Go to Admin Page</Link>
    </div>
  );

}