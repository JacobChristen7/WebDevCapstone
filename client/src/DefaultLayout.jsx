import { Link, Outlet, useLocation } from "react-router-dom";

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
  // return <div className="my-4">You are currently on: <span className="font-bold">{pageName}</span></div>;
}

const DefaultLayout = ({ serverTestMessage }) => (
  <>
    <nav className="sticky flex top-0 w-full gap-4 p-4 bg-blue-100">
      <Link className="text-blue-700 font-bold" to="/admin">Admin</Link>
      <Link className="text-blue-700 font-bold" to="/courses">Courses</Link>
      <Link className="text-blue-700 font-bold" to="/profile">Profile</Link>
      <Link className="text-blue-700 font-bold" to="/login">Login</Link>
    <Link className="text-blue-700 font-bold" to="/register">Register</Link>
    </nav>
    {/* <div className="bg-red-500 text-white p-4">If this is red Tailwind is working</div>
    {serverTestMessage && (
      <div className="p-2 bg-gray-100 border border-gray-300 text-gray-800">
        Server says: {serverTestMessage}
      </div>
    )} */}
    <CurrentPage />
    <Outlet />
  </>
);

export default DefaultLayout;
