import React, { useState } from 'react';
import { StylishList, SearchInput } from './Components';

export default function CoursesPage() {
  const sampleItems = [
    {
      title: "Introduction to Psychology",
      description: "An overview of the scientific study of behavior and mental processes, covering topics like cognition, development, personality, and mental health."
    },
    {
      title: "Calculus I",
      description: "A foundational mathematics course focusing on limits, derivatives, and integrals of functions of one variable."
    },
    {
      title: "English Literature",
      description: "Study of significant works of English literature, emphasizing analysis, critical thinking, and historical context."
    },
    {
      title: "Principles of Economics",
      description: "Introduction to microeconomics and macroeconomics, covering topics like supply and demand, markets, inflation, and fiscal policy."
    },
    {
      title: "General Chemistry",
      description: "Covers basic principles of chemistry including atomic structure, chemical bonding, reactions, and thermodynamics."
    },
    {
      title: "World History",
      description: "Exploration of major global civilizations and events from ancient times to the modern era."
    },
    {
      title: "Computer Science Fundamentals",
      description: "Introduction to key concepts in computer science, including algorithms, data structures, and basic programming."
    },
    {
      title: "Business Management",
      description: "Covers organizational behavior, leadership, strategic planning, and operations in modern businesses."
    },
    {
      title: "Art History",
      description: "A survey of major art movements, artists, and techniques from antiquity to the present day."
    },
    {
      title: "Physics I",
      description: "Introduction to classical mechanics, including motion, forces, energy, and momentum."
    },
    {
      title: "Sociology Basics",
      description: "Study of human society, social institutions, and patterns of behavior using scientific methods."
    },
    {
      title: "Environmental Science",
      description: "Interdisciplinary look at ecological systems, human impact on the environment, and sustainability."
    },
    {
      title: "Political Science",
      description: "Introduction to political systems, ideologies, governance, and international relations."
    },
    {
      title: "Creative Writing",
      description: "Focuses on developing original compositions in fiction, poetry, and other literary forms."
    },
    {
      title: "Introduction to Philosophy",
      description: "Survey of major philosophical questions and thinkers, covering topics like ethics, metaphysics, and epistemology."
    },
    {
      title: "Public Speaking",
      description: "Covers techniques for effective verbal communication, audience engagement, and speech organization."
    },
    {
      title: "Anatomy and Physiology",
      description: "Detailed study of the structure and function of the human body systems."
    },
    {
      title: "Marketing Principles",
      description: "Explores basic marketing concepts including market research, consumer behavior, and branding."
    },
    {
      title: "Statistics for Social Sciences",
      description: "Introduction to statistical techniques used in psychology, sociology, and other social sciences."
    },
    {
      title: "Film Studies",
      description: "Analyzes the history, theory, and criticism of film as an art form and cultural product."
    }
  ];  

  const [searchText, setSearchText] = useState("")
  const [registeredCourses, setRegisteredCourses] = useState([])
  const [availableCourses, setAvailableCourses] = useState(sampleItems)

  const handleChange = (e) => {
    setSearchText(e.target.value)
  }

  const filteredCourses = availableCourses.filter(course => {
    return course.title.toLowerCase().includes(searchText.toLowerCase())
  })

  return (
    <div className='flex flex-col items-center pt-5 pb-20 h-screen overflow-y-auto box-border gap-5'>
      <div className="bg-gray-100 flex flex-col w-3/4 justify-center p-10 text-black rounded-3xl gap-10">
        <CoursesList title="Registered Courses" courses={registeredCourses}></CoursesList>
      </div>
      <div className="bg-gray-100 flex flex-col w-3/4 justify-center p-10 text-black rounded-3xl gap-10">
        <SearchBar searchText={searchText} handleChange={handleChange}></SearchBar>
        <div className='flex gap-10'>
          <CoursesList title="Available Courses" courses={filteredCourses} className='w-1/2 h-[500px]'></CoursesList>
          <CoursesList title="Selected Courses" courses={registeredCourses} className='w-1/2'></CoursesList>
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

const CoursesList = ({ title, courses, className = '' }) => {

  return (
    <div className={`flex bg-white shadow-lg rounded-2xl p-8 ${className}`}>
      <StylishList title={title} items={courses}></StylishList>
    </div>
  );
};