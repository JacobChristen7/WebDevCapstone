import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { Droppable, DragOverlayWrapper, SearchInput, StylishList, SubmitButton, CoursesList, SearchBar, ColumnsCoursesList, ViewMode } from './Components';
import { DndContext, useSensor, PointerSensor } from '@dnd-kit/core';

export default function AdminPage() {
  console.log("AdminPage mounted");
  const { token } = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [coursesSearchText, setCoursesSearchText] = useState("");
  const [studentsSearchText, setStudentsSearchText] = useState("");

  useEffect(() => {
  // Fetch users
  fetch("/api/users", {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(async data => {
      console.log("Users API response:", data);
      // For each user, fetch their registered courses
      const usersWithCourses = await Promise.all(
        data.map(async user => {
          try {
            const res = await fetch(`/api/users/${user.id}/courses`);
            const classes = await res.json();
            return {
              ...user,
              name: user.name || (user.firstname && user.lastname ? `${user.firstname} ${user.lastname}` : user.username),
              classes: classes || []
            };
          } catch (err) {
            return {
              ...user,
              name: user.name || (user.firstname && user.lastname ? `${user.firstname} ${user.lastname}` : user.username),
              classes: []
            };
          }
        })
      );
      setUsers(usersWithCourses);
    })
    .catch(err => console.error("Failed to fetch users:", err));

  // Fetch courses
  fetch("/api/courses")
    .then(res => res.json())
    .then(async data => {
      console.log("Courses API response:", data);
      // For each course, fetch its students
      const coursesWithStudents = await Promise.all(
        data.map(async course => {
          try {
            const res = await fetch(`/api/courses/${course.id}/students`);
            const students = await res.json();
            return {
              ...course,
              title: course.title || course.name,
              students: students || []
            };
          } catch (err) {
            return {
              ...course,
              title: course.title || course.name,
              students: []
            };
          }
        })
      );
      setAvailableCourses(coursesWithStudents);
    })
    .catch(err => console.error("Failed to fetch courses:", err));
}, [token]);

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
        console.warn(`Unknown action type: ${payload}`);
    }
  }

  return (
    <div className="admin-background">
      <div className='flex flex-col items-center pt-20 pb-20 h-screen overflow-y-auto box-border gap-5'>
        <div className="bg-gray-100 flex flex-col w-3/4 justify-center p-10 text-black rounded-3xl gap-10">
          <SearchBar searchText={coursesSearchText} placeholder='Search for a course...' handleChange={handleCoursesSearchTextChanged}></SearchBar>
          <ColumnsCoursesList title="All Courses" subtitle="Expand to view enrolled students" items={filteredCourses || []} className='h-[500px] columns-2' viewMode={ViewMode.STUDENTS} activeId={0} onAction={handleAction}></ColumnsCoursesList>
        </div>
        <div className="bg-gray-100 flex flex-col w-3/4 justify-center text-black rounded-3xl gap-10 p-10">
        <SearchBar searchText={studentsSearchText} placeholder='Search for a user...' handleChange={handleStudentsSearchTextChanged}></SearchBar>
          <div className='flex gap-10'>
            <ColumnsCoursesList title="All Users" subtitle="Expand to view detail" items={filteredUsers || []} className='w-full h-[500px]' viewMode={ViewMode.CLASSES} activeId={0} onAction={handleAction}></ColumnsCoursesList>
          </div>
        </div>
      </div>
    </div>
  )
}