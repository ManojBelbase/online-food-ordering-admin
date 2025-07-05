import type { FormSection } from '../types/ui';

// Order Form Configuration
export const getOrderFormSections = (): FormSection[] => [
  {
    title: 'Customer Information',
    description: 'Enter customer details for the order',
    columns: 2,
    fields: [
      {
        name: 'customerName',
        label: 'Customer Name',
        type: 'text',
        placeholder: 'Enter customer name',
        required: true,
      },
      {
        name: 'customerEmail',
        label: 'Email Address',
        type: 'email',
        placeholder: 'customer@example.com',
        required: true,
      },
      {
        name: 'customerPhone',
        label: 'Phone Number',
        type: 'text',
        placeholder: '+1 (555) 123-4567',
        required: true,
        span: 2,
      },
    ],
  },
  {
    title: 'Delivery Address',
    description: 'Specify where the order should be delivered',
    columns: 2,
    fields: [
      {
        name: 'deliveryAddress.street',
        label: 'Street Address',
        type: 'text',
        placeholder: '123 Main Street',
        required: true,
        span: 2,
      },
      {
        name: 'deliveryAddress.city',
        label: 'City',
        type: 'text',
        placeholder: 'Springfield',
        required: true,
      },
      {
        name: 'deliveryAddress.state',
        label: 'State',
        type: 'select',
        placeholder: 'Select state',
        required: true,
        options: [
          { value: 'AL', label: 'Alabama' },
          { value: 'CA', label: 'California' },
          { value: 'FL', label: 'Florida' },
          { value: 'IL', label: 'Illinois' },
          { value: 'NY', label: 'New York' },
          { value: 'TX', label: 'Texas' },
        ],
      },
      {
        name: 'deliveryAddress.zipCode',
        label: 'ZIP Code',
        type: 'text',
        placeholder: '12345',
        required: true,
      },
    ],
  },
  {
    title: 'Order Details',
    description: 'Payment method and special instructions',
    columns: 2,
    fields: [
      {
        name: 'paymentMethod',
        label: 'Payment Method',
        type: 'select',
        placeholder: 'Select payment method',
        required: true,
        options: [
          { value: 'credit_card', label: 'Credit Card' },
          { value: 'debit_card', label: 'Debit Card' },
          { value: 'paypal', label: 'PayPal' },
          { value: 'cash_on_delivery', label: 'Cash on Delivery' },
          { value: 'bank_transfer', label: 'Bank Transfer' },
        ],
      },
      {
        name: 'scheduledDeliveryTime',
        label: 'Scheduled Delivery Time',
        type: 'date',
        placeholder: 'Select delivery date',
      },
      {
        name: 'specialInstructions',
        label: 'Special Instructions',
        type: 'textarea',
        placeholder: 'Any special delivery instructions...',
        rows: 3,
        span: 2,
      },
    ],
  },
];

// Menu Item Form Configuration
export const getMenuItemFormSections = (): FormSection[] => [
  {
    title: 'Basic Information',
    description: 'Enter the basic details of the menu item',
    columns: 2,
    fields: [
      {
        name: 'name',
        label: 'Item Name',
        type: 'text',
        placeholder: 'Enter item name',
        required: true,
        span: 2,
      },
      {
        name: 'category',
        label: 'Category',
        type: 'select',
        placeholder: 'Select category',
        required: true,
        options: [
          { value: 'appetizers', label: 'Appetizers' },
          { value: 'main-course', label: 'Main Course' },
          { value: 'desserts', label: 'Desserts' },
          { value: 'beverages', label: 'Beverages' },
          { value: 'salads', label: 'Salads' },
        ],
      },
      {
        name: 'price',
        label: 'Price ($)',
        type: 'number',
        placeholder: '0.00',
        required: true,
        min: 0,
        step: 0.01,
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        placeholder: 'Describe the menu item...',
        required: true,
        rows: 4,
        span: 2,
      },
    ],
  },
  {
    title: 'Additional Details',
    description: 'Set preparation time and dietary information',
    columns: 2,
    fields: [
      {
        name: 'preparationTime',
        label: 'Preparation Time (minutes)',
        type: 'number',
        placeholder: '15',
        required: true,
        min: 1,
        max: 120,
      },
      {
        name: 'ingredients',
        label: 'Ingredients',
        type: 'multiselect',
        placeholder: 'Select ingredients',
        options: [
          { value: 'chicken', label: 'Chicken' },
          { value: 'beef', label: 'Beef' },
          { value: 'pork', label: 'Pork' },
          { value: 'fish', label: 'Fish' },
          { value: 'vegetables', label: 'Vegetables' },
          { value: 'cheese', label: 'Cheese' },
          { value: 'pasta', label: 'Pasta' },
          { value: 'rice', label: 'Rice' },
          { value: 'bread', label: 'Bread' },
          { value: 'spices', label: 'Spices' },
        ],
      },
      {
        name: 'isVegetarian',
        label: 'Vegetarian',
        type: 'checkbox',
      },
      {
        name: 'isAvailable',
        label: 'Available for Order',
        type: 'switch',
      },
    ],
  },
  {
    title: 'Image Upload',
    description: 'Upload an image for the menu item',
    fields: [
      {
        name: 'image',
        label: 'Menu Item Image',
        type: 'file',
        accept: 'image/*',
        placeholder: 'Choose image file...',
      },
    ],
  },
];

// Customer Form Configuration
export const getCustomerFormSections = (): FormSection[] => [
  {
    title: 'Customer Information',
    description: 'Basic customer details',
    columns: 2,
    fields: [
      {
        name: 'name',
        label: 'Full Name',
        type: 'text',
        placeholder: 'Enter customer name',
        required: true,
      },
      {
        name: 'email',
        label: 'Email Address',
        type: 'email',
        placeholder: 'customer@example.com',
        required: true,
      },
      {
        name: 'phone',
        label: 'Phone Number',
        type: 'text',
        placeholder: '+1 (555) 123-4567',
        required: true,
      },
      {
        name: 'dateOfBirth',
        label: 'Date of Birth',
        type: 'date',
        placeholder: 'Select date',
      },
    ],
  },
  {
    title: 'Address Information',
    description: 'Customer address details',
    columns: 2,
    fields: [
      {
        name: 'address.street',
        label: 'Street Address',
        type: 'text',
        placeholder: '123 Main Street',
        span: 2,
      },
      {
        name: 'address.city',
        label: 'City',
        type: 'text',
        placeholder: 'Springfield',
      },
      {
        name: 'address.state',
        label: 'State',
        type: 'select',
        placeholder: 'Select state',
        options: [
          { value: 'AL', label: 'Alabama' },
          { value: 'CA', label: 'California' },
          { value: 'FL', label: 'Florida' },
          { value: 'IL', label: 'Illinois' },
          { value: 'NY', label: 'New York' },
          { value: 'TX', label: 'Texas' },
        ],
      },
    ],
  },
];
