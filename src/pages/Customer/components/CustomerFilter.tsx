import type { FilterConfig } from '../../../components/GlobalComponents/Table/TableFilter';
import { Roles } from '../../../constants/roles';

export const customerFilters: FilterConfig[] = [
  {
    key: 'roleValue', // Changed from 'role' to 'roleValue' to match the raw data
    label: 'Role',
    type: 'select',
    options: [
      { label: 'All', value: '' },
      { label: 'User', value: Roles.USER },
      { label: 'Restaurant', value: Roles.RESTAURANT },
      { label: 'Delivery', value: Roles.DELIVERY }
    ]
  }
]