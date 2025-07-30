import React, { useState } from 'react';
import { Droppable, DragOverlayWrapper, SearchInput, StylishList, SubmitButton, CoursesList, SearchBar, ColumnsCoursesList, ViewMode } from './Components';
import { DndContext, useSensor, PointerSensor } from '@dnd-kit/core';

export default function AdminPage() {
  
  const sampleUsers = [
    {
      id: 1,
      name: "Alice Johnson",
      classes: [
        { id: 101, title: "Calculus I" },
        { id: 102, title: "English Literature" },
        { id: 103, title: "World History" }
      ]
    },
    {
      id: 2,
      name: "Brian Lee",
      classes: [
        { id: 104, title: "Physics I" },
        { id: 105, title: "Creative Writing" },
        { id: 106, title: "Intro to Programming" }
      ]
    },
    {
      id: 3,
      name: "Brian Huang",
      classes: [
        { id: 107, title: "General Chemistry" },
        { id: 108, title: "Macroeconomics" },
        { id: 109, title: "Public Speaking" }
      ]
    },
    {
      id: 4,
      name: "Cindy Lee",
      classes: [
        { id: 110, title: "Biology I" },
        { id: 111, title: "Art History" },
        { id: 112, title: "Linear Algebra" }
      ]
    },
    {
      id: 5,
      name: "David Kim",
      classes: [
        { id: 113, title: "Political Science" },
        { id: 114, title: "Ethics in Technology" },
        { id: 115, title: "Statistics" }
      ]
    }
  ];

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
  const [users, setUsers] = useState(sampleUsers)
  const [selectedCourses, setSelectedCourses] = useState([])

  const handleCoursesSearchTextChanged = (e) => {
    setCoursesSearchText(e.target.value)
  }

  const handleStudentsSearchTextChanged = (e) => {
    setStudentsSearchText(e.target.value)
  }

  const filteredCourses = availableCourses.filter(course => {
    return course.title.toLowerCase().includes(coursesSearchText.toLowerCase())
  })

  const filteredUsers = users.filter(user => {
    return user.name.toLowerCase().includes(studentsSearchText.toLowerCase())
  })
  
  //action handler code
  function handleAction(type, payload) {
    switch (type) {
      case 'UNREGISTER_CLASS': {
        const { classID, userID } = payload;
        // Do something meaningful in the backend here
        console.log(`Unregister class ${classID} from user ${userID}`);
        break;
      }
      case 'UNENROLL_STUDENT': {
        const { userID, classID } = payload;
        // Do something meaningful in the backend here
        console.log(`Unenroll student ${userID} from class ${classID}`);
        break
      }


      case 'SAVE_USER_CHANGES': {
        const { userID } = payload; //this will include all the user details
        console.log(`Save changes for user ${userID}`);
        break;
      }
      case 'DELETE_USER': {
        const { userID } = payload;
        console.log(`Delete user ${userID}`);
        break;
      }


      case 'SAVE_CLASS_CHANGES': {
        const { classID } = payload; //this will have the description too
        console.log(`Save changes for class ${classID}`);
        break;
      }
      case 'DELETE_CLASS': {
        const { classID } = payload;
        console.log(`Delete class ${classID}`);
        break;
      }
      default:
        console.warn(`Unknown action type: ${type}`);
    }
  }

  return (
    <div class="admin-background">
      <div className='flex flex-col items-center pt-20 pb-20 h-screen overflow-y-auto box-border gap-5'>
        <div className="bg-gray-100 flex flex-col w-3/4 justify-center p-10 text-black rounded-3xl gap-10">
          <SearchBar searchText={coursesSearchText} placeholder='Search for a course...' handleChange={handleCoursesSearchTextChanged}></SearchBar>
          <ColumnsCoursesList title="All Courses" subtitle="Expand to view enrolled students" items={filteredCourses} className='h-[500px] columns-2' viewMode={ViewMode.STUDENTS} activeId={0} onAction={handleAction}></ColumnsCoursesList>
        </div>
        <div className="bg-gray-100 flex flex-col w-3/4 justify-center text-black rounded-3xl gap-10 p-10">
        <SearchBar searchText={studentsSearchText} placeholder='Search for a user...' handleChange={handleStudentsSearchTextChanged}></SearchBar>
          <div className='flex gap-10'>
            <ColumnsCoursesList title="All Users" subtitle="Expand to view detail" items={filteredUsers} className='w-full h-[500px]' viewMode={ViewMode.CLASSES} activeId={0} onAction={handleAction}></ColumnsCoursesList>
          </div>
        </div>
      </div>
    </div>
  )
}