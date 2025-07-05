import type { OrderFormData } from "../types/ui";

export const orderFormValidators: Record<
  keyof Pick<OrderFormData, "customerName" | "customerEmail" | "customerPhone">,
  (value: any) => string | null
> = {
  customerName: (value) => {
    if (!value) return "Customer name is required";
    if (value.length < 2) return "Must be at least 2 characters";
    return null;
  },
  customerEmail: (value) => {
    if (!value) return "Email is required";
    if (!/^\S+@\S+$/.test(value)) return "Invalid email format";
    return null;
  },
  customerPhone: (value) => {
    if (!value) return "Phone number is required";
    if (!/^\+?[\d\s\-\(\)]+$/.test(value)) return "Invalid phone format";
    return null;
  },
};
