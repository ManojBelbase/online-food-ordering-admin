import React, { useRef } from 'react';
import { Modal, Image, Group, ActionIcon, Tooltip } from '@mantine/core';
import { IconDownload, IconPrinter } from '@tabler/icons-react';
import { useReactToPrint } from 'react-to-print';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../redux/useAuth';
import { useRestaurantByUser } from '../../hooks/useRestaurantByUser';
import { Roles } from '../../constants/roles';

interface ImageViewerProps {
  opened: boolean;
  onClose: () => void;
  imageUrl: string;
  title?: string;
  onPrint?: () => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({
  opened,
  onClose,
  imageUrl,
  title = "Image Viewer",
  onPrint
}) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { restaurant } = useRestaurantByUser();
  const printRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    try {
      // For Cloudinary URLs or external images, we need to fetch and convert to blob
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      // Create object URL from blob
      const blobUrl = URL.createObjectURL(blob);

      // Create download link
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${title.replace(/\s+/g, '_')}_image.${getImageExtension(imageUrl)}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up object URL
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback to opening in new tab
      window.open(imageUrl, '_blank');
    }
  };

  const getImageExtension = (url: string): string => {
    const extension = url.split('.').pop()?.toLowerCase();
    if (extension && ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
      return extension;
    }
    return 'jpg'; // Default fallback
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Print ${title}`,
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
      }
    `,
  });

  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();

  // Use restaurant info if user is restaurant role
  const restaurantInfo = user?.role === Roles.RESTAURANT && restaurant ? {
    name: restaurant.restaurantName || 'Restaurant',
    logo: restaurant.logo,
    address: restaurant.address || '',
    phone: restaurant.phone || '',
    email: restaurant.email || '',
  } : null;

  // Print content component
  const PrintContent = () => (
    <div style={{ padding: '8px', fontFamily: 'Arial, sans-serif', color: '#000' }}>
      {/* Restaurant Letterhead */}
      {restaurantInfo && (
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
                width: '60px',
                height: '60px',
                objectFit: 'contain',
                borderRadius: '6px'
              }}
            />
          )}
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#2c5aa0',
              marginBottom: '5px'
            }}>
              {restaurantInfo.name}
            </div>
            <div style={{ fontSize: '12px', color: '#666', lineHeight: '1.3' }}>
              <div><strong>Address:</strong> {restaurantInfo.address}</div>
              {restaurantInfo.phone && <div><strong>Phone:</strong> {restaurantInfo.phone}</div>}
              {restaurantInfo.email && <div><strong>Email:</strong> {restaurantInfo.email}</div>}
            </div>
          </div>
        </div>
      )}

      {/* Image Content */}
      <div style={{ textAlign: 'center', margin: '8px 0' }}>
        <div style={{
          fontSize: '16px',
          fontWeight: 'bold',
          marginBottom: '8px',
          color: '#333'
        }}>
          {title}
        </div>
        {imageUrl && (
          <img
            src={imageUrl}
            alt={title}
            style={{
              maxWidth: '100%',
              maxHeight: '70vh',
            objectFit: 'contain',
            border: '1px solid #ddd',
            borderRadius: '8px'
          }}
          />
        )}
        {!imageUrl && (
          <div style={{
            padding: '40px',
            textAlign: 'center',
            color: '#666',
            border: '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: '#f9f9f9'
          }}>
            No image available
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        marginTop: '16px',
        paddingTop: '8px',
        borderTop: '1px solid #ddd',
        fontSize: '9px',
        color: '#888',
        textAlign: 'center'
      }}>
        <div>Printed on: {currentDate} at {currentTime}</div>
        <div>© {new Date().getFullYear()} {restaurantInfo?.name || 'Food Ordering Admin'}. All rights reserved.</div>
      </div>
    </div>
  );

  const handlePrintClick = () => {
    if (onPrint) {
      onPrint();
    } else {
      handlePrint();
    }
  };

  return (
    <>
      {/* Hidden print content */}
      <div style={{ display: 'none' }}>
        <div ref={printRef}>
          <PrintContent />
        </div>
      </div>

      <Modal
        opened={opened}
        onClose={onClose}
        title={title}
        size="md"
        centered
        zIndex={10001}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        styles={{
          content: {
            backgroundColor: theme.colors.surface,
          },
          header: {
            backgroundColor: theme.colors.surface,
            borderBottom: `1px solid ${theme.colors.border}`,
          },
          title: {
            color: theme.colors.textPrimary,
            fontWeight: 600,
          },
        }}
      >
      <div style={{ position: 'relative' }}>
        {/* Action buttons */}
        <Group 
          justify="flex-end" 
          style={{ 
            marginBottom: '16px',
            padding: '8px',
            backgroundColor: theme.colors.backgroundSecondary,
            borderRadius: '8px',
          }}
        >
          <Tooltip label="Download Image">
            <ActionIcon
              variant="subtle"
              size="lg"
              onClick={handleDownload}
              style={{ color: theme.colors.textSecondary }}
            >
              <IconDownload size={20} />
            </ActionIcon>
          </Tooltip>
          
          <Tooltip label="Print Image">
            <ActionIcon
              variant="subtle"
              size="lg"
              onClick={handlePrintClick}
              style={{ color: theme.colors.textSecondary }}
            >
              <IconPrinter size={20} />
            </ActionIcon>
          </Tooltip>
        </Group>

        {/* Image display */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.colors.background,
            borderRadius: '8px',
            padding: '16px',
            minHeight: '300px',
          }}
        >
          <Image
            src={imageUrl}
            alt={title}
            fit="contain"
            style={{
              maxWidth: '100%',
              maxHeight: '80vh',
              borderRadius: '8px',
              boxShadow: theme.shadows.md,
            }}
            fallbackSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xMDAgMTAwTDEwMCAxMDBaIiBzdHJva2U9IiNDQ0MiIHN0cm9rZS13aWR0aD0iMiIvPgo8dGV4dCB4PSIxMDAiIHk9IjEwNSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzk5OSIgZm9udC1zaXplPSIxNCIgZm9udC1mYW1pbHk9IkFyaWFsIj5JbWFnZSBub3QgZm91bmQ8L3RleHQ+Cjwvc3ZnPg=="
          />
        </div>
      </div>
    </Modal>
    </>
  );
};

export default ImageViewer;
