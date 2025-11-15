import { useAuth } from "../redux/useAuth";
import { restaurantApiForUser } from "../server-action/api/restaurant";
import { Roles } from "../constants/roles";

export const useRestaurantByUser = (enabled?: boolean) => {
  const { user } = useAuth();
  const userId = user?.id ?? "";
  const shouldFetch = enabled !== undefined ? enabled : user?.role === Roles.RESTAURANT && !!userId;

  const {
    data: restaurantData,
    isLoading,
    isError,
    error,
  } = restaurantApiForUser.useGetById(userId, { enabled: shouldFetch });

  const restaurant = restaurantData?.restaurant;

  return {
    restaurant,
    isLoading: shouldFetch ? isLoading : false,
    isError,
    error,
  };
};
