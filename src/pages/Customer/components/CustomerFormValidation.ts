// validations/customerValidation.ts
export const customerValidation = {
  email: (value: string) =>
    /^\S+@\S+\.\S+$/.test(value) ? null : "Invalid email",

  password: (value: string) =>
    value.length >= 6 ? null : "Password must be at least 6 characters",

  role: (value: string) =>
    value ? null : "Role is required",
};
