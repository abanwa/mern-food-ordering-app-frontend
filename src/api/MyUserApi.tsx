import { User } from "@/types";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useGetMyUser = () => {
  const { getAccessTokenSilently } = useAuth0();

  const getMyUserRequest = async (): Promise<User> => {
    const accessToken = await getAccessTokenSilently();

    const response = await fetch(`${API_BASE_URL}/api/my/user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }

    return response.json();
  };

  const {
    data: currentUser,
    isLoading,
    error
  } = useQuery("fetchCurrentUser", getMyUserRequest);

  if (error) {
    toast.error(error.toString());
  }

  return { currentUser, isLoading };
};

type CreateUserRequest = {
  auth0Id: string;
  email: string;
};

// THESE ARE CUSTOM HOOKS

export const useCreateMyUser = () => {
  // this function will help us fetch the auth0 token  from the auth0 server using the useAuth0 hook
  const { getAccessTokenSilently } = useAuth0();

  const createMyUserRequest = async (user: CreateUserRequest) => {
    // this will get the access token
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(`${API_BASE_URL}/api/my/user`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    });

    if (!response.ok) {
      throw new Error("Failed to create user");
    }
  };

  const {
    mutateAsync: createUser,
    isLoading,
    isError,
    isSuccess
  } = useMutation(createMyUserRequest);

  return { createUser, isLoading, isError, isSuccess };
};

type UpdateMyUserRequest = {
  name: string;
  addressLine1: string;
  city: string;
  country: string;
};

// in this case, we are not sending the email too
export const useUpdateMyUser = () => {
  const { getAccessTokenSilently } = useAuth0();

  const updateMyUserRequest = async (formData: UpdateMyUserRequest) => {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(`${API_BASE_URL}/api/my/user`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      throw new Error("Failed to update user");
    }

    return response.json();
  };

  // we will use useMutation hook so that react query can handle the fetch request for us
  const {
    mutateAsync: updateUser,
    isLoading,
    isSuccess,
    error,
    reset
  } = useMutation(updateMyUserRequest);

  if (isSuccess) {
    // we could access the toast from anywhere because we called it in our to component which is the main.jsx
    toast.success("User Profile updated!");
  }

  if (error) {
    toast.error(error.toString());
    // reset will clear  state from this request
    reset();
  }

  return { updateUser, isLoading };
};
