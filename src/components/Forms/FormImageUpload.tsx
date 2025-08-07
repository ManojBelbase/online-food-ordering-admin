import React, { useState } from 'react';
import { Group, Stack, Image, ActionIcon, Paper, LoadingOverlay } from '@mantine/core';
import { Dropzone, MIME_TYPES, type FileWithPath } from '@mantine/dropzone';
import { IconUpload, IconPhoto, IconX, IconTrash, IconEye } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import { useTheme } from '../../contexts/ThemeContext';
import { CustomText } from '../ui';

interface FormImageUploadProps {
  label: string;
  description?: string;
  value?: string | string[];
  onChange?: (value: string | string[]) => void; 
  uploadApi?: (file: File) => Promise<string | { url?: string; imageUrl?: string }>;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  maxSize?: number;
  withAsterisk?: boolean;
  className?: string;
  previewSize?: number;
  multiple?: boolean; 
  onBlur?: () => void;
  responsive?: boolean;
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
      multiple = false,
      onBlur,
      responsive = false,
      ...others
    },
    ref
  ) => {
    const { theme } = useTheme();

    // Responsive breakpoints
    const isMobile = useMediaQuery('(max-width: 480px)');
    const isTablet = useMediaQuery('(max-width: 768px)');
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
        <CustomText
          size={responsive ? (isMobile ? "xs" : "sm") : "sm"}
          color="primary"
          margin="0 0 4px 0"
          responsive={responsive}
        >
          {label}
          {(withAsterisk ?? required) && (
            <span style={{ color: theme.colors.error }}> *</span>
          )}
        </CustomText>

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
                  width: responsive ? (isMobile ? 200 : isTablet ? 240 : 300) : 300,
                  height: responsive ? (isMobile ? 80 : isTablet ? 100 : 120) : 120,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              }}
            >
              <Group justify="center" gap="xl" style={{ pointerEvents: 'none' }}>
                <Dropzone.Accept>
                  <IconUpload
                    size={responsive ? (isMobile ? 32 : isTablet ? 40 : 52) : 52}
                    stroke={1.5}
                    color={theme.colors.primary}
                  />
                </Dropzone.Accept>
                <Dropzone.Reject>
                  <IconX
                    size={responsive ? (isMobile ? 32 : isTablet ? 40 : 52) : 52}
                    stroke={1.5}
                    color={theme.colors.error}
                  />
                </Dropzone.Reject>
                <Dropzone.Idle>
                  <IconPhoto
                    size={responsive ? (isMobile ? 24 : isTablet ? 28 : 36) : 36}
                    stroke={1}
                    color={theme.colors.textSecondary}
                  />
                </Dropzone.Idle>

                <div>
                  <CustomText
                    size={responsive ? (isMobile ? "xs" : "xs") : "xs"}
                    color="primary"
                    responsive={responsive}
                  >
                    {uploading ? 'Uploading...' : (isMobile ? 'Tap to select' : 'Drag image here or click to select')}
                  </CustomText>
                  <CustomText
                    size={responsive ? (isMobile ? "xs" : "sm") : "sm"}
                    color="secondary"
                    margin="4px 0 0 0"
                    responsive={responsive}
                  >
                    {uploading
                      ? 'Please wait while your image is being uploaded'
                      : 'JPG, PNG, HEIF up to 5MB'}
                  </CustomText>
                </div>
              </Group>
            </Dropzone>
            <LoadingOverlay visible={uploading} />
            {description && (
              <CustomText
                size={responsive ? (isMobile ? "xs" : "xs") : "xs"}
                color="secondary"
                margin={responsive ? (isMobile ? "0 0 12px 0" : "0 0 16px 0") : "0 0 16px 0"}
                responsive={responsive}
              >
                {description}
              </CustomText>
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
                width: responsive ? (isMobile ? 200 : isTablet ? 240 : 300) : 300,
                height: responsive ? (isMobile ? 80 : isTablet ? 100 : 120) : 120,
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
                        height={responsive ? (isMobile ? 80 : isTablet ? 100 : 120) : 120}
                        width={responsive ? (isMobile ? 50 : isTablet ? 60 : 70) : 70}
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
                    <CustomText size="sm" color="primary" margin="0 0 0 10px">
                      +{imageUrls.length - 2} more
                    </CustomText>
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
          <CustomText size="sm" color="error" margin="8px 0 0 0">
            {error}
          </CustomText>
        )}
      </div>
    );
  }
);

FormImageUpload.displayName = 'FormImageUpload';