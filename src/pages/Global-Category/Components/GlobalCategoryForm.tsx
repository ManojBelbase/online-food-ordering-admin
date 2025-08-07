import { useForm } from '@mantine/form';
import {
  globalCategoryApi,
  type IGlobalCategory,
} from '../../../server-action/api/global-category';
import { FormImageUpload, FormInput } from '../../../components/Forms';
import { SimpleGrid, Stack } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { ActionButton } from '../../../components/ui';
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

  // Responsive breakpoints
  const isMobile = useMediaQuery('(max-width: 480px)');
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
        <SimpleGrid cols={isMobile ? 1 : 2} spacing={isMobile ? "sm" : "md"}>
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
            responsive
            {...form.getInputProps('image')}
            error={uploadError?.message}

          />
        </SimpleGrid>

        <SimpleGrid cols={isMobile ? 1 : 2} spacing={isMobile ? "sm" : "md"}>
          <FormInput
            label="Active"
            type="toggle"
            {...form.getInputProps('isActive')}
          />
        </SimpleGrid>

        <ActionButton
          type="submit"
          variant="primary"
          loading={loading || uploadLoading}
          style={{ alignSelf: 'end' }}
        >
          Submit
        </ActionButton>
      </Stack>
    </form>
  );
};

export default GlobalCategoryForm;