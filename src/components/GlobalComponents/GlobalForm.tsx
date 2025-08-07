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
  Group,
  Stack,
  Paper,
  Title,
  Divider,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useMediaQuery } from "@mantine/hooks";
import { useTheme } from "../../contexts/ThemeContext";
import type { FormField, FormBuilderProps } from "../../types/ui";
import { CustomText, ActionButton } from "../ui";

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

  // Responsive breakpoints
  const isMobile = useMediaQuery('(max-width: 480px)');
  const isTablet = useMediaQuery('(max-width: 768px)');

  const getInputStyles = () => ({
    input: {
      backgroundColor: theme.colors.inputBackground,
      borderColor: theme.colors.inputBorder,
      color: theme.colors.inputText,
      fontSize: isMobile ? '12px' : isTablet ? '13px' : '14px',
      padding: isMobile ? '6px 8px' : isTablet ? '8px 10px' : undefined,
      "&::placeholder": {
        color: theme.colors.inputPlaceholder,
      },
      "&:focus": {
        borderColor: theme.colors.primary,
      },
    },
    label: {
      color: theme.colors.textPrimary,
      fontSize: isMobile ? '12px' : isTablet ? '13px' : '14px',
    },
    description: {
      color: theme.colors.textSecondary,
      fontSize: isMobile ? '11px' : isTablet ? '12px' : '13px',
    },
    error: {
      color: theme.colors.error,
      fontSize: isMobile ? '11px' : isTablet ? '12px' : '13px',
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
            <CustomText
              color="secondary"
              margin="0 0 24px 0"
            >
              {description}
            </CustomText>
          )}
          <Divider mb="xl" />
        </>
      )}

      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack gap={isMobile ? "md" : "xl"}>
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              {section.title && (
                <>
                  <Title
                    order={isMobile ? 5 : 4}
                    mb="xs"
                    style={{
                      color: theme.colors.textPrimary,
                      fontSize: isMobile ? '16px' : isTablet ? '18px' : '20px'
                    }}
                  >
                    {section.title}
                  </Title>
                  {section.description && (
                    <CustomText
                      color="secondary"
                      fontSize={isMobile ? "12px" : isTablet ? "13px" : "14px"}
                      margin={isMobile ? "0 0 12px 0" : "0 0 16px 0"}
                      responsive
                    >
                      {section.description}
                    </CustomText>
                  )}
                </>
              )}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile
                    ? "1fr"
                    : `repeat(${section.columns || 1}, 1fr)`,
                  gap: isMobile ? "12px" : "16px",
                }}
              >
                {section.fields.map((field) => (
                  <div
                    key={field.name}
                    style={{
                      gridColumn: isMobile ? undefined : (field.span ? `span ${field.span}` : undefined),
                      width: isMobile ? "100%" : field.width,
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
              <ActionButton
                variant="ghost"
                onClick={() => form.reset()}
                disabled={loading}
              >
                {resetLabel}
              </ActionButton>
            )}
            <ActionButton
              type="submit"
              loading={loading}
              variant="primary"
            >
              {submitLabel}
            </ActionButton>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
};

export default GlobalForm;
