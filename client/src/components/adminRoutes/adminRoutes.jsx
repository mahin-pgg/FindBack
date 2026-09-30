// AdminRoutes.jsx
import Cookies from "js-cookie";
import { Navigate, Outlet } from "react-router";

export default function AdminRoutes() {
  const user = JSON.parse(Cookies.get("user") || "{}");

  if (user.role !== "admin") return <Navigate to="/dashboard" />;

  return <Outlet />;
}