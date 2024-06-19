import { Auth0Provider } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

type Props = {
  children: React.ReactNode;
};

const Auth0ProviderWithNavigate = ({ children }: Props) => {
  const navigate = useNavigate();
  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_AUTH0_CALLBACK_URL;
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

  if (!domain || !clientId || !redirectUri || !audience) {
    throw new Error("unable to initialise auth");
  }

  // appState will have the current url user was on before we send them to the login page so that we can grab the url they were before. the  user object is going to have details about the logged in user like the email addess the user signed up with etc
  // const onRedirectCallback = (appState?: AppState, user?: User) => {
  const onRedirectCallback = () => {
    // console.log("USER ", user);
    navigate("/auth-callback");
  };

  // this is where we will add the auth provider that comes from the auth SDK
  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{ redirect_uri: redirectUri, audience }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithNavigate;
