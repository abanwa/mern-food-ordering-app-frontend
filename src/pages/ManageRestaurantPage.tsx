import {
  useCreateMyRestaurant,
  useGetMyRestaurant,
  useUpdateMyRestaurant
} from "@/api/MyRestaurantApi";
import ManageRestaurantForm from "@/forms/manage-restaurant-form/ManageRestaurantForm";

const ManageRestaurantPage = () => {
  // the custom hook for creating a restaurant
  const { createMyRestaurant, isLoading: isCreateLoading } =
    useCreateMyRestaurant();
  // the custom hook for fetching a restaurant
  const { restaurant } = useGetMyRestaurant();
  // This is custom hook we use to update the restaurantt
  const { updateRestaurant, isLoading: isUpdateLoading } =
    useUpdateMyRestaurant();

  // whenever the page loads for the first time, regardless of what the user is trying to do, it will try and fetch the user's restaurant. we are checking if the restaurant already exist for the user. The double exclamation means give me the truety value of the restaurant variable. if there is a restaurant, editing will be true, if there is no restaurant, editing will be false
  const isEditing = !!restaurant;

  return (
    <ManageRestaurantForm
      restaurant={restaurant}
      onSave={isEditing ? updateRestaurant : createMyRestaurant}
      isLoading={isCreateLoading || isUpdateLoading}
    />
  );
};

export default ManageRestaurantPage;
