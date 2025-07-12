import React, { useState, useCallback } from 'react';
import {
  Group,
  Text,
  Stack,
  Image,
  ActionIcon,
  Paper,
  Box,
  Progress,
  Alert,
  SimpleGrid,
} from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import type { FileWithPath } from '@mantine/dropzone';
import {
  IconUpload,
  IconPhoto,
  IconX,
  IconTrash,
  IconEye,
  IconDownload,
} from '@tabler/icons-react';
import { useTheme } from '../../contexts/ThemeContext';

interface ImageFile {
  file: File;
  url: string;
  id: string;
  name: string;
  size: number;
  uploading?: boolean;
  progress?: number;
  error?: string;
}

interface FormImageUploadProps {
  label: string;
  description?: string;
  value?: ImageFile[];
  onChange?: (files: ImageFile[]) => void;
  onBlur?: () => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number; // in bytes
  accept?: string[];
  withAsterisk?: boolean;
  className?: string;
  previewSize?: number;
  showProgress?: boolean;
  allowDownload?: boolean;
  allowPreview?: boolean;
}

export const FormImageUpload = React.forwardRef<HTMLDivElement, FormImageUploadProps>(
  (
    {
      label,
      description,
      value = [],
      onChange,
      onBlur,
      error,
      required = false,
      disabled = false,
      multiple = false,
      maxFiles = multiple ? 10 : 1,
      maxSize = 5 * 1024 * 1024, // 5MB
      accept = IMAGE_MIME_TYPE,
      withAsterisk,
      className,
      previewSize = 120,
      showProgress = true,
      allowDownload = true,
      allowPreview = true,
      ...other
    },
    ref
  ) => {
    const { theme } = useTheme();
    const [dragActive, setDragActive] = useState(false);

    const generateId = () => Math.random().toString(36).substr(2, 9);

    const handleDrop = useCallback(
      (files: FileWithPath[]) => {
        if (disabled) return;

        const newImages: ImageFile[] = files.map((file) => ({
          file,
          url: URL.createObjectURL(file),
          id: generateId(),
          name: file.name,
          size: file.size,
          uploading: false,
          progress: 0,
        }));

        const updatedFiles = multiple 
          ? [...value, ...newImages].slice(0, maxFiles)
          : newImages.slice(0, 1);

        onChange?.(updatedFiles);
        setDragActive(false);
      },
      [value, onChange, multiple, maxFiles, disabled]
    );

    const handleRemove = useCallback(
      (id: string) => {
        const fileToRemove = value.find(f => f.id === id);
        if (fileToRemove) {
          URL.revokeObjectURL(fileToRemove.url);
        }
        const updatedFiles = value.filter(f => f.id !== id);
        onChange?.(updatedFiles);
      },
      [value, onChange]
    );

    const handlePreview = useCallback((imageFile: ImageFile) => {
      // Open image in new tab for preview
      window.open(imageFile.url, '_blank');
    }, []);

    const handleDownload = useCallback((imageFile: ImageFile) => {
      const link = document.createElement('a');
      link.href = imageFile.url;
      link.download = imageFile.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, []);

    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const canAddMore = value.length < maxFiles;

    return (
      <div ref={ref} className={className} {...other}>
        {/* Label */}
        <Text
          size="sm"
          fw={500}
          mb="xs"
          style={{ color: theme.colors.textPrimary }}
        >
          {label}
          {(withAsterisk ?? required) && (
            <span style={{ color: theme.colors.error }}> *</span>
          )}
        </Text>

        {/* Description */}
        {description && (
          <Text
            size="xs"
            mb="sm"
            style={{ color: theme.colors.textSecondary }}
          >
            {description}
          </Text>
        )}

        {/* Upload Area */}
        {canAddMore && (
          <Dropzone
            onDrop={handleDrop}
            onReject={(files) => console.log('rejected files', files)}
            maxSize={maxSize}
            accept={accept}
            multiple={multiple}
            disabled={disabled}
            onDragEnter={() => setDragActive(true)}
            onDragLeave={() => setDragActive(false)}
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
              },
            }}
          >
            <Group justify="center" gap="xl" mih={120} style={{ pointerEvents: 'none' }}>
              <Dropzone.Accept>
                <IconUpload
                  size={52}
                  stroke={1.5}
                  color={theme.colors.primary}
                />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <IconX
                  size={52}
                  stroke={1.5}
                  color={theme.colors.error}
                />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <IconPhoto
                  size={52}
                  stroke={1.5}
                  color={theme.colors.textSecondary}
                />
              </Dropzone.Idle>

              <div>
                <Text size="xl" inline style={{ color: theme.colors.textPrimary }}>
                  Drag images here or click to select files
                </Text>
                <Text size="sm" c="dimmed" inline mt={7} style={{ color: theme.colors.textSecondary }}>
                  {multiple 
                    ? `Attach up to ${maxFiles} files, each file should not exceed ${formatFileSize(maxSize)}`
                    : `Attach 1 file, should not exceed ${formatFileSize(maxSize)}`
                  }
                </Text>
              </div>
            </Group>
          </Dropzone>
        )}

        {/* Image Previews */}
        {value.length > 0 && (
          <Box mt="md">
            <SimpleGrid cols={multiple ? 3 : 1} spacing="md">
              {value.map((imageFile) => (
                <Paper
                  key={imageFile.id}
                  p="sm"
                  radius="md"
                  style={{
                    backgroundColor: theme.colors.surface,
                    border: `1px solid ${theme.colors.border}`,
                    position: 'relative',
                  }}
                >
                  <Stack gap="xs">
                    {/* Image Preview */}
                    <Box style={{ position: 'relative' }}>
                      <Image
                        src={imageFile.url}
                        alt={imageFile.name}
                        height={previewSize}
                        fit="cover"
                        radius="sm"
                        fallbackSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik00MCA0MEg4MFY4MEg0MFY0MFoiIGZpbGw9IiNEREREREQiLz4KPC9zdmc+"
                      />
                      
                      {/* Action Buttons */}
                      <Group
                        gap="xs"
                        style={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                        }}
                      >
                        {allowPreview && (
                          <ActionIcon
                            size="sm"
                            variant="filled"
                            color="blue"
                            onClick={() => handlePreview(imageFile)}
                            style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
                          >
                            <IconEye size={14} />
                          </ActionIcon>
                        )}
                        {allowDownload && (
                          <ActionIcon
                            size="sm"
                            variant="filled"
                            color="green"
                            onClick={() => handleDownload(imageFile)}
                            style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
                          >
                            <IconDownload size={14} />
                          </ActionIcon>
                        )}
                        <ActionIcon
                          size="sm"
                          variant="filled"
                          color="red"
                          onClick={() => handleRemove(imageFile.id)}
                          style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
                        >
                          <IconTrash size={14} />
                        </ActionIcon>
                      </Group>
                    </Box>

                    {/* File Info */}
                    <Stack gap={4}>
                      <Text
                        size="xs"
                        fw={500}
                        truncate
                        style={{ color: theme.colors.textPrimary }}
                      >
                        {imageFile.name}
                      </Text>
                      <Text
                        size="xs"
                        style={{ color: theme.colors.textSecondary }}
                      >
                        {formatFileSize(imageFile.size)}
                      </Text>
                    </Stack>

                    {/* Upload Progress */}
                    {showProgress && imageFile.uploading && (
                      <Progress
                        value={imageFile.progress || 0}
                        size="xs"
                        color={theme.colors.primary}
                        animated
                      />
                    )}

                    {/* Error Message */}
                    {imageFile.error && (
                      <Alert
                        color="red"
                        variant="light"
                        styles={{
                          root: { padding: '4px 8px' },
                          message: { fontSize: '11px' },
                        }}
                      >
                        {imageFile.error}
                      </Alert>
                    )}
                  </Stack>
                </Paper>
              ))}
            </SimpleGrid>
          </Box>
        )}

        {/* Error Message */}
        {error && (
          <Text
            size="sm"
            mt="xs"
            style={{ color: theme.colors.error }}
          >
            {error}
          </Text>
        )}

        {/* File Count Info */}
        {multiple && (
          <Text
            size="xs"
            mt="xs"
            style={{ color: theme.colors.textSecondary }}
          >
            {value.length} of {maxFiles} files selected
          </Text>
        )}
      </div>
    );
  }
);

FormImageUpload.displayName = 'FormImageUpload';
