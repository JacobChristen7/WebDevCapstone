import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LabeledInput, SubmitButton } from './Components';

export default function RegisterPage() {
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

  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          firstname: form.firstName,
          lastname: form.lastName,
          telephone: form.phone,
          address: form.address,
          admin: false,
          aboutMe: form.aboutMe
        })
      });
      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Registration failed');
        return;
      }
      const user = await response.json();
      navigate('/profile', { state: { user } });
    } catch (err) {
      setError('Network or server error');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen text-black">

      <form onSubmit={handleRegister} className='flex flex-col items-center bg-gray-500/30 backdrop-blur-lg w-2/5 m-auto rounded-lg p-10 gap-3'>
      <div className='mb-5 w-full text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] font-bold text-3xl'>Subpar University</div>
      
        <LabeledInput
          label="Username:"
          name="username"
          value={form.username}
          onChange={e => setForm({ ...form, username: e.target.value })}
        />
        <LabeledInput
          label="Email:"
          name="email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
        <LabeledInput
          label="First Name:"
          name="firstName"
          value={form.firstName}
          onChange={e => setForm({ ...form, firstName: e.target.value })}
        />
        <LabeledInput
          label="Last Name:"
          name="lastName"
          value={form.lastName}
          onChange={e => setForm({ ...form, lastName: e.target.value })}
        />
        <LabeledInput
          label="Phone #:"
          name="phone"
          value={form.phone}
          onChange={e => setForm({ ...form, phone: e.target.value })}
        />
        <LabeledInput
          label="Address:"
          name="address"
          value={form.address}
          onChange={e => setForm({ ...form, address: e.target.value })}
        />
        <LabeledInput
          label="Password:"
          name="password"
          type="password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
        />
        <LabeledInput
          label="Confirm Password:"
          name="confirm_password"
          type="password"
          value={form.confirm_password}
          onChange={e => setForm({ ...form, confirm_password: e.target.value })}
        />
        <LabeledInput
          label="About me (optional):"
          name="aboutMe"
          value={form.aboutMe}
          onChange={e => setForm({ ...form, aboutMe: e.target.value })}
        />

        <SubmitButton text={"Confirm Registration"} onClick={{}} />
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );

}