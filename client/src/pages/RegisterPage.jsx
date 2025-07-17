import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();

      // Replace with real auth logic using PostGres Database
      if (username === 'admin' && password === '1234') {
        setError('');
        setIsLoggedIn(true);
        navigate('/admin');
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
    <div className="flex items-center justify-center min-h-screen text-black">
      <form onSubmit={handleLogin} className='flex flex-col items-center bg-gray-500/30 backdrop-blur-lg w-1/4 m-auto rounded-lg p-10'>
      <div className='mb-5 w-full text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] font-bold text-3xl'>Subpar University</div>
        <div className='mb-3 flex w-full justify-between pr-1'>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className='flex w-full justify-between pr-1'>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className='w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 mt-5'>Register</button>

        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );

}