import React, { useRef } from 'react';
import { ActionIcon, Tooltip } from '@mantine/core';
import { IconPrinter } from '@tabler/icons-react';
import { useReactToPrint } from 'react-to-print';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../redux/useAuth';
import { useRestaurantByUser } from '../../hooks/useRestaurantByUser';
import { Roles } from '../../constants/roles';

interface GlobalPrintProps {
  content?: React.ReactNode;
  title?: string;
  variant?: 'icon' | 'button';
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
}

const GlobalPrint: React.FC<GlobalPrintProps> = ({
  content,
  title = "Document",
  variant = 'icon',
  size = 'md',
  children
}) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { restaurant } = useRestaurantByUser();
  const printRef = useRef<HTMLDivElement>(null);

  const restaurantInfo = user?.role === Roles.RESTAURANT && restaurant ? {
    name: restaurant.restaurantName || 'Restaurant',
    logo: restaurant.logo,
    address: restaurant.address || '',
    phone: restaurant.phone || '',
    email: restaurant.email || '',
    website: restaurant.website || '',
    licenseNumber: restaurant.licenseNumber || '',
    cuisineType: restaurant.cuisineType || ''
  } : null;

  // Show letterhead only for restaurant users
  const shouldShowLetterhead = user?.role === Roles.RESTAURANT && restaurantInfo;

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: title + (restaurantInfo ? ` - ${restaurantInfo.name}` : ''),
    pageStyle: `
      @page {
        size: A4;
        margin: 0.3in;
      }
      @media print {
        body {
          font-family: Arial, sans-serif;
          color: #000;
          background: white;
          padding: 0;
          margin: 0;
        }
        .no-print { display: none !important; }
        img {
          max-width: 100% !important;
          height: auto !important;
          page-break-inside: avoid;
        }
        table {
          page-break-inside: auto;
        }
        tr {
          page-break-inside: avoid;
          page-break-after: auto;
        }
      }
    `,
  });

  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();

  const PrintContent = () => (
    <div style={{ padding: '8px', fontFamily: 'Arial, sans-serif', color: '#000' }}>
      {/* Restaurant Letterhead */}
      {shouldShowLetterhead && restaurantInfo && (
        <div style={{
          borderBottom: '2px solid #2c5aa0',
          paddingBottom: '8px',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          {restaurantInfo.logo && (
            <img
              src={restaurantInfo.logo}
              alt={`${restaurantInfo.name} Logo`}
              style={{
                width: '50px',
                height: '50px',
                objectFit: 'contain',
                borderRadius: '4px'
              }}
            />
          )}
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#2c5aa0',
              marginBottom: '4px'
            }}>
              {restaurantInfo.name}
            </div>
            <div style={{ fontSize: '12px', color: '#666', lineHeight: '1.2' }}>
              <div><strong>Address:</strong> {restaurantInfo.address}</div>
              {restaurantInfo.phone && <div><strong>Phone:</strong> {restaurantInfo.phone}</div>}
              {restaurantInfo.email && <div><strong>Email:</strong> {restaurantInfo.email}</div>}
              {restaurantInfo.website && <div><strong>Website:</strong> {restaurantInfo.website}</div>}
              {restaurantInfo.licenseNumber && <div><strong>License:</strong> {restaurantInfo.licenseNumber}</div>}
            </div>
            {restaurantInfo.cuisineType && (
              <div style={{
                background: '#f0f7ff',
                color: '#2c5aa0',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '10px',
                fontWeight: '500',
                display: 'inline-block',
                marginTop: '4px'
              }}>
                {restaurantInfo.cuisineType} Cuisine
              </div>
            )}
          </div>
        </div>
      )}

      {/* Document Title */}
      <div style={{
        fontSize: '18px',
        fontWeight: 'bold',
        textAlign: 'center',
        margin: '12px 0',
        color: '#333',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}>
        {title}
      </div>

      {/* Content */}
      <div style={{ margin: '8px 0', minHeight: '200px' }}>
        {content ? (
          typeof content === 'string' ? (
            <div dangerouslySetInnerHTML={{ __html: content }} />
          ) : (
            content
          )
        ) : (
          'Document content will appear here...'
        )}
      </div>

      {/* Footer */}
      <div style={{
        marginTop: '20px',
        paddingTop: '8px',
        borderTop: '1px solid #ddd',
        fontSize: '10px',
        color: '#888',
        textAlign: 'center'
      }}>
        <div>© {new Date().getFullYear()} {restaurantInfo?.name || 'Food Ordering Admin'}. All rights reserved.</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
          <span>Printed on: {currentDate} at {currentTime}</span>
          <span>Generated by Food Ordering Admin System</span>
        </div>
      </div>
    </div>
  );

  if (variant === 'button') {
    return (
      <>
        {/* Hidden print content */}
        <div style={{ display: 'none' }}>
          <div ref={printRef}>
            <PrintContent />
          </div>
        </div>

        <button
        onClick={handlePrint}
        style={{
          padding: size === 'sm' ? '8px 16px' : size === 'lg' ? '12px 24px' : '10px 20px',
          backgroundColor: theme.colors.primary,
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: size === 'sm' ? '12px' : size === 'lg' ? '16px' : '14px',
          fontWeight: 500,
          transition: 'all 0.2s ease',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = theme.colors.primaryHover;
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = theme.colors.primary;
        }}
      >
        <IconPrinter size={size === 'sm' ? 16 : size === 'lg' ? 20 : 18} />
        {children || 'Print Letterhead'}
      </button>
      </>
    );
  }

  return (
    <>
      {/* Hidden print content */}
      <div style={{ display: 'none' }}>
        <div ref={printRef}>
          <PrintContent />
        </div>
      </div>

      <Tooltip label="Print">
        <ActionIcon
          variant="subtle"
          size={size}
          onClick={handlePrint}
          style={{ color: theme.colors.textSecondary }}
        >
          <IconPrinter size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />
        </ActionIcon>
      </Tooltip>
    </>
  );
};

export default GlobalPrint;
