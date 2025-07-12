import React from "react";

interface DateFormatterProps {
  date: string | Date;
  format?: "date" | "datetime" | "time" | "iso";
}

export const DateFormatter: React.FC<DateFormatterProps> = ({
  date,
  format = "iso",
}) => {
  const formatDate = (dateValue: string | Date, formatType: string) => {
    const dateObj = new Date(dateValue);

    if (isNaN(dateObj.getTime())) {
      return "Invalid Date";
    }

    switch (formatType) {
      case "datetime":
        return dateObj.toLocaleString();
      case "time":
        return dateObj.toLocaleTimeString();
      case "iso":
        // Format as YYYY-MM-DD
        return dateObj.toISOString().split("T")[0];
      case "date":
      default:
        return dateObj.toLocaleDateString();
    }
  };

  return <span>{formatDate(date, format)}</span>;
};

// Default export for consistency
export default DateFormatter;
