// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({ roles, children }) {
  const { currentUser } = useAuth();

  if (!currentUser) return <Navigate to="/login" replace />;

  if (roles && !currentUser.roles.some(r => roles.includes(r))) {
    return <Navigate to="/" replace />;
  }

  return children;
}
