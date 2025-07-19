import { useForm } from '@mantine/form';
import {
  globalCategoryApi,
  type IGlobalCategory,
} from '../../../server-action/api/global-category';
import { FormImageUpload, FormInput } from '../../../components/Forms';
import { Button, SimpleGrid, Stack } from '@mantine/core';
import {
  globalCategoryValidation,
  type GlobalCategoryFormValues,
} from './GlobalCategoryValidation';
import { useState } from 'react';
import { useCloudinaryUpload } from '../../../hooks/useCloudinaryUpload'; // Import the custom hook

interface IGlobalCategoryFormProps {
  edit?: IGlobalCategory;
  onClose: () => void;
}

const GlobalCategoryForm: React.FC<IGlobalCategoryFormProps> = ({ edit, onClose }) => {
  const { mutateAsync: createGlobalCategory } = globalCategoryApi.useCreate();
  const { mutateAsync: updateGlobalCategory } = globalCategoryApi.useUpdate();
  const { uploadImage, loading: uploadLoading, error: uploadError } = useCloudinaryUpload();
  const [loading, setLoading] = useState(false);
  const form = useForm<GlobalCategoryFormValues>({
    initialValues: {
      name: edit?.name ?? '',
      image: edit?.image ?? '',
      isActive: edit?.isActive ?? true,
    },
    validate: globalCategoryValidation,
  });

  const handleSubmit = async (values: GlobalCategoryFormValues) => {
   
    setLoading(true);
    try {
      if (edit?._id) {
        await updateGlobalCategory({ entityData: values, _id: edit._id });
      } else {
        await createGlobalCategory(values);
      }
      onClose();
    } catch (error) {
      console.error('Form submission failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="md" mt={10}>
        <SimpleGrid cols={2} spacing="md">
          <FormInput
            label="Category Name"
            type="text"
            placeholder="Enter Category Name"
            {...form.getInputProps('name')}
          />
          <FormImageUpload
            label="Image"
            uploadApi={uploadImage} 
            maxSize={5 * 1024 * 1024}
            {...form.getInputProps('image')}
            error={uploadError?.message}
            
          />
        </SimpleGrid>

        <SimpleGrid cols={2} spacing="md">
          <FormInput
            label="Active"
            type="toggle"
            {...form.getInputProps('isActive')}
          />
        </SimpleGrid>

        <Button type="submit" style={{ alignSelf: 'end' }} loading={loading || uploadLoading}>
          Submit
        </Button>
      </Stack>
    </form>
  );
};

export default GlobalCategoryForm;