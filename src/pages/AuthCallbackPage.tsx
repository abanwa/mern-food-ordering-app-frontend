import { useCreateMyUser } from "@/api/MyUserApi";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  // This will give us access to the current logged in user
  const { user } = useAuth0();
  const { createUser } = useCreateMyUser();

  //when the component loads, we want to create user

  // we don't want this to rerender whenever the variable changes, we will use useRef
  // if the user is not has not been created, the user trying to logged in or will be created
  const hasCreatedUser = useRef(false);
  useEffect(() => {
    if (user?.sub && user?.email && !hasCreatedUser.current) {
      createUser({ auth0Id: user.sub, email: user.email });

      hasCreatedUser.current = true;
    }
    navigate("/");
  }, [createUser, navigate, user]);

  return <>Loading...</>;
};

export default AuthCallbackPage;
