import React, { useState, useEffect, useContext } from 'react';
import { Input, SubmitButton } from './Components';
import { AuthContext } from '../context/AuthContext.jsx';

export default function ProfilePage() {
  const { user, token } = useContext(AuthContext);
  const userID = user?.id;
  const [form, setForm] = useState(null);
  const [savedProfile, setSavedProfile] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // updates user info in the database
  const handleSave = async () => {
    try {
      const response = await fetch(`/api/users/${userID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
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
      if (!response.ok) throw new Error('Failed to update profile');
      const updated = await response.json();
      setSavedProfile({
        username: updated.username,
        email: updated.email,
        firstName: updated.firstname,
        lastName: updated.lastname,
        phone: updated.telephone,
        address: updated.address,
        aboutMe: updated.aboutMe || ''
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Gets user info from the database
  useEffect(() => {
    if (!userID) return;
    fetch(`/api/users/${userID}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
      .then(res => res.json())
      .then(data => {
        setForm({
          username: data.username,
          email: data.email,
          firstName: data.firstname,
          lastName: data.lastname,
          phone: data.telephone,
          address: data.address,
          aboutMe: data.aboutMe || '',
        });
        setSavedProfile({
          username: data.username,
          email: data.email,
          firstName: data.firstname,
          lastName: data.lastname,
          phone: data.telephone,
          address: data.address,
          aboutMe: data.aboutMe || '',
        });
      });
  }, [userID, token]);

  if (!userID) {
    return <div className="text-center mt-10 text-xl">You must be logged in to view your profile.</div>;
  }

  if (!form || !savedProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-4xl font-bold text-blue-600 animate-pulse drop-shadow-lg">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col items-center pt-5 pb-20 h-screen overflow-y-auto box-border'>
      <div className="bg-gray-100 flex w-3/4 justify-center p-10 text-black rounded-3xl">
        <ProfileDisplay form={savedProfile}></ProfileDisplay>
        <div className="flex w-full items-center justify-center bg-gray-100 pl-10">
          <div className="bg-white shadow-md rounded-2xl p-6 w-full flex justify-center">
            <div className='w-3/4'>
              <div className='mb-5 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] text-white font-bold text-3xl'>Subpar University</div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">My Profile</h2>

              <div className="space-y-4">
                <Input label="Username" name="username" value={form.username} onChange={handleChange} />
                <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
                <Input label="First Name" name="firstName" value={form.firstName} onChange={handleChange} />
                <Input label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} />
                <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />
                <Input label="Address" name="address" value={form.address} onChange={handleChange} />
                <Input label={<span>About Me <span className="italic text-gray-500">(optional)</span></span>} name="aboutMe" value={form.aboutMe} onChange={handleChange} />
              </div>

              <SubmitButton text={"Save Edits"} onClick={handleSave} className="mt-5"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileDisplay = ({ form }) => {
  const { username, firstName, lastName, email, phone, address, aboutMe } = form;
  return (
    <div className="bg-white shadow-lg rounded-2xl p-8 max-w-sm text-center">
      <img
        className="w-48 h-48 rounded-full mx-auto mb-4 border-4 border-blue-500"
        src="https://i.pravatar.cc/150"
        alt="User avatar"
      />
      <h1 className="text-2xl font-bold text-gray-800 mb-2">{firstName} {lastName}</h1>
      <h3 className='mb-8'>{email}</h3>
      <div className='flex flex-row justify-start'>
        <h2 className='mr-2 font-semibold'>Username -</h2>
        <label>{username}</label>
      </div>
      <div className='flex flex-row justify-start'>
        <h2 className='mr-2 font-semibold'>Address -</h2>
        <label>{address}</label>
      </div>
      <div className='flex flex-row justify-start'>
        <h2 className='mr-2 font-semibold'>Phone -</h2>
        <label>{phone}</label>
      </div>
      <p className="text-gray-600 my-6 text-start">
        {aboutMe}
      </p>
    </div>
  );
};