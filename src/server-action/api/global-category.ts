import { createApiConfig } from "../../config/APIConfig";

export interface IGlobalCategory{
    name: string;
  slug: string;
  image?: string;
  isActive: boolean;
}

export const globalCategoryApi = createApiConfig<IGlobalCategory>("global-category","GlobalCategory");