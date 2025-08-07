import { useForm } from '@mantine/form';
import { SimpleGrid, Stack } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { FormImageUpload, FormInput, FormSelect } from '../../../components/Forms';
import { foodItemApi, type IFoodItem } from '../../../server-action/api/food-item';
import { categoryApi } from '../../../server-action/api/category';
import { useCloudinaryUpload } from '../../../hooks/useCloudinaryUpload';
import { CuisineType } from '../../../constants/cuisine-type';
import { FormTags } from '../../../components/Forms/FormTags';
import { useRestaurantByUser } from '../../../hooks/useRestaurantByUser';
import { ActionButton } from '../../../components/ui';

interface IFoodItemFormProps {
  edit?: IFoodItem;
  onClose: () => void;
}

const FoodItemForm: React.FC<IFoodItemFormProps> = ({ edit, onClose }) => {
const {restaurant}= useRestaurantByUser();

  // Responsive breakpoints
  const isMobile = useMediaQuery('(max-width: 480px)');
  const { mutateAsync: createFoodItem } = foodItemApi.useCreate();
  const { mutateAsync: updateFoodItem } = foodItemApi.useUpdate();
  const { uploadImage, error: uploadError } = useCloudinaryUpload();
  const { data: allCategories } = categoryApi.useGetAll();

  const form = useForm({
    initialValues: {
      name: edit?.name ?? '',
      image: edit?.image ?? '',
      cuisineType: edit?.cuisineType ?? 'Other',
      price: edit?.price ?? 0,
      isVeg: edit?.isVeg ?? false,
      description: edit?.description ?? '',
      categoryId: edit?.categoryId ?? '',
    tags: edit?.tags ?? [],
    },
    validate: {
      name: (value) => (!value ? 'Name is required' : null),
      image: (value) => (!value ? 'Image is required' : null),
      cuisineType: (value) => (!value ? 'Cuisine type is required' : null),
      price: (value) => (value <= 0 ? 'Price must be greater than 0' : null),
      description: (value) => (!value ? 'Description is required' : null),
      categoryId: (value) => (!value ? 'Category is required' : null),
      tags: (value) => (value.length === 0 ? 'At least one tag is required' : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    const entityData = {
      ...values,
      resturantId: restaurant?._id ?? '',
      price: Number(values.price),
      _id: edit?._id ?? '',
    };

    if (edit?._id) {
      await updateFoodItem({ _id: edit._id, entityData });
    } else {
      await createFoodItem(entityData as any);
    }
    onClose();
  };

  const categoryOptions =
    (allCategories as any)?.category?.map((item: any) => ({
      label: item.name,
      value: item._id,
    })) ?? [];

  const cuisineTypeOptions = Object.values(CuisineType).map((type) => ({
    label: String(type),
    value: String(type),
  }));

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="md" mt={10}>
        <SimpleGrid cols={isMobile ? 1 : 2} spacing={isMobile ? "sm" : "md"}>
          <FormInput
            required
            label="Food Item Name"
            type="text"
            placeholder="Enter Food Item Name"
            withAsterisk
            {...form.getInputProps('name')}
          />
          <FormImageUpload
            required
            label="Image"
            uploadApi={uploadImage}
            maxSize={5 * 1024 * 1024}
            withAsterisk
            responsive
            {...form.getInputProps('image')}
            error={uploadError?.message}
          />
          <FormSelect
            required
            label="Cuisine Type"
            data={cuisineTypeOptions}
            placeholder="Select Cuisine Type"
            searchable
            withAsterisk
            {...form.getInputProps('cuisineType')}
          />
          <FormInput
            required
            label="Price"
            type="number"
            placeholder="Enter Price"
            withAsterisk
            {...form.getInputProps('price')}
          />
          <FormSelect
            required
            label="Category"
            data={categoryOptions}
            placeholder="Select Category"
            searchable
            withAsterisk
            {...form.getInputProps('categoryId')}
          />
          <FormInput
            label="Vegetarian"
            type="toggle"
            {...form.getInputProps('isVeg')}
          />
          <FormInput
            required
            label="Description"
            type="textarea"
            placeholder="Enter Description"
            withAsterisk
            {...form.getInputProps('description')}
          />
          <FormTags
            required
            label="Tags"
            placeholder="Enter tags (press Enter or Space to add)"
            withAsterisk
            {...form.getInputProps('tags')}
          />
        </SimpleGrid>

        <ActionButton
          type="submit"
          variant="primary"
          loading={form.submitting}
          style={{ alignSelf: 'end' }}
        >
          Submit
        </ActionButton>
      </Stack>
    </form>
  );
};

export default FoodItemForm;