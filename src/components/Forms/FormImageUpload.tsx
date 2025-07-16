import React, { useState, useCallback } from 'react';
import {
  Group,
  Text,
  Stack,
  Image,
  ActionIcon,
  Paper,
} from '@mantine/core';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import {
  IconUpload,
  IconPhoto,
  IconX,
  IconTrash,
  IconEye,
} from '@tabler/icons-react';
import { useTheme } from '../../contexts/ThemeContext';

interface FormImageUploadProps {
  label: string;
  description?: string;
  value?: string; // single image URL string
  onChange?: (url: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  maxSize?: number; // in bytes
  withAsterisk?: boolean;
  className?: string;
  previewSize?: number;
}

const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export const FormImageUpload = React.forwardRef<HTMLDivElement, FormImageUploadProps>(
  (
    {
      label,
      description,
      value = '',
      onChange,
      error,
      required = false,
      disabled = false,
      maxSize = 5 * 1024 * 1024, // 5MB default
      withAsterisk,
      className,
      previewSize = 120,
      ...others
    },
    ref
  ) => {
    const { theme } = useTheme();
    const [dragActive, setDragActive] = useState(false);

    const handleDrop = useCallback(
      async (files: File[]) => {
        if (disabled) return;
        const file = files[0];
        if (file.size > maxSize) {
          // optionally show error or ignore
          return;
        }
        const base64 = await toBase64(file);
        onChange?.(base64);
        setDragActive(false);
      },
      [disabled, maxSize, onChange]
    );

    const handleRemove = useCallback(() => {
      onChange?.('');
    }, [onChange]);

    const handlePreview = useCallback(() => {
      if (value) {
        window.open(value, '_blank');
      }
    }, [value]);

    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
      <div ref={ref} className={className} {...others}>
        {/* Label */}
        <Text
          size="sm"
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
          <Text size="xs" mb="sm" style={{ color: theme.colors.textSecondary }}>
            {description}
          </Text>
        )}

        {/* Dropzone when no image */}
        {!value && (
          <Dropzone
            onDrop={handleDrop}
            onReject={(files) => console.log('Rejected files:', files)}
            maxSize={maxSize}
            maxFiles={1}accept={[MIME_TYPES.jpeg, MIME_TYPES.png, MIME_TYPES.heif]}
            multiple={false}
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
                cursor: disabled ? 'not-allowed' : 'pointer',
                maxWidth: 400,
                minWidth: 320,
                minHeight: 120,
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
                <IconPhoto size={52} stroke={1.5} color={theme.colors.textSecondary} />
              </Dropzone.Idle>

              <div>
                <Text size="xl" style={{ color: theme.colors.textPrimary }}>
                  Drag image here or click to select file
                </Text>
                <Text
                  size="sm"
                  color="dimmed"
                  mt={7}
                  style={{ color: theme.colors.textSecondary }}
                >
                  Attach 1 file, max size {formatFileSize(maxSize)}
                </Text>
              </div>
            </Group>
          </Dropzone>
        )}

        {/* Preview */}
        {value && (
          <Paper
            p="sm"
            radius="md"
            style={{
              backgroundColor: theme.colors.surface,
              border: `1px solid ${theme.colors.border}`,
              position: 'relative',
              width: previewSize,
              height: previewSize,
            }}
          >
            <Stack gap={4} align="center" justify="center" style={{ height: '100%' }}>
              <Image
                src={value}
                alt="Uploaded image"
                height={previewSize}
                width={previewSize}
                fit="cover"
                radius="sm"
                
              />

              <Group gap={8} mt="xs">
                <ActionIcon
                  color="blue"
                  variant="filled"
                  onClick={handlePreview}
                  size="sm"
                  title="Preview"
                >
                  <IconEye size={14} />
                </ActionIcon>
                <ActionIcon
                  color="red"
                  variant="filled"
                  onClick={handleRemove}
                  size="sm"
                  title="Remove"
                >
                  <IconTrash size={14} />
                </ActionIcon>
              </Group>
            </Stack>
          </Paper>
        )}

        {/* Error */}
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
