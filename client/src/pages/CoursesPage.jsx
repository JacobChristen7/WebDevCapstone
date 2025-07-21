import React, { useState } from 'react';
import { StylishList, SearchInput } from './Components';

export default function CoursesPage() {
  const sampleItems = [
    "Introduction to Psychology",
    "Calculus I",
    "English Literature",
    "Principles of Economics",
    "General Chemistry",
    "World History",
    "Computer Science Fundamentals",
    "Business Management",
    "Art History",
    "Physics I",
    "Sociology Basics",
    "Environmental Science",
    "Political Science",
    "Creative Writing",
    "Introduction to Philosophy",
    "Public Speaking",
    "Anatomy and Physiology",
    "Marketing Principles",
    "Statistics for Social Sciences",
    "Film Studies"
  ];

  const [searchText, setSearchText] = useState("")
  const [registeredCourses, setRegisteredCourses] = useState([])
  const [availableCourses, setAvailableCourses] = useState(sampleItems)

  const handleChange = (e) => {
    setSearchText(e.target.value)
  }

  return (
    <div className='flex flex-col items-center pt-5 pb-20 h-screen overflow-y-auto box-border'>
      <div className="bg-gray-100 flex flex-col w-3/4 justify-center p-10 text-black rounded-3xl gap-10">
        <SearchBar searchText={searchText} handleChange={handleChange}></SearchBar>
        <div className='flex gap-10'>
          <CoursesList title="Available Courses" courses={availableCourses}></CoursesList>
          <CoursesList title="Registered Courses" courses={registeredCourses}></CoursesList>
        </div>
      </div>
    </div>
  );
};

const SearchBar = ({ searchText, handleChange }) => {
  return (
    <div className='flex w-full items-center bg-white p-4 rounded-3xl shadow-lg gap-5'>
      <svg style={{color:'gray'}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
      </svg>
      <SearchInput placeholder='Search for a course...' name="search" value={searchText} onChange={handleChange} />
    </div>
  );
}

const CoursesList = ({ title, courses }) => {

  return (
    <div className="flex w-1/2 bg-white shadow-lg rounded-2xl p-8">
      <StylishList title={title} items={courses}></StylishList>
    </div>
  );
};