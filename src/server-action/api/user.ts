import { createApiConfig } from "../../config/APIConfig";

interface IUser {
  _id: string;
  name: string;
  email: string;
}

export const userApi = createApiConfig<IUser>("users", "User", []);