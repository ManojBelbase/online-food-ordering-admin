import { createApiConfig } from "../../config/APIConfig";

export interface IRestaurant{
userId:string;
  restaurantName: string;
  logo: string;
  address: string;
  cuisineType: string;
  licenseNumber: string;
  weeklySchedule?: {
    [key: string]: {
      open: string;
      close: string;
      isClosed: boolean;
    };
  };
  manualOverride: {
    isManuallySet: boolean;
    isOpen: boolean;
  };
  location: {
    type: string;
    coordinates: number[];
  };
}

export const restaurantApi = createApiConfig<IRestaurant>("restaurant", "Restaurant")
export const restaurantApiForUser = createApiConfig<IRestaurant>("restaurant/user", "Restaurant")