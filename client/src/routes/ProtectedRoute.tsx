import { useContext } from "react";
import { Navigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

export const ProtectedRoutes = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const context = useContext(AuthContext);
  if (!context) return <Navigate to="/login" />;

  const { authUser, authLoading } = context;
  // Wait until auth check is complete
  if (authLoading) return null;

  // return authUser ? children : <Navigate to="/login" />;
  return authUser ? <>{children}</> : <Navigate to="/login" />;
};
