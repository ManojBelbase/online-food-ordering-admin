

export const loginValidators = {
  email: (value: string) => {
    if (!value) return "Email is required";
    if (!/^\S+@\S+$/.test(value)) return "Invalid email format";
    return null;
  },
  password: (value: string) => {
    if (!value) return "Password is required";
    if (value.length < 6) return "Password must be at least 6 characters";
    return null;
  },
};
