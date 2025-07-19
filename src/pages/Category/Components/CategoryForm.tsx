import { useForm } from "@mantine/form";
import { Button, MultiSelect, SimpleGrid, Stack } from "@mantine/core";
import { FormImageUpload, FormInput } from "../../../components/Forms";
import { categoryApi, type ICategory } from "../../../server-action/api/category";
import { globalCategoryApi } from "../../../server-action/api/global-category";
import { useAuth } from "../../../redux/useAuth";
import { useCloudinaryUpload } from "../../../hooks/useCloudinaryUpload";

interface ICategoryFormProps {
  edit?: ICategory;
  onClose: () => void;
}

const CategoryForm: React.FC<ICategoryFormProps> = ({ edit, onClose }) => {
  const { user } = useAuth();
  const { mutateAsync: createCategory } = categoryApi.useCreate();
  const { mutateAsync: updateCategory } = categoryApi.useUpdate();
  const { uploadImage, error: uploadError } = useCloudinaryUpload();

  const { data: AllGlobalCategories } = globalCategoryApi.useGetAll();

  const form = useForm({
    initialValues: {
      name: edit?.name ?? "",
      image: edit?.image ?? "",
      globalCategoryId: edit?.globalCategoryId ?? [],
    },

    validate: {
      name: (value) => (!value ? "Name is required" : null),
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
        <SimpleGrid cols={2} spacing="md">
          <FormInput
            label="Category Name"
            type="text"
            placeholder="Enter Category Name"
            {...form.getInputProps("name")}
          />
          <FormImageUpload
            label="Image"
            uploadApi={uploadImage}
            maxSize={5 * 1024 * 1024}
            {...form.getInputProps("image")}
            error={uploadError?.message}
          />
        </SimpleGrid>

        <MultiSelect
          label="Global Categories"
          data={globalCategoryOptions}
          placeholder="Select Global Categories"
          searchable
          {...form.getInputProps("globalCategoryId")}
        />

        <SimpleGrid cols={2}>
      
        </SimpleGrid>

        <Button type="submit" style={{ alignSelf: "end" }} loading={form.submitting}>
          Submit
        </Button>
      </Stack>
    </form>
  );
};

export default CategoryForm;
