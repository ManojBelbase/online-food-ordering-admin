import { createApiConfig } from "../../config/APIConfig";

interface User {
  _id: string;
  name: string;
  email: string;
}

export const userApi = createApiConfig<User>("users", "User", []);