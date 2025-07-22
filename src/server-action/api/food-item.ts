import { createApiConfig } from "../../config/APIConfig";

export interface IFoodItem {
  name: string;
  price: number;
  description: string;
  resturantId:string
  image: string;
  isVeg: boolean;
  categoryId?:string
  tags: string[];
  cuisineType: string;
  _id:string
  
}

export const foodItemApi = createApiConfig<IFoodItem>("food-item", "Food Item")