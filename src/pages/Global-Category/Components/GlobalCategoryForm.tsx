import { useForm } from "@mantine/form";
import { globalCategoryApi, type IGlobalCategory } from "../../../server-action/api/global-category";
import { FormImageUpload, FormInput } from "../../../components/Forms";
import { Button, SimpleGrid, Stack, Switch } from "@mantine/core";

const GlobalCategoryForm: React.FC = () => {
  const { mutateAsync: createGlobalCategory } = globalCategoryApi.useCreate();

  const form = useForm<IGlobalCategory>({
    initialValues: {
      name: "",
      slug: "",
      image: "",
      isActive: true,
    },
  });

  const handleSubmit = async (values: IGlobalCategory) => {
    try {
      await createGlobalCategory(values);
    } catch (error) {
      // handle error
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="md">
        <SimpleGrid cols={2} spacing="md">
          <FormInput
            label="Category Name"
            type="text"
            placeholder="Enter Category Name"
            {...form.getInputProps("name")}
          />
          <FormInput
            label="Slug"
            type="text"
            placeholder="Enter Slug"
            {...form.getInputProps("slug")}
          />
        </SimpleGrid>

        <SimpleGrid cols={2} spacing="md">
          <Switch
            label="Active"
            checked={form.values.isActive}
            onChange={(event) => form.setFieldValue("isActive", event.currentTarget.checked)}
          />
          <FormImageUpload
            label="Image"
            value={form.values.image}
            onChange={(url) => form.setFieldValue("image", url)}
            maxSize={5 * 1024 * 1024}
          />
        </SimpleGrid>

        {/* Submit Button */}
        <Button type="submit"  style={{ alignSelf: 'end' }}>
          Submit
        </Button>
      </Stack>
    </form>
  );
};

export default GlobalCategoryForm;
