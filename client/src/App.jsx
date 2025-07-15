import { useEffect, useState } from "react";  
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import AdminPage from "./pages/AdminPage";
import CoursesPage from "./pages/CoursesPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DefaultLayout from "./DefaultLayout";

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
  //return <div className="my-4">You are currently on: <span className="font-bold">{pageName}</span></div>;
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
    <CurrentPage />
    <Routes>
      <Route element={<DefaultLayout serverTestMessage={serverTestMessage} />}>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
      <Route path="/" element={<LoginPage />} /> {/* Home page is login but can be changed */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  </Router>
  );
}

export default App;
