/**
 * SIMPLIFIED FILTER USAGE - Now you don't need to manage showFilters manually!
 */

import { useState } from 'react';
import DataTable from '../components/GlobalComponents/Table/DataTable';

const SimplifiedFilterExample = () => {
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});

  // Your filters configuration
  const myFilters = [
    {
      key: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { label: 'All', value: '' },
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' }
      ]
    }
  ];

  return (
    <DataTable
      data={[]} // your data
      columns={[]} // your columns
      
      // ✅ SIMPLIFIED FILTER USAGE - No need for showFilters!
      filters={myFilters}
      onFiltersChange={(filters) => setFilterValues(filters)}
      
      // The filter component will automatically:
      // - Show when filters are applied
      // - Hide when no filters are applied
      // - Manage all the logic internally
    />
  );
};

export default SimplifiedFilterExample;

/**
 * WHAT CHANGED:
 * 
 * ❌ OLD WAY (complex):
 * showFilters={Object.keys(filterValues).length > 0}
 * onFiltersChange={handleFiltersChange}
 * 
 * ✅ NEW WAY (simple):
 * onFiltersChange={(filters) => setFilterValues(filters)}
 * 
 * The filter component now handles showFilters automatically!
 */
