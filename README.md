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

### Screenshots
![App Screenshot](https://github.com/JacobChristen7/WebDevCapstone/blob/master/Admin-page.png?raw=true "Admin page")
![App Screenshot](https://github.com/JacobChristen7/WebDevCapstone/blob/master/Courses-page.png?raw=true "Courses page")

### Frontend

  - We started with a whiteboard design which we implemented in stages to achieve our final product.

  - A separate components file was created. This file has several React elements that nest inside each other to create a responsive and reusable code base.

  - Credit to @clauderic/dnd-kit I was able to integrate a simple drag and drop registration system which is intuitive and easy to use.



### Backend

- The backend consists of a PostgreSQL database for data handling, JWT and bcrypt for authentication, and uses the Express router for API routing.
- Implementation steps:
  - Set up the Express router and defined all necessary routes.
  - Established a connection to the PostgreSQL database, creating tables and data structures as needed.
  - Added API calls for CRUD operations for users and courses.
  - Implemented JWT and bcrypt authentication to secure routes and functions such as course management and user managment/deletion.

### Backend Features

- Node.js/Express server with RESTful API architecture
- User authentication using JWT and bcrypt for password hashing
- PostgreSQL database integration for persistent data storage
- API endpoints for user registration, login, profile management, and course registration
- Admin endpoints for managing users and courses
- Server-side logging with Winston and Morgan for error and request tracking

### Database Table Layout

#### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  firstname VARCHAR(50) NOT NULL,
  lastname VARCHAR(50) NOT NULL,
  telephone VARCHAR(20),
  address TEXT,
  admin BOOLEAN DEFAULT FALSE,
  aboutMe TEXT,
  password VARCHAR(255) NOT NULL
);
```

#### Courses Table
```sql
CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  credits INT,
  capacity INT
);
```

#### Registrations Table
```sql
CREATE TABLE registrations (
  id SERIAL PRIMARY KEY,
  user_id INT,
  course_id INT
);
```

**Note:**
- To use this project, add a `.env` file with the following lines:
  - `DATABASE_URL=your_postgres_connection_string`
  - `JWT_SECRET=your_jwt_secret`
- Then use the table queries above in your PostgreSQL database for the proper table layouts.



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
