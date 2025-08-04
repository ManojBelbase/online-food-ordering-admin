import type { FilterConfig } from '../../../components/GlobalComponents/Table/TableFilter';

export const foodItemsFilter: FilterConfig[] = [
  {
    key: 'isVeg',
    label: 'Food Type',
    type: 'select',
    options: [
      { label: 'All', value: '' },
      { label: 'Vegetarian', value: 'Yes' },
      { label: 'Non-Vegetarian', value: 'No' }
    ]
  }
]