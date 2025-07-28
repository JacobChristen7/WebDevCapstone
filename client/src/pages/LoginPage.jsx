import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LabeledInput, SubmitButton } from './Components';
import { AuthContext } from '../context/AuthContext.jsx';

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        const payload = JSON.parse(atob(data.token.split('.')[1]));
        login(data.token, payload);

        if (payload.admin) {
          navigate('/admin');
        } else {
          navigate('/profile');
        }
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen text-black">
      <form onSubmit={handleLogin} className='flex flex-col items-center bg-gray-500/30 backdrop-blur-lg w-2/5 m-auto rounded-lg p-10 gap-2'>
        <div className='mb-5 w-full text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] font-bold text-3xl'>Subpar University</div>
        <LabeledInput label={"Username:"} value={username} onChange={e => setUsername(e.target.value)} />
        <LabeledInput label={"Password:"} value={password} type={"password"} onChange={e => setPassword(e.target.value)} />
        <SubmitButton text={loading ? "Logging in..." : "Login"} disabled={loading} />
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}