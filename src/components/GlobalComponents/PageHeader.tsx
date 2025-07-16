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
import { IconArrowLeft, IconChevronRight, IconPlus } from "@tabler/icons-react";
import { useTheme } from "../../contexts/ThemeContext";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Array<{ label: string; href?: string; active?: boolean }>;
  showBackButton?: boolean;
  onBack?: () => void;
  onClick?: () => void;
  actionVariant?: "filled" | "outline" | "light" | "subtle";
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  showBackButton = false,
  onBack,
  onClick,
  actionVariant = "filled",
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
              {title} List
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

        {/* Action Button */}
        {onClick && (
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={onClick}
            variant={actionVariant}
            style={{
              backgroundColor:
                actionVariant === "filled" ? theme.colors.primary : undefined,
              borderColor:
                actionVariant === "outline" ? theme.colors.primary : undefined,
              color:
                actionVariant === "outline" ? theme.colors.primary : undefined,
            }}
          >
            Add {title}
          </Button>
        )}
      </Flex>
    </Box>
  );
};

export default PageHeader;
