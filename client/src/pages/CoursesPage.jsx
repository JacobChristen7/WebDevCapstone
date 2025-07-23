import React, { useState, useEffect } from 'react';
import { Droppable, DragOverlayWrapper, SearchInput, StylishList, SubmitButton, CoursesList, SearchBar } from './Components';
import { DndContext, useSensor, PointerSensor } from '@dnd-kit/core';

export default function CoursesPage() {
  const userId = 2; // Change this value to switch users
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
  fetch(`/api/users/${userId}/registered-courses`)
    .then(res => res.json())
    .then(data => {
      // Mapped to match the display code logic
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

// Filter out available courses that the user is already registered for
const filteredCourses = availableCourses
  .filter(course => !registeredCourses.some(rc => rc.id === course.id))
  .filter(course => course.title.toLowerCase().includes(searchText.toLowerCase()));


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

  async function showRegistrationAlert() {
    if (confirm("Are you sure? This cannot be undone.") === true) {
      await Promise.all(selectedCourses.map(course =>
        fetch('/api/registrations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: userId,
            course_id: course.id
          })
        })
      ));
      const res = await fetch(`/api/users/${userId}/registered-courses`);
      const data = await res.json();
      const mapped = data.map(course => ({
        ...course,
        title: course.name
      }));
      setRegisteredCourses(mapped)
      setSelectedCourses([])
    }
  }

  return (
    <div className='flex flex-col items-center pt-10 pb-20 h-screen overflow-y-auto box-border gap-5'>
      <div className="bg-gray-100 flex flex-col w-3/4 justify-center p-10 text-black rounded-3xl gap-10">
        <CoursesList title="Registered Courses" courses={registeredCourses} className='w-full max-h-[500px]'></CoursesList>
      </div>
      <div className="bg-gray-100 flex flex-col w-3/4 justify-center text-black rounded-3xl gap-10 p-10">
        <SearchBar searchText={searchText} placeholder='Search for a course...' handleChange={handleChange}></SearchBar>
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