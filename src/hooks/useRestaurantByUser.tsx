import { useAuth } from "../redux/useAuth";
import { restaurantApiForUser } from "../server-action/api/restaurant";

export const useRestaurantByUser = () => {
  const { user } = useAuth();

  const {
    data: restaurantData,
    isLoading,
    isError,
    error,
  } = restaurantApiForUser.useGetById(user?.id ?? "");

  const restaurant = restaurantData?.restaurant;

  return {
    restaurant,
    isLoading,
    isError,
    error,
  };
};
