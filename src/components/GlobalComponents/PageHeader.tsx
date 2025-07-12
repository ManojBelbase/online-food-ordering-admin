import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Group,
  Title,
  Text,
  Breadcrumbs,
  Anchor,
  ActionIcon,
  Flex,
  Box,
  Button,
} from "@mantine/core";
import { IconArrowLeft, IconChevronRight } from "@tabler/icons-react";
import { useTheme } from "../../contexts/ThemeContext";
import type { PageHeaderProps } from "../../types/ui";

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  actions,
  showBackButton = false,
  onBack,
}) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const generateBreadcrumbs = () => {
    if (breadcrumbs) return breadcrumbs;

    const pathSegments = location.pathname.split("/").filter(Boolean);
    const generatedBreadcrumbs: any[] = [{ label: "Dashboard", href: "/" }];

    let currentPath = "";
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;

      const label = segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      if (isLast) {
        generatedBreadcrumbs.push({ label, active: true });
      } else {
        generatedBreadcrumbs.push({ label, href: currentPath });
      }
    });

    return generatedBreadcrumbs;
  };

  const finalBreadcrumbs = generateBreadcrumbs();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <Box
      style={{
        backgroundColor: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
        padding: "14px",
        marginBottom: "14px",
        borderRadius: "4px",
      }}
    >
      {/* Breadcrumbs */}
      {finalBreadcrumbs && finalBreadcrumbs.length > 0 && (
        <Breadcrumbs
          separator={
            <IconChevronRight
              size={14}
              style={{ color: theme.colors.textTertiary }}
            />
          }
          mb="md"
          styles={{
            breadcrumb: {
              color: theme.colors.textSecondary,
              fontSize: "14px",
            },
          }}
        >
          {finalBreadcrumbs.map((item, index) => (
            <Anchor
              key={index}
              href={item.href}
              style={{
                color: item.active
                  ? theme.colors.primary
                  : theme.colors.textSecondary,
                textDecoration: "none",
                fontWeight: item.active ? 600 : 400,
              }}
              onClick={(e) => {
                if (item.href && !item.active) {
                  e.preventDefault();
                  navigate(item.href);
                }
              }}
            >
              {item.label}
            </Anchor>
          ))}
        </Breadcrumbs>
      )}

      {/* Header Content */}
      <Flex justify="space-between" align="flex-start" gap="md">
        <Group gap="md" align="flex-start">
          {showBackButton && (
            <ActionIcon
              variant="subtle"
              size="lg"
              onClick={handleBack}
              style={{
                color: theme.colors.textSecondary,
                marginTop: "4px",
              }}
            >
              <IconArrowLeft size={20} />
            </ActionIcon>
          )}

          <div>
            <Title
              order={1}
              style={{
                color: theme.colors.textPrimary,
                fontSize: "24px",
                fontWeight: 600,
                lineHeight: 1.2,
                marginBottom: subtitle ? "4px" : 0,
              }}
            >
              {title}
            </Title>

            {subtitle && (
              <Text
                size="md"
              
                style={{
                  color: theme.colors.textSecondary,
                  lineHeight: 1.4,
                  fontSize: "16px",
                }}
              >
                {subtitle}
              </Text>
            )}
          </div>
        </Group>

        {/* Actions */}
        {actions && (
          <Group gap="sm">
            {Array.isArray(actions)
              ? actions.map((action, index) => (
                  <Button
                    key={index}
                    leftSection={action.icon}
                    onClick={action.onClick}
                    variant={action.variant || "filled"}
                    style={{
                      backgroundColor:
                        action.variant === "filled"
                          ? action.color || theme.colors.primary
                          : undefined,
                      borderColor:
                        action.variant === "outline"
                          ? action.color || theme.colors.primary
                          : undefined,
                      color:
                        action.variant === "outline"
                          ? action.color || theme.colors.primary
                          : undefined,
                    }}
                  >
                    {action.label}
                  </Button>
                ))
              : actions}
          </Group>
        )}
      </Flex>
    </Box>
  );
};

export default PageHeader;
