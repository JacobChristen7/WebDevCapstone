import { useEffect, useState } from "react";  
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import AdminPage from "./pages/AdminPage";
import CoursesPage from "./pages/CoursesPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function CurrentPage() {
  const location = useLocation();
  let pageName = "";
  switch (location.pathname) {
    case "/admin":
      pageName = "Administrator Page";
      break;
    case "/courses":
      pageName = "Courses Page";
      break;
    case "/profile":
      pageName = "Profile Page";
      break;
    case "/login":
      pageName = "Login Page";
      break;
    case "/register":
      pageName = "User Registration Page";
      break;
    default:
      pageName = "Home";
  }
  return <div className="my-4">You are currently on: <span className="font-bold">{pageName}</span></div>;
}

function App() {
  const [serverTestMessage, setServerTestMessage] = useState("");

  useEffect(() => {
    fetch("/log", { method: "POST" });
    fetch("/api")
      .then(res => res.json())
      .then(data => setServerTestMessage(data.message))
      .catch(() => setServerTestMessage("Error connecting to server"));
  }, []);

  return (
    <Router>
      <nav className="flex gap-4 p-4 bg-blue-100">
        <Link className="text-blue-700 font-bold" to="/admin">Admin</Link>
        <Link className="text-blue-700 font-bold" to="/courses">Courses</Link>
        <Link className="text-blue-700 font-bold" to="/profile">Profile</Link>
        <Link className="text-blue-700 font-bold" to="/login">Login</Link>
        <Link className="text-blue-700 font-bold" to="/register">Register</Link>
      </nav>
      <div className="bg-red-500 text-white p-4">If this is red Tailwind is working</div>
      {serverTestMessage && (
        <div className="p-2 bg-gray-100 border border-gray-300 text-gray-800">
          Server says: {serverTestMessage}
        </div>
      )}
      <CurrentPage />
      <Routes>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;
