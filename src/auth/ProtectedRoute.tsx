import { useAuth0 } from "@auth0/auth0-react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth0();

  // if the user is logged in, all the  child route of this components will be render
  // if the user is not logged in, the user will be redirected to the home page
  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
