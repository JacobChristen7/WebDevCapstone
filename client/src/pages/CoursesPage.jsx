import React, { useState } from 'react';
import { Droppable, DragOverlayWrapper, SearchInput, StylishList, SubmitButton, CoursesList, SearchBar } from './Components';
import { DndContext, useSensor, PointerSensor } from '@dnd-kit/core';

export default function CoursesPage() {
  const sampleItems = [
    {
      id: 1,
      title: "Introduction to Psychology",
      description: "An overview of the scientific study of behavior and mental processes, covering topics like cognition, development, personality, and mental health."
    },
    {
      id: 2,
      title: "Calculus I",
      description: "A foundational mathematics course focusing on limits, derivatives, and integrals of functions of one variable."
    },
    {
      id: 3,
      title: "English Literature",
      description: "Study of significant works of English literature, emphasizing analysis, critical thinking, and historical context."
    },
    {
      id: 4,
      title: "Principles of Economics",
      description: "Introduction to microeconomics and macroeconomics, covering topics like supply and demand, markets, inflation, and fiscal policy."
    },
    {
      id: 5,
      title: "General Chemistry",
      description: "Covers basic principles of chemistry including atomic structure, chemical bonding, reactions, and thermodynamics."
    },
    {
      id: 6,
      title: "General Chemistry",
      description: "Covers basic principles of chemistry including atomic structure, chemical bonding, reactions, and thermodynamics."
    },
    {
      id: 7,
      title: "General Chemistry",
      description: "Covers basic principles of chemistry including atomic structure, chemical bonding, reactions, and thermodynamics."
    },
    {
      id: 8,
      title: "General Chemistry",
      description: "Covers basic principles of chemistry including atomic structure, chemical bonding, reactions, and thermodynamics."
    }
  ];

  const [searchText, setSearchText] = useState("")
  const [registeredCourses, setRegisteredCourses] = useState([])
  const [availableCourses, setAvailableCourses] = useState(sampleItems)
  const [selectedCourses, setSelectedCourses] = useState([])

  //this state tracks the currently dragged course
  const [activeCourse, setActiveCourse] = useState(null)

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