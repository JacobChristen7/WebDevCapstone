import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LabeledInput, SubmitButton } from './Components';

export default function LoginPage() {
  const [form, setForm] = useState({
    username: "testing",
    email: "testing",
    firstName: "testing",
    lastName: "testing",
    phone: "testing",
    address: "testing",
    aboutMe: "testing",
    password: "testing",
    confirm_password: "testing"
  });
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
      <form onSubmit={handleLogin} className='flex flex-col items-center bg-gray-500/30 backdrop-blur-lg w-2/5 m-auto rounded-lg p-10 gap-3'>
        <div className='mb-5 w-full text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] font-bold text-3xl'>Subpar University</div>

        <LabeledInput label={"Username:"} value={form.username}></LabeledInput>
        <LabeledInput label={"Email:"} value={form.email}></LabeledInput>
        <LabeledInput label={"First Name:"} value={form.firstName}></LabeledInput>
        <LabeledInput label={"Last Name:"} value={form.lastName}></LabeledInput>
        <LabeledInput label={"Phone #:"} value={form.phone}></LabeledInput>
        <LabeledInput label={"Address:"} value={form.address}></LabeledInput>
        <LabeledInput label={"Password:"} value={form.password} type={"password"}></LabeledInput>
        <LabeledInput label={"Confirm Password:"} value={form.confirm_password} type={"password"}></LabeledInput>
        <LabeledInput label={"About me (optional):"} value={form.aboutMe}></LabeledInput>

        <SubmitButton text={"Confirm Registration"} onClick={{}} />
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );

}