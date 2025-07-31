import React, { useState, useEffect } from "react";
import {
  Box,
  Group,
  Collapse,
  Select,
  TextInput,
} from "@mantine/core";
import { IconFilterOff } from "@tabler/icons-react";
import { useTheme } from "../../../contexts/ThemeContext";
import { ActionButton } from "../../ui";

// Filter option interface
export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: "select" | "text" | "date";
  options?: FilterOption[]; 
  placeholder?: string;
}

// TableFilter props
interface TableFilterProps {
  filters: FilterConfig[];
  visible: boolean;
  onFiltersChange: (filters: Record<string, any>) => void;
  appliedFilters: Record<string, any>;
}

const TableFilter: React.FC<TableFilterProps> = ({
  filters,
  visible,
  onFiltersChange,
  appliedFilters,
}) => {
  const { theme } = useTheme();
  const [tempFilterValues, setTempFilterValues] = useState<Record<string, any>>({});

  useEffect(() => {
    setTempFilterValues(appliedFilters);
  }, [appliedFilters]);

  const handleTempFilterChange = (key: string, value: any) => {
    setTempFilterValues(prev => {
      const newValues = { ...prev };
      if (value === null || value === "" || value === undefined) {
        // Remove the key entirely when clearing
        delete newValues[key];
      } else {
        newValues[key] = value;
      }
      return newValues;
    });
  };

  const applyFilters = () => {
    onFiltersChange(tempFilterValues);
  };

  const clearFilters = () => {
    const emptyFilters = {};
    setTempFilterValues(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const hasPendingChanges = () => {
    return JSON.stringify(appliedFilters) !== JSON.stringify(tempFilterValues);
  };



  return (
    <Collapse in={visible}>
      <Box
        style={{
          backgroundColor: theme.colors.backgroundSecondary,
          boxShadow: theme.shadows.sm,
          borderBottom: `1px solid ${theme.colors.border}`,
          paddingBottom: "8px",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        
        }}
      >

        {/* Filter Inputs */}
        <Group gap="md" grow px="14px" py="14px">
          
          {filters.map((filter) => (
            <Box key={filter.key} style={{ flex: 1, minWidth: 200, maxWidth: 300 }}>
              {filter.type === "select" ? (
                <Select
                  label={filter.label}
                  placeholder={filter.placeholder || `Select ${filter.label}`}
                  data={filter.options || []}
                  value={tempFilterValues[filter.key] ?? null}
                  onChange={(value) => handleTempFilterChange(filter.key, value)}
                  clearable
                  size="sm"
                  styles={{
                    input: {
                      backgroundColor: theme.colors.inputBackground,
                      borderColor: theme.colors.inputBorder,
                      color: theme.colors.inputText,
                    },
                    label: {
                      color: theme.colors.textPrimary,
                      fontWeight: 500,
                      marginBottom: 4,
                    },
                  }}
                />
              ) : (
                <TextInput
                  label={filter.label}
                  placeholder={filter.placeholder || `Enter ${filter.label}`}
                  value={tempFilterValues[filter.key] ?? ""}
                  onChange={(e) => handleTempFilterChange(filter.key, e.target.value)}
                  size="sm"
                  styles={{
                    input: {
                      backgroundColor: theme.colors.inputBackground,
                      borderColor: theme.colors.inputBorder,
                      color: theme.colors.inputText,
                    },
                    label: {
                      color: theme.colors.textPrimary,
                      fontWeight: 500,
                      marginBottom: 4,
                    },
                  }}
                />
              )}
            </Box>
          ))}
        </Group>

        <Group p="sm">
          <ActionButton
            variant="outline"
            size="sm"
            onClick={clearFilters}
          >
            <IconFilterOff size={16} style={{ marginRight: '8px' }} />
            Clear
          </ActionButton>
          <ActionButton
            variant="primary"
            size="sm"
            onClick={applyFilters}
            disabled={!hasPendingChanges()}
          >
            Apply {hasPendingChanges() && "•"}
          </ActionButton>
        </Group>
      </Box>
    </Collapse>
  );
};

export default TableFilter;
