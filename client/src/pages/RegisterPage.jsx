import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LabeledInput } from './Components';

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
        

        <button type="submit" className='w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 mt-5'>Confirm Registration</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );

}