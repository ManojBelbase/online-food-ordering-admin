import React from "react";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import type { FormSection } from "../../types/ui";
import GlobalForm from "../../components/GlobalComponents/GlobalForm";


interface MenuItemFormData {
  name: string;
  description: string;
  category: string;
  price: number;
  preparationTime: number;
  isVegetarian: boolean;
  isAvailable: boolean;
  ingredients: string[];
  image: File | null;
}

const AddMenuItemPage: React.FC = () => {
  

  const form = useForm<MenuItemFormData>({
    initialValues: {
      name: "",
      description: "",
      category: "",
      price: 0,
      preparationTime: 15,
      isVegetarian: false,
      isAvailable: true,
      ingredients: [],
      image: null,
    },
    validate: {
      name: (value) => {
        if (!value) return "Item name is required";
        if (value.length < 3) return "Item name must be at least 3 characters";
        return null;
      },
      description: (value) => {
        if (!value) return "Description is required";
        if (value.length < 10)
          return "Description must be at least 10 characters";
        return null;
      },
      category: (value) => (!value ? "Category is required" : null),
      price: (value) => {
        if (!value || value <= 0) return "Price must be greater than 0";
        return null;
      },
      preparationTime: (value) => {
        if (!value || value <= 0)
          return "Preparation time must be greater than 0";
        return null;
      },
    },
  });

  const handleSubmit = async (values: MenuItemFormData) => {
    try {
      console.log("Form submitted:", values);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      notifications.show({
        title: "Success",
        message: "Menu item added successfully!",
        color: "green",
      });

      form.reset();
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to add menu item. Please try again.",
        color: "red",
      });
    }
  };

  const formSections: FormSection[] = [
    {
      title: "Basic Information",
      description: "Enter the basic details of the menu item",
      columns: 2,
      fields: [
        {
          name: "name",
          label: "Item Name",
          type: "text",
          placeholder: "Enter item name",
          required: true,
          span: 2,
        },
        {
          name: "category",
          label: "Category",
          type: "select",
          placeholder: "Select category",
          required: true,
          options: [
            { value: "appetizers", label: "Appetizers" },
            { value: "main-course", label: "Main Course" },
            { value: "desserts", label: "Desserts" },
            { value: "beverages", label: "Beverages" },
            { value: "salads", label: "Salads" },
          ],
        },
        {
          name: "price",
          label: "Price ($)",
          type: "number",
          placeholder: "0.00",
          required: true,
          min: 0,
          step: 0.01,
        },
        {
          name: "description",
          label: "Description",
          type: "textarea",
          placeholder: "Describe the menu item...",
          required: true,
          rows: 4,
          span: 2,
        },
      ],
    },
    {
      title: "Additional Details",
      description: "Set preparation time and dietary information",
      columns: 2,
      fields: [
        {
          name: "preparationTime",
          label: "Preparation Time (minutes)",
          type: "number",
          placeholder: "15",
          required: true,
          min: 1,
          max: 120,
        },
        {
          name: "ingredients",
          label: "Ingredients",
          type: "multiselect",
          placeholder: "Select ingredients",
          options: [
            { value: "chicken", label: "Chicken" },
            { value: "beef", label: "Beef" },
            { value: "pork", label: "Pork" },
            { value: "fish", label: "Fish" },
            { value: "vegetables", label: "Vegetables" },
            { value: "cheese", label: "Cheese" },
            { value: "pasta", label: "Pasta" },
            { value: "rice", label: "Rice" },
            { value: "bread", label: "Bread" },
            { value: "spices", label: "Spices" },
          ],
        },
        {
          name: "isVegetarian",
          label: "Vegetarian",
          type: "checkbox",
        },
        {
          name: "isAvailable",
          label: "Available for Order",
          type: "switch",
        },
      ],
    },
    {
      title: "Image Upload",
      description: "Upload an image for the menu item",
      fields: [
        {
          name: "image",
          label: "Menu Item Image",
          type: "file",
          accept: "image/*",
          placeholder: "Choose image file...",
        },
      ],
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <GlobalForm
        form={form}
        sections={formSections}
        onSubmit={handleSubmit}
        title="Add New Menu Item"
        description="Create a new menu item for your restaurant"
        submitLabel="Add Menu Item"
        showReset={true}
        resetLabel="Clear Form"
      />
    </div>
  );
};

export default AddMenuItemPage;
