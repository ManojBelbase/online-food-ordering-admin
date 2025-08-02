import { makeRequest } from "../makeRequest";

export interface EmailVerificationStatus {
  email: string;
  isEmailVerified: boolean;
  isTokenExpired: boolean;
  canResendVerification: boolean;
}

export const emailVerificationApi = {
  adminResendVerificationEmail: async (userId: string) => {
    const response = await makeRequest.post(`/auth/admin/resend-verification/${userId}`);
    return response;
  },

  resendVerificationByEmail: async (email: string) => {
    const response = await makeRequest.post(`/auth/resend-verification`, { email });
    return response;
  },


  checkEmailVerificationStatus: async (email: string): Promise<EmailVerificationStatus> => {
    const response = await makeRequest.get(`/auth/verification-status/${email}`);
    return response.data;
  },
};