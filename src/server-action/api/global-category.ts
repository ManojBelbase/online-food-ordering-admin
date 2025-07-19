import { createApiConfig } from "../../config/APIConfig";

export interface IGlobalCategory{
  _id?:string
  name: string;
  slug?: string;
  image: string;
  isActive: boolean;
}

export const globalCategoryApi = createApiConfig<IGlobalCategory>("global-category","GlobalCategory");
