import React, { useState } from 'react';
import Input from './Components';

export default function CoursesPage() {

  const [searchText, setSearchText] = useState("")

  return (
    <div className='flex flex-col items-center pt-5 pb-20 h-screen overflow-y-auto box-border'>
      <div className="bg-gray-100 flex flex-col w-3/4 justify-center p-10 text-black rounded-lg gap-10">
        <SearchBar></SearchBar>
      <div className='flex gap-10'>
        <AvailableCourses></AvailableCourses>
        <RegisteredCourses></RegisteredCourses>
        </div>
      </div>
    </div>
  );
};

const SearchBar = () => {
  return (
    <div className='flex bg-white p-4 rounded-3xl shadow-lg'>
      <svg className='w-6 h-6' class="svg-icon search-icon" aria-labelledby="title desc" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19.9 19.7"><title id="title">Search Icon</title><desc id="desc">A magnifying glass icon.</desc><g class="search-path" fill="none" stroke="#848F91"><path stroke-linecap="square" d="M18.5 18.3l-5.4-5.4"/><circle cx="8" cy="8" r="7"/></g></svg>
      <Input label="Username" name="username" value={form.username} onChange={handleChange} />
    </div>
  );
}

const AvailableCourses = () => {
  return (
    <div className="flex w-1/2 bg-white shadow-lg rounded-lg p-8">
      
    </div>
  );
};

const RegisteredCourses = () => {
  return (
    <div className="flex w-1/2 bg-white shadow-lg rounded-lg">
      
    </div>
  );
};