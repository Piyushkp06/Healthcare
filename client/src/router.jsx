import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "../src/pages/Home";
import Login from "./pages/Auth/Login";
import AdminDashboard from "./pages/AdminDash/Dashboard";
import DoctorDashboard from "./pages/Doctor/Dashboard";
import FrontdeskPage from "../src/pages/Frontdesk/Index";
import AllDoctorsPage from "./pages/Doctors/Index";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "admin/dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "doctor/dashboard",
        element: <DoctorDashboard />,
      },
      {
        path: "frontdesk",
        element: <FrontdeskPage />,
      },
      {
        path: "doctors",
        element: <AllDoctorsPage />,
      },
    ],
  },
]);
