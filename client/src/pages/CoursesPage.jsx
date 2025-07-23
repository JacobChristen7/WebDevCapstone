import React, { useState, useEffect } from 'react';
import { Droppable, DragOverlayWrapper, SearchInput, StylishList, SubmitButton } from './Components';
import { DndContext, useSensor, PointerSensor } from '@dnd-kit/core';

export default function CoursesPage() {
  const [searchText, setSearchText] = useState("");
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  
  //this state tracks the currently dragged course
  const [activeCourse, setActiveCourse] = useState(null);

  useEffect(() => {
  fetch('/api/courses')
    .then(res => res.json())
    .then(data => {
      // Mapped to display with the code we already made
      const mapped = data.map(course => ({
        ...course,
        title: course.name
      }));
      setAvailableCourses(mapped);
    })
    .catch(err => console.error('Failed to fetch courses:', err));
}, []);

  useEffect(() => {
  fetch('/api/users/2/registered-courses')
    .then(res => res.json())
    .then(data => {
      // Mapped to match the display logic
      const mapped = data.map(course => ({
        ...course,
        title: course.name
      }));
      setRegisteredCourses(mapped);
    })
    .catch(err => console.error('Failed to fetch registered courses:', err));
}, []);

  const handleChange = (e) => {
    setSearchText(e.target.value)
  }

  const filteredCourses = availableCourses.filter(course => {
    return course.title.toLowerCase().includes(searchText.toLowerCase())
  })

  function handleDragStart(event) {
    const draggedId = event.active.id;

    const course =
      availableCourses.find(c => c.id === draggedId) ||
      selectedCourses.find(c => c.id === draggedId);
    console.log(course)
    setActiveCourse(course);
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeId = active.id;
    const overId = over.id;

    // Find the dragged item in either list
    const draggedItem =
      availableCourses.find(c => c.id === activeId) ||
      selectedCourses.find(c => c.id === activeId);

    if (!draggedItem) return;

    const isInAvailable = availableCourses.some(c => c.id === activeId);
    const isInSelected = selectedCourses.some(c => c.id === activeId);

    // Move logic
    if (overId === 'selected' && isInAvailable) {
      setAvailableCourses(prev => prev.filter(c => c.id !== activeId));
      setSelectedCourses(prev => [...prev, draggedItem].sort((a, b) => a.id > b.id));
    } else if (overId === 'available' && isInSelected) {
      setSelectedCourses(prev => prev.filter(c => c.id !== activeId));
      setAvailableCourses(prev => [...prev, draggedItem].sort((a, b) => a.id > b.id));
    }

    setActiveCourse(null);
  }

  function showRegistrationAlert() {
    if (confirm("Are you sure? This cannot be undone.") === true) {
      //make database update that they want to register these classes
      setRegisteredCourses(selectedCourses)
      setSelectedCourses(null)
    }
  }

  return (
    <div className='flex flex-col items-center pt-10 pb-20 h-screen overflow-y-auto box-border gap-5'>
      <div className="bg-gray-100 flex flex-col w-3/4 justify-center p-10 text-black rounded-3xl gap-10">
        <CoursesList title="Registered Courses" courses={registeredCourses}></CoursesList>
      </div>
      <div className="bg-gray-100 flex flex-col w-3/4 justify-center text-black rounded-3xl gap-10 p-10">
        <SearchBar searchText={searchText} handleChange={handleChange}></SearchBar>
        <div className='flex gap-10'>
          <DndContext sensors={[useSensor(PointerSensor, { activationConstraint: { distance: 5, }, })]} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <Droppable id="available" className='w-1/2'>
              <CoursesList title="Available Courses" subtitle="Drag and drop to add a course" courses={filteredCourses} className='w-full h-[500px]' activeId={activeCourse?.id ?? 0}></CoursesList>
            </Droppable>
            <Droppable id="selected" className='w-1/2'>
              <div className='flex flex-col w-full'>
                <CoursesList title="Selected Courses" courses={selectedCourses} className='w-full flex-col' activeId={activeCourse?.id ?? 0}>
                  <SubmitButton text={"Confirm Registration"} onClick={showRegistrationAlert} />
                </CoursesList>
                
              </div>
            </Droppable>
            <DragOverlayWrapper course={activeCourse} />
          </DndContext>
        </div>
      </div>
    </div>
  );
};

const SearchBar = ({ searchText, handleChange }) => {
  return (
    <div className='flex w-full items-center bg-white p-4 rounded-3xl shadow-lg gap-5'>
      <svg style={{ color: 'gray' }} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
      </svg>
      <SearchInput placeholder='Search for a course...' name="search" value={searchText} onChange={handleChange} />
    </div>
  );
}

const CoursesList = ({ title, subtitle, courses, className = '', activeId, children = null }) => {
  return (
    <div className={`flex bg-white shadow-lg rounded-2xl p-8 ${className}`}>
      <StylishList title={title} subtitle={subtitle} items={courses} activeID={activeId}></StylishList>
      {children}
    </div>
  );
};