import { useAuth0 } from "@auth0/auth0-react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth0();

  // if it's loading to confrim whether user is authenticated or not, the return null
  if (isLoading) {
    // we can decide to show a loading spinner
    return null;
  }

  // if the user is logged in, all the  child route of this components will be render
  if (isAuthenticated) {
    return <Outlet />;
  }

  // if user is not authenticated, the redirect to home page
  // if the user is not logged in, the user will be redirected to the home page
  return <Navigate to="/" replace />;
};

export default ProtectedRoute;
