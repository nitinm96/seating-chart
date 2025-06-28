import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export default function ProtectedRoutes() {
  const { user } = useContext(UserContext);
  return user ? <Outlet /> : <Navigate to="/" />;
}
