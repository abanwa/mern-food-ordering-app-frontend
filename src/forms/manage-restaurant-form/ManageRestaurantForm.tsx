import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import DetailsSection from "./DetailsSection";
import { Separator } from "@/components/ui/separator";
import CuisinesSection from "./CuisinesSection";
import MenuSection from "./MenuSection";
import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import ImageSection from "./ImageSection";
import { Restaurant } from "@/types";
import { useEffect } from "react";

const formSchema = z
  .object({
    restaurantName: z.string({
      required_error: "restaurant is required"
    }),
    city: z.string({
      required_error: "city is required"
    }),
    country: z.string({
      required_error: "country is required"
    }),
    deliveryPrice: z.coerce.number({
      required_error: "delivery price is required",
      invalid_type_error: "must be a valid number"
    }),
    estimatedDeliveryTime: z.coerce.number({
      required_error: "estimated delivery time is required",
      invalid_type_error: "must be a valid number"
    }),
    cuisines: z.array(z.string()).nonempty({
      message: "please select at least one item"
    }),
    menuItems: z.array(
      z.object({
        name: z.string().min(1, "name is required"),
        price: z.coerce.number().min(1, "price is required")
      })
    ),
    imageUrl: z.string().optional(),
    imageFile: z.instanceof(File, { message: "image is required" }).optional()
  })
  .refine((data) => data.imageUrl || data.imageFile, {
    message: "Either image URL or image File must be provided",
    path: ["imageFile"]
  });

type RestaurantFormData = z.infer<typeof formSchema>;

type Props = {
  restaurant?: Restaurant;
  onSave: (restaurantFormData: FormData) => void;
  isLoading: boolean;
};

// we will use a combination of react-hook-from and zod to manage the form for us

const ManageRestaurantForm = ({ onSave, isLoading, restaurant }: Props) => {
  const form = useForm<RestaurantFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cuisines: [],
      menuItems: [{ name: "", price: 0 }]
    }
  });

  useEffect(() => {
    // if the logged in user odes not have any restaurant in the database, do nothing and return
    if (!restaurant) {
      return;
    }

    // Format the data in the restaurant object to match what our form expect
    // just like the delivery price, we will format it back to how it will be. we conveted before to the lowest denomination by multiplying by 100
    const deliveryPriceFormatted = parseInt(
      (restaurant.deliveryPrice / 100).toFixed(2)
    );

    const menuItemsFormatted = restaurant.menuItems.map((item) => ({
      ...item,
      price: parseInt((item.price / 100).toFixed(2))
    }));

    // we will update the restaurant to how the form expects it
    const updatedRestaurant = {
      ...restaurant,
      deliveryPrice: deliveryPriceFormatted,
      menuItems: menuItemsFormatted
    };

    // we will  fill / populate the form with the restaurant record of the logged in user we fetched
    form.reset(updatedRestaurant);
  }, [form, restaurant]);

  // THIS WILL RUN WHEN WE SUBMIT THE FROM
  const onSubmit = (formDataJson: RestaurantFormData) => {
    //- convert formDataJson to a new FormData object so that we can submit ith along with the image that we upload
    // the formDataJson is going to be in plain javascript json, we will convert it to formData object
    const formData = new FormData();

    // console.log("formdataaaaJSON ", formDataJson);

    // NOTE: WE WILL CONVERT ALL OUR VALUES TO STRING BECAUSE HTTP REQUEST WORK WITh STRING
    formData.append("restaurantName", formDataJson.restaurantName);
    formData.append("city", formDataJson.city);
    formData.append("country", formDataJson.country);

    // we converted the price to lowest denomination to be able to send to stripe. like we converted 5 naira to kobo by multiplying by 100
    formData.append(
      "deliveryPrice",
      (formDataJson.deliveryPrice * 100).toString()
    );
    formData.append(
      "estimatedDeliveryTime",
      formDataJson.estimatedDeliveryTime.toString()
    );

    formDataJson.cuisines.forEach((cuisine, index) => {
      formData.append(`cuisines[${index}]`, cuisine);
    });

    formDataJson.menuItems.forEach((menuItem, index) => {
      formData.append(`menuItems[${index}][name]`, menuItem.name);
      formData.append(
        `menuItems[${index}][price]`,
        (menuItem.price * 100).toString()
      );
    });

    if (formDataJson.imageFile) {
      formData.append(`imageFile`, formDataJson.imageFile);
    }

    // we will call the onSave function and parse our formData into it
    // console.log("formdataaaa", formData);
    // console.log("menuName ", formData.get("menuItems[0][name]"));
    // console.log("price ", formData.get("menuItems[0][price]"));
    // console.log("imageFile ", formData.get("imageFile"));

    // return;
    onSave(formData);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 bg-gray-50 p-10 rounded-lg"
      >
        <DetailsSection />
        <Separator />
        <CuisinesSection />
        <Separator />
        <MenuSection />
        <Separator />
        <ImageSection />
        {isLoading ? <LoadingButton /> : <Button type="submit">Submit</Button>}
      </form>
    </Form>
  );
};

export default ManageRestaurantForm;
