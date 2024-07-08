import {
  useCreateMyRestaurant,
  useGetMyRestaurant,
  useGetMyRestaurantOrders,
  useUpdateMyRestaurant
} from "@/api/MyRestaurantApi";
import OrderItemCard from "@/components/OrderItemCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

  const { orders } = useGetMyRestaurantOrders();
  console.log("orders ", orders);

  // whenever the page loads for the first time, regardless of what the user is trying to do, it will try and fetch the user's restaurant. we are checking if the restaurant already exist for the user. The double exclamation means give me the truety value of the restaurant variable. if there is a restaurant, editing will be true, if there is no restaurant, editing will be false
  const isEditing = !!restaurant;

  return (
    /*
    <ManageRestaurantForm
      restaurant={restaurant}
      onSave={isEditing ? updateRestaurant : createMyRestaurant}
      isLoading={isCreateLoading || isUpdateLoading}
    />
    */
    <Tabs defaultValue="orders">
      <TabsList>
        <TabsTrigger value="orders">Orders</TabsTrigger>
        <TabsTrigger value="manage-restaurant">Manage Restaurant</TabsTrigger>
      </TabsList>
      <TabsContent
        value="orders"
        className="space-y-5 bg-gray-50 pg-10 rounded-lg"
      >
        <h2 className="text-2xl font-bold">{orders?.length} active orders</h2>
        {orders?.map((order) => (
          <OrderItemCard order={order} key={order._id} />
        ))}
      </TabsContent>
      <TabsContent value="manage-restaurant">
        <ManageRestaurantForm
          restaurant={restaurant}
          onSave={isEditing ? updateRestaurant : createMyRestaurant}
          isLoading={isCreateLoading || isUpdateLoading}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ManageRestaurantPage;
