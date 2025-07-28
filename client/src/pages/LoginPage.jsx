import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LabeledInput, SubmitButton } from './Components';

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
      <form onSubmit={handleLogin} className='flex flex-col items-center bg-gray-500/30 backdrop-blur-lg w-2/5 m-auto rounded-lg p-10 gap-2'>
        <div className='mb-5 w-full text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] font-bold text-3xl'>Subpar University</div>
        <LabeledInput label={"Username:"} value={username}></LabeledInput>
        <LabeledInput label={"Password:"} value={password} type={"password"}></LabeledInput>

        <SubmitButton text={"Login"} onClick={null} />
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );

}