import React, { useState } from 'react';
import { Group, Text, Stack, Image, ActionIcon, Paper, LoadingOverlay } from '@mantine/core';
import { Dropzone, MIME_TYPES, type FileWithPath } from '@mantine/dropzone';
import { IconUpload, IconPhoto, IconX, IconTrash, IconEye } from '@tabler/icons-react';
import { useTheme } from '../../contexts/ThemeContext';

interface FormImageUploadProps {
  label: string;
  description?: string;
  value?: string | string[]; 
  onChange?: (value: string | string[]) => void; // Update onChange to handle array or string
  uploadApi?: (file: File) => Promise<string | { url?: string; imageUrl?: string }>;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  maxSize?: number;
  withAsterisk?: boolean;
  className?: string;
  previewSize?: number;
  multiple?: boolean; // New prop to enable multiple uploads
  onBlur?: () => void;
}

export const FormImageUpload = React.forwardRef<HTMLDivElement, FormImageUploadProps>(
  (
    {
      label,
      description,
      value = '',
      onChange,
      uploadApi,
      error,
      required = false,
      disabled = false,
      maxSize = 5 * 1024 * 1024,
      withAsterisk,
      className,
      previewSize = 120,
      multiple = false, // Default to false
      onBlur,
      ...others
    },
    ref
  ) => {
    const { theme } = useTheme();
    const [dragActive, setDragActive] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [imageUrls, setImageUrls] = useState<string[]>(Array.isArray(value) ? value : value ? [value] : []); // Manage multiple URLs

    const handleFileDrop = async (files: FileWithPath[]) => {
      if (!uploadApi || !onChange || files.length === 0) return;

      setUploading(true);
      const newImageUrls: string[] = [];

      try {
        for (const file of files) {
          const response = await uploadApi(file);
          const imageUrl =
            typeof response === 'string'
              ? response
              : response.url || response.imageUrl || '';
          newImageUrls.push(imageUrl);
        }

        const updatedUrls = multiple
          ? [...imageUrls, ...newImageUrls] // Append for multiple
          : newImageUrls[0] || ''; // Use single URL for non-multiple

        setImageUrls(Array.isArray(updatedUrls) ? updatedUrls : [updatedUrls]);
        onChange(multiple ? updatedUrls : updatedUrls); // Send array for multiple, string for single
      } catch (error) {
      } finally {
        setUploading(false);
      }
    };

    const handleRemove = (index: number) => {
      if (onChange) {
        const updatedUrls = imageUrls.filter((_, i) => i !== index);
        setImageUrls(updatedUrls);
        onChange(multiple ? updatedUrls : updatedUrls[0] || ''); // Send string if not multiple
      }
    };

    const handlePreview = (url: string) => {
      if (url) {
        window.open(url, '_blank');
      }
    };

    const openFileDialog = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.jpg,.jpeg,.png,.heif';
      input.multiple = multiple;
      input.onchange = (e) => {
        const files = (e.target as HTMLInputElement).files;
        if (files) {
          handleFileDrop(Array.from(files));
        }
      };
      input.click();
    };

    return (
      <div ref={ref} className={className} {...others}>
        <Text size="sm" style={{ color: theme.colors.textPrimary, marginBottom: "4px" }}>
          {label}
          {(withAsterisk ?? required) && (
            <span style={{ color: theme.colors.error }}> *</span>
          )}
        </Text>

        {!imageUrls.length && (
          <div style={{ position: 'relative' }}>
            <Dropzone
              onDrop={handleFileDrop}
              onReject={(files) => console.log('Rejected files:', files)}
              maxSize={maxSize}
              maxFiles={multiple ? undefined : 1} // Unlimited for multiple, 1 for single
              accept={[MIME_TYPES.jpeg, MIME_TYPES.png, MIME_TYPES.heif]}
              multiple={multiple} // Enable multiple based on prop
              disabled={disabled || uploading}
              onDragEnter={() => setDragActive(true)}
              onDragLeave={() => setDragActive(false)}
              onBlur={onBlur}
              onClick={openFileDialog} // Open file dialog on click
              styles={{
                root: {
                  borderColor: error
                    ? theme.colors.error
                    : dragActive
                    ? theme.colors.primary
                    : theme.colors.border,
                  backgroundColor: dragActive
                    ? `${theme.colors.primary}05`
                    : theme.colors.surface,
                  '&:hover': {
                    borderColor: theme.colors.primary,
                    backgroundColor: `${theme.colors.primary}05`,
                  },
                  cursor: disabled || uploading ? 'not-allowed' : 'pointer',
                  width: 300,
                  height: 120,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              }}
            >
              <Group justify="center" gap="xl" style={{ pointerEvents: 'none' }}>
                <Dropzone.Accept>
                  <IconUpload size={52} stroke={1.5} color={theme.colors.primary} />
                </Dropzone.Accept>
                <Dropzone.Reject>
                  <IconX size={52} stroke={1.5} color={theme.colors.error} />
                </Dropzone.Reject>
                <Dropzone.Idle>
                  <IconPhoto
                    size={36}
                    stroke={1}
                    color={theme.colors.textSecondary}
                  />
                </Dropzone.Idle>

                <div>
                  <Text size="xs" style={{ color: theme.colors.textPrimary }}>
                    {uploading ? 'Uploading...' : 'Drag image here or click to select'}
                  </Text>
                  <Text size="sm" mt={4} style={{ color: theme.colors.textSecondary }}>
                    {uploading
                      ? 'Please wait while your image is being uploaded'
                      : 'JPG, PNG, HEIF up to 5MB'}
                  </Text>
                </div>
              </Group>
            </Dropzone>
            <LoadingOverlay visible={uploading} />
            {description && (
              <Text size="xs" mb="sm" style={{ color: theme.colors.textSecondary }}>
                {description}
              </Text>
            )}
          </div>
        )}

        {imageUrls.length > 0 && (
          <Stack gap="sm">
            <Paper
              p=""
              radius="md"
              style={{
                backgroundColor: theme.colors.surface,
                border: `1px solid ${theme.colors.border}`,
                position: 'relative',
                width: 300,
                height: 120,
              }}
            >
              <Stack
                gap={4}
                align="start"
                justify="start"
                style={{ height: '100%', position: "relative" }}
              >
                {imageUrls.length <= 2 ? (
                  <Group style={{ position: "absolute", top: "0" }}>
                    {imageUrls.slice(0, 2).map((url, index) => (
                      <Image
                        key={index}
                        src={url}
                        alt={`Uploaded image ${index + 1}`}
                        height={120}
                        width={70}
                        fit="contain"
                        radius="sm"
                      />
                    ))}
                  </Group>
                ) : (
                  <Group style={{ position: "absolute", top: "0" }}>
                    {imageUrls.slice(0, 2).map((url, index) => (
                      <Image
                        key={index}
                        src={url}
                        alt={`Uploaded image ${index + 1}`}
                        height={120}
                        width={140} // Adjusted to fit two images
                        fit="contain"
                        radius="sm"
                      />
                    ))}
                    <Text size="sm" style={{ color: theme.colors.textPrimary, marginLeft: "10px" }}>
                      +{imageUrls.length - 2} more
                    </Text>
                  </Group>
                )}
                <Group gap={4} mt="xs" style={{ position: "absolute", top: "0", right: "0" }}>
                  {imageUrls.slice(0, 2).map((url, index) => (
                    <React.Fragment key={index}>
                      <ActionIcon
                        color="blue"
                        variant="filled"
                        onClick={() => handlePreview(url)}
                        size="sm"
                        title="Preview"
                      >
                        <IconEye size={14} />
                      </ActionIcon>
                      <ActionIcon
                        color="red"
                        variant="filled"
                        onClick={() => handleRemove(index)}
                        size="sm"
                        title="Remove"
                      >
                        <IconTrash size={14} />
                      </ActionIcon>
                    </React.Fragment>
                  ))}
                </Group>
              </Stack>
            </Paper>
          </Stack>
        )}

        {error && (
          <Text size="sm" mt="xs" style={{ color: theme.colors.error }}>
            {error}
          </Text>
        )}
      </div>
    );
  }
);

FormImageUpload.displayName = 'FormImageUpload';