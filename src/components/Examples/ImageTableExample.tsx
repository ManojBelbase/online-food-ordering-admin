import React from 'react';
import { Stack, Group, Card } from '@mantine/core';
import { CustomText } from '../ui';
import { GlobalPrint, ImageViewer } from '../GlobalComponents';
import DataTable from '../GlobalComponents/Table/DataTable';

// Example usage of ImageViewer and GlobalPrint components
const ImageTableExample: React.FC = () => {
  // Sample data with images
  const sampleData = [
    {
      id: 1,
      name: "Margherita Pizza",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=400&fit=crop",
      price: 12.99,
      category: "Pizza"
    },
    {
      id: 2,
      name: "Caesar Salad",
      image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=400&fit=crop",
      price: 8.99,
      category: "Salad"
    },
    {
      id: 3,
      name: "Grilled Salmon",
      image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=400&fit=crop",
      price: 18.99,
      category: "Seafood"
    }
  ];

  const columns = [
    { title: 'Name', key: 'name' },
    { title: 'Image', key: 'image' },
    { title: 'Price', key: 'price' },
    { title: 'Category', key: 'category' }
  ];

  const restaurantInfo = {
    name: "Bella Vista Restaurant",
    logo: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=80&h=80&fit=crop",
    address: "123 Culinary Street, Food District, City 12345",
    phone: "+1 (555) 123-FOOD",
    email: "info@bellavista.com",
    website: "www.bellavista.com",
    licenseNumber: "REST-2024-001",
    cuisineType: "Italian"
  };

  return (
    <Stack gap="lg">
      <Card padding="lg">
        <CustomText size="xl" fontWeight={600} style={{ marginBottom: '16px' }}>
          Image Table with Print Example
        </CustomText>
        
        <CustomText size="sm" color="secondary" style={{ marginBottom: '20px' }}>
          Click on any image in the table to view it in full size. Use the print button to generate a restaurant letterhead document.
        </CustomText>

        <Group justify="flex-end" style={{ marginBottom: '16px' }}>
          <GlobalPrint
            restaurantInfo={restaurantInfo}
            title="Menu Items Report"
            content={`
              <h2>Menu Items Report</h2>
              <p>Generated on: ${new Date().toLocaleDateString()}</p>
              <br>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background-color: #f5f5f5;">
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Item Name</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Price</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Category</th>
                  </tr>
                </thead>
                <tbody>
                  ${sampleData.map(item => `
                    <tr>
                      <td style="border: 1px solid #ddd; padding: 8px;">${item.name}</td>
                      <td style="border: 1px solid #ddd; padding: 8px;">$${item.price}</td>
                      <td style="border: 1px solid #ddd; padding: 8px;">${item.category}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              <br>
              <p><strong>Total Items:</strong> ${sampleData.length}</p>
              <p><strong>Average Price:</strong> $${(sampleData.reduce((sum, item) => sum + item.price, 0) / sampleData.length).toFixed(2)}</p>
            `}
            variant="button"
            size="md"
          >
            Print Menu Report
          </GlobalPrint>
        </Group>

        <DataTable
          data={sampleData}
          columns={columns}
          searchPlaceholder="Search menu items..."
        />
      </Card>

      <Card padding="lg">
        <CustomText size="lg" fontWeight={600} style={{ marginBottom: '16px' }}>
          Features:
        </CustomText>
        
        <Stack gap="sm">
          <CustomText size="sm">
            🖼️ <strong>Clickable Images:</strong> Click any image in the table to view it in a popup with download and print options
          </CustomText>
          <CustomText size="sm">
            🖨️ <strong>Restaurant Letterhead:</strong> Print documents with professional restaurant letterhead including logo, address, and contact info
          </CustomText>
          <CustomText size="sm">
            📱 <strong>Responsive Design:</strong> Works on all screen sizes with proper scaling
          </CustomText>
          <CustomText size="sm">
            ⬇️ <strong>Download Images:</strong> Download images directly from the popup viewer
          </CustomText>
          <CustomText size="sm">
            🎨 <strong>Theme Support:</strong> Automatically adapts to light/dark theme
          </CustomText>
        </Stack>
      </Card>
    </Stack>
  );
};

export default ImageTableExample;
