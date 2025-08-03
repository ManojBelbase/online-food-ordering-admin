import React from 'react';

interface TableColumn {
  key: string;
  title: string;
  align?: "left" | "center" | "right";
  width?: number;
  sortable?: boolean;
}

interface TablePrintContentProps {
  data: any[];
  columns: TableColumn[];
  title?: string;
  showTitle?: boolean;
  showRecordCount?: boolean;
  excludeColumns?: string[];
  searchQuery?: string;
}

const TablePrintContent: React.FC<TablePrintContentProps> = ({
  data,
  columns,
  title = "Table Report",
  showTitle = false,
  showRecordCount = false,
  excludeColumns = [],
}) => {
  const printColumns = columns.filter(column => !excludeColumns.includes(column.key));

  const renderCellValue = (cellValue: any) => {
    if (cellValue === null || cellValue === undefined || cellValue === '') {
      return '-';
    }
    
    if (typeof cellValue === 'boolean') {
      return cellValue ? 'Yes' : 'No';
    }
    
    if (typeof cellValue === 'object') {
      if (React.isValidElement(cellValue)) {
        return '[React Component]';
      } else {
        try {
          return JSON.stringify(cellValue);
        } catch (error) {
          return '[Complex Object]';
        }
      }
    }

    return cellValue;
  };

  const isImageField = (columnKey: string) => {
    return ["image", "photo", "avatar", "icon", "logo"].some((key) =>
      columnKey.toLowerCase().includes(key)
    );
  };

  const renderImageCell = (cellValue: any) => {
    if (typeof cellValue === 'string' && cellValue.trim() !== '' && cellValue !== '-' &&
        (cellValue.startsWith("data:image") || cellValue.startsWith("http") || cellValue.startsWith("/"))) {
      return (
        <img 
          src={cellValue} 
          alt="Image" 
          style={{
            width: '50px',
            height: '50px',
            objectFit: 'cover',
            borderRadius: '6px',
            border: '1px solid #ccc',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        />
      );
    }
    return renderCellValue(cellValue);
  };

  return (
    <div style={{ padding: '8px', fontFamily: 'Arial, sans-serif', color: '#000' }}>
      {(showTitle || showRecordCount) && (
        <div style={{ marginBottom: '16px' }}>
          {showTitle && (
            <h3 style={{ margin: '0', color: '#333', fontSize: '16px' }}>
              {title}
            </h3>
          )}
          
          {showRecordCount && (
            <p style={{ margin: '4px 0', color: '#666', fontSize: '12px' }}>
              Showing {data.length} records
            </p>
          )}
        </div>
      )}
      
      {/* Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            {printColumns.map(column => (
              <th 
                key={column.key}
                style={{ 
                  border: '1px solid #ddd', 
                  padding: '6px', 
                  textAlign: 'left', 
                  fontWeight: 'bold' 
                }}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row: any, index: number) => (
            <tr 
              key={index}
              style={{ backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9' }}
            >
              {printColumns.map(column => (
                <td 
                  key={column.key}
                  style={{ 
                    border: '1px solid #ddd', 
                    padding: isImageField(column.key) ? '8px' : '6px',
                    textAlign: isImageField(column.key) ? 'center' : 'left',
                    verticalAlign: 'middle'
                  }}
                >
                  {isImageField(column.key) 
                    ? renderImageCell(row[column.key])
                    : renderCellValue(row[column.key])
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablePrintContent;
