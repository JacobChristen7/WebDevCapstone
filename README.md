![App Screenshot](https://github.com/JacobChristen7/WebDevCapstone/blob/master/Admin-page.png?raw=true "Admin page")
![App Screenshot](https://github.com/JacobChristen7/WebDevCapstone/blob/master/Courses-page.png?raw=true "Courses page")

## Stackademy Student Registration App

Students are able to log in to this website, register for courses, and view their school profile. Administrators are able to change any data in the database, register/unregister students for courses, and view and change the profiles for every user. New users can register an account and change their profile info.

### Website Link

  - [Render-link] Good until December 31, 2025

### Features

- User registration and login (JWT auth, bcrypt hashed passwords)  
- Student profile management  
- Drag-and-drop course registration  
- Admin dashboard for managing courses and users  
- Server-side logging with Winston and Morgan  
- RESTful API endpoints  
- PostgreSQL relational database  


### Frontend

  - We started with a whiteboard design which we implemented in stages to achieve our final product.

  - A separate components file was created. This file has several React elements that nest inside each other to create a responsive and reusable code base.

  - Credit to @dnd-kit I was able to integrate a simple drag and drop registration system which is intuitive and easy to use.



### Backend

  - [description]

### API Routes [Placeholder]

| Method | Endpoint             | Description               |
|--------|----------------------|---------------------------|
| POST   | `/api/auth/register` | Register a new user       |
| POST   | `/api/auth/login`    | Authenticate a user       |


### Tech Stack

  - Vite + React
  - PostgreSQL DB
  - Tailwind + CSS
  - Node.js, JWT, Bcrypt
  - Render for deployment

### Planned Enhancements

  - There are still several buttons not quite functioning properly on the admin screen. They need to be connected to the backend.
  
  - Need to add a way to allow administrators to register students for any class.

### Credits

Thanks to the following contributors:

- [@JacobChristen7](https://www.github.com/JacobChristen7) - Designed and deployed the Postgres DB and backend, JWT, and auth
- [@dpgranger8](https://www.github.com/dpgranger8) - Designed the frontend UI, React components, and css
- [@clauderic/dnd-kit](https://github.com/clauderic/dnd-kit) - Simple to use drag and drop toolkit for React
- [@ctdalton/capstoneStarter](https://www.github.com/ctdalton/capstoneStarter) - Teacher provided starter template
