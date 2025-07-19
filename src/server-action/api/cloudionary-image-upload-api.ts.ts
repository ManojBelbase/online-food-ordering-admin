import { createApiConfig } from "../../config/APIConfig";

export interface ICloudinarySignUploadApi {
  timestamp: string;
  signature: string;
  apiKey: string;
  cloudName: string;
  folder?: string;
  fileName?: string;
}
export const CloudinarySignUploadApi = createApiConfig<ICloudinarySignUploadApi>("cloudinary/sign-upload", "Cloudionary Sign Upload")
