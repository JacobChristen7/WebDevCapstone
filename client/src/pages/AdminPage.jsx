import React, { useState } from 'react';
import { Droppable, DragOverlayWrapper, SearchInput, StylishList, SubmitButton, CoursesList, SearchBar, ColumnsCoursesList } from './Components';
import { DndContext, useSensor, PointerSensor } from '@dnd-kit/core';

export default function AdminPage() {
  const sampleItems = [
    {
      id: 1,
      title: "Introduction to Psychology",
      description: "An overview of the scientific study of behavior and mental processes, covering topics like cognition, development, personality, and mental health.",
      students: [
        { id: 101, name: "Alice Johnson" },
        { id: 102, name: "Brian Smith" },
        { id: 103, name: "Cindy Lee" }
      ]
    },
    {
      id: 2,
      title: "Calculus I",
      description: "A foundational mathematics course focusing on limits, derivatives, and integrals of functions of one variable.",
      students: [
        { id: 104, name: "David Kim" },
        { id: 105, name: "Emily Chen" },
        { id: 106, name: "Frank Ramirez" }
      ]
    },
    {
      id: 3,
      title: "English Literature",
      description: "Study of significant works of English literature, emphasizing analysis, critical thinking, and historical context.",
      students: [
        { id: 107, name: "Grace Thompson" },
        { id: 108, name: "Henry Patel" },
        { id: 109, name: "Isla Davis" }
      ]
    },
    {
      id: 4,
      title: "Principles of Economics",
      description: "Introduction to microeconomics and macroeconomics, covering topics like supply and demand, markets, inflation, and fiscal policy.",
      students: [
        { id: 110, name: "Jack Nguyen" },
        { id: 111, name: "Karen Lopez" },
        { id: 112, name: "Liam Murphy" }
      ]
    },
    {
      id: 5,
      title: "General Chemistry",
      description: "Covers basic principles of chemistry including atomic structure, chemical bonding, reactions, and thermodynamics.",
      students: [
        { id: 113, name: "Mia Brooks" },
        { id: 114, name: "Noah Robinson" },
        { id: 115, name: "Olivia Hall" }
      ]
    }
  ];  

  const [coursesSearchText, setCoursesSearchText] = useState("")
  const [studentsSearchText, setStudentsSearchText] = useState("")

  const [registeredCourses, setRegisteredCourses] = useState([])
  const [availableCourses, setAvailableCourses] = useState(sampleItems)
  const [students, setStudents] = useState(sampleItems.flatMap(item => item.students))
  const [selectedCourses, setSelectedCourses] = useState([])

  //this state tracks the currently dragged course
  const [activeCourse, setActiveCourse] = useState(null)

  const handleCoursesSearchTextChanged = (e) => {
    setCoursesSearchText(e.target.value)
  }

  const handleStudentsSearchTextChanged = (e) => {
    setStudentsSearchText(e.target.value)
  }

  const filteredCourses = availableCourses.filter(course => {
    return course.title.toLowerCase().includes(coursesSearchText.toLowerCase())
  })

  const filteredStudents = students.filter(student => {
    return student.name.toLowerCase().includes(studentsSearchText.toLowerCase())
  })

  function showRegistrationAlert() {
    if (confirm("Are you sure? This cannot be undone.") === true) {
      //make database update that they want to register these classes
      setRegisteredCourses(selectedCourses)
      setSelectedCourses(null)
    }
  }

  return (
    <div class="admin-background" >
      <div className='flex flex-col items-center pt-10 pb-20 h-screen overflow-y-auto box-border gap-5'>
        <div className="bg-gray-100 flex flex-col w-3/4 justify-center p-10 text-black rounded-3xl gap-10">
          <SearchBar searchText={coursesSearchText} placeholder='Search for a course...' handleChange={handleCoursesSearchTextChanged}></SearchBar>
          <ColumnsCoursesList title="All Courses" subtitle="Expand to view enrolled students" courses={filteredCourses} className='h-[400px] columns-2'></ColumnsCoursesList>
        </div>
        <div className="bg-gray-100 flex flex-col w-3/4 justify-center text-black rounded-3xl gap-10 p-10">
        <SearchBar searchText={studentsSearchText} placeholder='Search for a student...' handleChange={handleStudentsSearchTextChanged}></SearchBar>
          <div className='flex gap-10'>
            <CoursesList title="Students" subtitle="" courses={filteredStudents} className='w-full h-[500px]' activeId={0}></CoursesList>
            <div className='flex flex-col w-full'>
              <CoursesList title="Selected Courses" courses={selectedCourses} className='w-full flex-col' activeId={0}>
                <SubmitButton text={"Confirm Registration"} onClick={showRegistrationAlert} />
              </CoursesList>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}