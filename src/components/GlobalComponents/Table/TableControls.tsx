import React from "react";
import { TextInput, Group, Flex, ActionIcon } from "@mantine/core";
import { IconSearch, IconRefresh } from "@tabler/icons-react";
import { useMediaQuery } from "@mantine/hooks";
import { useTheme } from "../../../contexts/ThemeContext";
import FilterButton from "../FilterButton";
import { CustomText } from "../../ui";
import { GlobalPrint } from "../index";

interface TableControlsProps {
  title?: string;
  searchPlaceholder?: string;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onRefresh?: () => void;
  loading?: boolean;
  filters?: any[];
  filterValues?: Record<string, any>;
  onToggleFilters?: () => void;
  showRefreshButton?: boolean;
  showSearchInput?: boolean;
  showPrintButton?: boolean;
  printTitle?: string;
  printContent?: string | React.ReactElement;
}

const TableControls: React.FC<TableControlsProps> = ({
  title,
  searchPlaceholder = "Search...",
  searchQuery = "",
  onSearchChange,
  onRefresh,
  loading = false,
  filters = [],
  filterValues = {},
  onToggleFilters,
  showRefreshButton = true,
  showSearchInput = true,
  showPrintButton = false,
  printTitle = "Table Report",
  printContent = "",
}) => {
  const { theme } = useTheme();

  // Responsive breakpoints
  const isMobile = useMediaQuery('(max-width: 480px)');
  const isTablet = useMediaQuery('(max-width: 768px)');

  return (
    <div
      style={{
        padding: isMobile ? "8px" : isTablet ? "10px" : "14px",
        borderBottom: `1px solid ${theme.colors.border}`,
      }}
    >
      {/* Title */}
      {title && (
        <Flex justify="space-between" align="center" mb={isMobile ? "8px" : "md"}>
          <CustomText
            size={isMobile ? "md" : "lg"}
            fontWeight={600}
            color="primary"
            responsive
          >
            {title}
          </CustomText>
        </Flex>
      )}

      {/* Search and Action Buttons Row */}
      <Flex
        justify="space-between"
        align="center"
        gap={isMobile ? "xs" : "md"}
        direction={isMobile ? "column" : "row"}
      >
        {/* Search Input */}
        {showSearchInput && onSearchChange && (
          <TextInput
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            leftSection={<IconSearch size={16} />}
            style={{
              flex: 1,
              maxWidth: isMobile ? '100%' : '300px',
              marginBottom: isMobile ? '8px' : '0'
            }}
            styles={{
              input: {
                backgroundColor: theme.colors.inputBackground,
                borderColor: theme.colors.inputBorder,
                color: theme.colors.inputText,
              },
            }}
          />
        )}

        {/* Action Buttons */}
        <Group gap="xs">
          {/* Print Button */}
          {showPrintButton && (
            <GlobalPrint
              title={printTitle}
              content={printContent}
              variant="icon"
              size="md"
              
            />
          )}

          {/* Filter Button */}
          {filters.length > 0 && onToggleFilters && (
            <FilterButton
              onClick={onToggleFilters}
              activeFilterCount={Object.keys(filterValues ?? {}).length}
              
            />
          )}

          {/* Refresh Button */}
          {showRefreshButton && onRefresh && (
            <ActionIcon
              variant="light"
              onClick={onRefresh}
              loading={loading}
              style={{
                color: theme.colors.primary,
                backgroundColor: `${theme.colors.primary}15`,
              }}
            >
              <IconRefresh size={16} />
            </ActionIcon>
          )}
        </Group>
      </Flex>
    </div>
  );
};

export default TableControls;
