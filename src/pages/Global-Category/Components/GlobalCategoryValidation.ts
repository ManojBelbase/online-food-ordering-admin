export const globalCategoryValidation = {
  name: (value: string) => (value.length > 0 ? null : 'Category name is required'),
 
};

export type GlobalCategoryFormValues = {
  name: string;
  slug?: string;
  image: string;
  isActive: boolean;
};