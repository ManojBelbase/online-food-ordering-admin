import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Group,
  Title,
  Breadcrumbs,
  Anchor,
  ActionIcon,
  Flex,
  Box,
} from "@mantine/core";
import { IconArrowLeft, IconChevronRight, IconPlus } from "@tabler/icons-react";
import { useTheme } from "../../contexts/ThemeContext";
import { CustomText, ActionButton } from "../ui";
import { useMediaQuery } from "@mantine/hooks";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Array<{ label: string; href?: string; active?: boolean }>;
  showBackButton?: boolean;
  onBack?: () => void;
  onClick?: () => void;
  actionVariant?: "filled" | "outline" | "light" | "subtle";
  showListSuffix?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  showBackButton = false,
  onBack,
  onClick,
  actionVariant = "filled",
  showListSuffix = true,
}) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const isMobile = useMediaQuery('(max-width: 480px)');
  const isTablet = useMediaQuery('(max-width: 768px)');

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
        paddingInline: "14px",
        paddingBlock: "8px",
        marginBottom: "6px",
        marginTop: "-4px",
        borderRadius: "4px",
      }}
    >
      {finalBreadcrumbs && finalBreadcrumbs.length > 0 && (
        <Breadcrumbs
          separator={
            <IconChevronRight
              size={14}
              style={{ color: theme.colors.textTertiary }}
            />
          }
          mb={isMobile ? "8px" : "12px"}
          styles={{
            breadcrumb: {
              color: theme.colors.textSecondary,
              fontSize: isMobile ? "12px" : isTablet ? "14px" : "16px",
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
      <Flex justify="space-between" align="flex-start" gap="sm">
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
                fontSize: isMobile ? "16px" : isTablet ? "18px" : "24px",
                fontWeight: 500,
                lineHeight: 1.2,
                marginBottom: subtitle ? "4px" : 0,
              }}
            >
              {title}{showListSuffix ? ' List' : ''}
            </Title>

            {subtitle && (
              <CustomText
                size="md"
                color="secondary"
                lineHeight={1.4}
                fontSize="16px"
              >
                {subtitle}
              </CustomText>
            )}
          </div>
        </Group>

        {/* Action Button */}
        {onClick && (
          <ActionButton
            onClick={onClick}
            variant={actionVariant === "filled" ? "primary" : actionVariant === "outline" ? "outline" : "ghost"}
          >
            <IconPlus size={16} style={{ marginRight: '8px' }} />
            Add {title}
          </ActionButton>
        )}
      </Flex>
    </Box>
  );
};

export default PageHeader;
