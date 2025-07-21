import React, { useState } from 'react';
import Input from './Components';

export default function ProfilePage() {
  const [form, setForm] = useState({
    username: 'johnsmith',
    email: 'johnsmith@gmail.com',
    firstName: 'John',
    lastName: 'Smith',
    phone: '123-456-7890',
    address: 'nowhere street',
    aboutMe: 'Teacher. Prides themselves in being sub-par at everything they do',
  });
  const [savedProfile, setSavedProfile] = useState(form);
  
  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSave = () => {
    setSavedProfile({ ...form })
  };

  return (
    <div className='flex flex-col items-center pt-5 pb-20 h-screen overflow-y-auto box-border'>
      <div className="bg-gray-100 flex w-3/4 justify-center p-10 text-black rounded-lg">
      <ProfileDisplay form={savedProfile}></ProfileDisplay>
        <div className="flex w-full items-center justify-center bg-gray-100 pl-10">
          <div className="bg-white shadow-md rounded-lg p-6 w-full flex justify-center">
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
              <Input label="About Me" name="aboutMe" value={form.aboutMe} onChange={handleChange} />
            </div>

            <button
              onClick={handleSave}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

const ProfileDisplay = ({form}) => {
  const { username, firstName, lastName, email, phone, address, aboutMe } = form;
  return (
    <div className="bg-white shadow-lg rounded-lg p-8 max-w-sm text-center">
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