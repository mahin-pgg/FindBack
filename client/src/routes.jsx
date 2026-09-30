import Login from "./pages/login/login.jsx";
import Signup from "./pages/signup/signup.jsx";
import PageNotFound from "./pages/404/404.jsx";
import Dashboard from "./pages/dashboard/dashboard.jsx";
import Home from "./pages/home/home.jsx";
import PrivateRoutes from "./components/privateRoutes/privateRoutes.jsx";
import MyMatches from "./pages/mymatches/mymatches.jsx";
import MyClaims from "./pages/myclaims/myclaims.jsx";
import BrowseItems from "./pages/browseitems/browseitems.jsx";
import LostItems from "./pages/lostitems/lostitems.jsx";
import FoundItems from "./pages/founditems/founditems.jsx";
import Profile from "./pages/myProfile/myprofile.jsx";
import About from "./pages/about/about.jsx";
import Contact from "./pages/contact/contact.jsx";
import ItemDetail from "./pages/itemDetails/itemDetails.jsx";

import AdminDashboard from "./pages/admin/admin.jsx";
import AnalyticsOverview from "./pages/admin/analytics.jsx";
import ClaimsPage from "./pages/admin/claims.jsx";
import ItemsVerification from "./pages/admin/itemsVerification.jsx";
import LogsPage from "./pages/admin/logs.jsx";
import UsersPage from "./pages/admin/users.jsx";
import AdminRoutes from "./components/adminRoutes/adminRoutes.jsx";
import AdminProfile from "./pages/admin/adminProfile.jsx";
import AdminSignup from "./pages/admin/adminSignup.jsx";

import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
   {
    element: <PrivateRoutes />,
    children: [

      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "mymatches",
        element: <MyMatches />,
      },
      {
        path: "myclaims",
        element: <MyClaims />,
      },
      {
        path: "browseitems",
        element: <BrowseItems />,
      },
      {
        path: "lostitems",
        element: <LostItems />,
      },
      {
        path: "founditems",
        element: <FoundItems />,
      },
      {
        path: "profile",
        element: <Profile />,
      },

      {
        path: "items/:id",
        element: <ItemDetail />,
      },
      
      {
        element: <AdminRoutes />,
        children: [
          { path: "admin",                    element: <AdminDashboard /> },
          { path: "admin/analytics",          element: <AnalyticsOverview /> },
          { path: "admin/claims",             element: <ClaimsPage /> },
          { path: "admin/items-verification", element: <ItemsVerification /> },
          { path: "admin/logs",               element: <LogsPage /> },
          { path: "admin/users",              element: <UsersPage /> },
          { path: "admin/profile",            element: <AdminProfile /> },
          { path: "admin/signup",             element: <AdminSignup /> },
        ],
      },

    ],
  },
  
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "signup",
    element: <Signup />,
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
  {
    path: "dashboard",
    element: <Dashboard />,
  },
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "about",
    element: <About />,
  },
  {
    path: "contact",
    element: <Contact />,
  },

]);