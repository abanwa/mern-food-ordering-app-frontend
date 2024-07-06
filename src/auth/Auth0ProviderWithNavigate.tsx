import { AppState, Auth0Provider } from "@auth0/auth0-react";
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

  // this function onRedirectCallback is tied to AuthProvider, the AuthProvider will provide or parse any appState that we define back to our onRedirectCallback() function. we will have access to the url using the appState. our url was defined in the checkOutButton component which is displayed in the detailPage.tsx
  const onRedirectCallback = (appState?: AppState) => {
    // console.log("USER ", user);
    navigate(appState?.returnTo || "/auth-callback");
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
