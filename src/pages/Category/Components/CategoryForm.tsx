import { useForm } from "@mantine/form";
import { MultiSelect, SimpleGrid, Stack } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { FormImageUpload, FormInput } from "../../../components/Forms";
import { categoryApi, type ICategory } from "../../../server-action/api/category";
import { globalCategoryApi } from "../../../server-action/api/global-category";
import { useAuth } from "../../../redux/useAuth";
import { useCloudinaryUpload } from "../../../hooks/useCloudinaryUpload";
import { ActionButton } from "../../../components/ui";

interface ICategoryFormProps {
  edit?: ICategory;
  onClose: () => void;
}

const CategoryForm: React.FC<ICategoryFormProps> = ({ edit, onClose }) => {
  const { user } = useAuth();

  // Responsive breakpoints
  const isMobile = useMediaQuery('(max-width: 480px)');
  const { mutateAsync: createCategory } = categoryApi.useCreate();
  const { mutateAsync: updateCategory } = categoryApi.useUpdate();
  const { uploadImage, error: uploadError } = useCloudinaryUpload();

  const { data: AllGlobalCategories } = globalCategoryApi.useGetAll();

  const form = useForm({
    initialValues: {
      name: edit?.name ?? "",
      image: edit?.image ?? "",
      globalCategoryId: Array.isArray(edit?.globalCategoryId) ? edit.globalCategoryId : [],
    },

    validate: {
      name: (value, values) => {
        if(values.globalCategoryId.length>0) return null;
        return !value ? "Name is required":null
      },

    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      const entityData = {
        ...values,
        restaurantId: user?.id, 
      };
      if (edit?._id) {
        await updateCategory({ _id: edit?._id, entityData:entityData });
      } else {
        await createCategory(entityData);
      }
      onClose();
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
    }
  };

  const globalCategoryOptions =
    (AllGlobalCategories as any)?.globalCategory?.map((item:ICategory) => ({
      label: item.name,
      value: item._id,
    })) ?? [];

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="md" mt={10}>
        <SimpleGrid cols={isMobile ? 1 : 2} spacing={isMobile ? "sm" : "md"}>
          
        <MultiSelect
          label="Global Categories"
          data={globalCategoryOptions}
          placeholder="Select Global Categories"
          searchable
          {...form.getInputProps("globalCategoryId")}
          disabled={form.values.image.length>0 || form.values.name.length>0}
        />
          <FormInput
          required
            label="Category Name"
            type="text"
            disabled={form.values.globalCategoryId.length>0}
            placeholder="Enter Category Name"
            {...form.getInputProps("name")}
          />
          <FormImageUpload
          required
            label="Image"
            uploadApi={uploadImage}
            maxSize={5 * 1024 * 1024}
            responsive
            {...form.getInputProps("image")}
            disabled={form.values.globalCategoryId.length>0}
            error={uploadError?.message}

          />
        </SimpleGrid>


       

        <ActionButton
          type="submit"
          variant="primary"
          loading={form.submitting}
          style={{ alignSelf: "end" }}
        >
          Submit
        </ActionButton>
      </Stack>
    </form>
  );
};

export default CategoryForm;
