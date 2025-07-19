import { createApiConfig } from "../../config/APIConfig";

export interface ICategory{
  id?:string
  _id?:string
   name: string;
  restaurantId?: string;
  image: string;
  globalCategoryId?: string[];
}

export const categoryApi = createApiConfig<ICategory>("category", "Category")