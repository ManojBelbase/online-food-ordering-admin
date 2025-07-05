import {
  TextInput,
  PasswordInput,
  NumberInput,
  Textarea,
  Select,
  MultiSelect,
  Checkbox,
  Switch,
  FileInput,
  Button,
  Group,
  Stack,
  Paper,
  Title,
  Divider,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useTheme } from "../../contexts/ThemeContext";
import type { FormField, FormBuilderProps } from "../../types/ui";

const GlobalForm: React.FC<FormBuilderProps> = ({
  form,
  sections,
  onSubmit,
  loading = false,
  submitLabel = "Submit",
  showReset = true,
  resetLabel = "Reset",
  title,
  description,
}) => {
  const { theme } = useTheme();

  const getInputStyles = () => ({
    input: {
      backgroundColor: theme.colors.inputBackground,
      borderColor: theme.colors.inputBorder,
      color: theme.colors.inputText,
      "&::placeholder": {
        color: theme.colors.inputPlaceholder,
      },
      "&:focus": {
        borderColor: theme.colors.primary,
      },
    },
    label: {
      color: theme.colors.textPrimary,
    },
    description: {
      color: theme.colors.textSecondary,
    },
    error: {
      color: theme.colors.error,
    },
  });

  const renderField = (field: FormField) => {
    const commonProps = {
      key: field.name,
      label: field.label,
      placeholder: field.placeholder,
      required: field.required,
      disabled: field.disabled,
      description: field.description,
      leftSection: field.leftSection,
      rightSection: field.rightSection,
      styles: getInputStyles(),
      ...form.getInputProps(field.name),
    };

    switch (field.type) {
      case "text":
      case "email":
        return <TextInput {...commonProps} type={field.type} />;

      case "password":
        return <PasswordInput {...commonProps} />;

      case "number":
        return (
          <NumberInput
            {...commonProps}
            min={field.min}
            max={field.max}
            step={field.step}
          />
        );

      case "textarea":
        return (
          <Textarea
            {...commonProps}
            rows={field.rows || 4}
            autosize
            minRows={2}
            maxRows={10}
          />
        );

      case "select":
        return (
          <Select
            {...commonProps}
            data={field.options || []}
            searchable
            clearable
          />
        );

      case "multiselect":
        return (
          <MultiSelect
            {...commonProps}
            data={field.options || []}
            searchable
            clearable
          />
        );

      case "checkbox":
        return (
          <Checkbox
            {...commonProps}
            styles={{
              ...getInputStyles(),
              label: {
                color: theme.colors.textPrimary,
              },
            }}
          />
        );

      case "switch":
        return (
          <Switch
            {...commonProps}
            styles={{
              ...getInputStyles(),
              label: {
                color: theme.colors.textPrimary,
              },
            }}
          />
        );

      case "date":
        return <DatePickerInput {...commonProps} valueFormat="YYYY-MM-DD" />;

      case "time":
      case "time":
        // TimeInput is not available in @mantine/core, consider using TextInput or another time picker component
        return <TextInput {...commonProps} type="time" />;
      case "file":
        return (
          <FileInput
            {...commonProps}
            accept={field.accept}
            multiple={field.multiple}
          />
        );

      default:
        return <TextInput {...commonProps} />;
    }
  };

  return (
    <Paper
      p="xl"
      style={{
        backgroundColor: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
      }}
    >
      {title && (
        <>
          <Title order={2} mb="xs" style={{ color: theme.colors.textPrimary }}>
            {title}
          </Title>
          {description && (
            <div
              style={{
                color: theme.colors.textSecondary,
                marginBottom: "24px",
              }}
            >
              {description}
            </div>
          )}
          <Divider mb="xl" />
        </>
      )}

      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack gap="xl">
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              {section.title && (
                <>
                  <Title
                    order={4}
                    mb="xs"
                    style={{ color: theme.colors.textPrimary }}
                  >
                    {section.title}
                  </Title>
                  {section.description && (
                    <div
                      style={{
                        color: theme.colors.textSecondary,
                        marginBottom: "16px",
                        fontSize: "14px",
                      }}
                    >
                      {section.description}
                    </div>
                  )}
                </>
              )}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${section.columns || 1}, 1fr)`,
                  gap: "16px",
                }}
              >
                {section.fields.map((field) => (
                  <div
                    key={field.name}
                    style={{
                      gridColumn: field.span ? `span ${field.span}` : undefined,
                      width: field.width,
                    }}
                  >
                    {renderField(field)}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <Divider />

          <Group justify="flex-end" gap="md">
            {showReset && (
              <Button
                variant="subtle"
                onClick={() => form.reset()}
                disabled={loading}
                style={{
                  color: theme.colors.textSecondary,
                }}
              >
                {resetLabel}
              </Button>
            )}
            <Button
              type="submit"
              loading={loading}
              style={{
                backgroundColor: theme.colors.primary,
                "&:hover": {
                  backgroundColor: theme.colors.primaryHover,
                },
              }}
            >
              {submitLabel}
            </Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
};

export default GlobalForm;
