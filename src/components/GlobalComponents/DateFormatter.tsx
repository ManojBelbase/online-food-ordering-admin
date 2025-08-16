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
  case "datetime": {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");

    let hours = dateObj.getHours();
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
    const seconds = String(dateObj.getSeconds()).padStart(2, "0");

    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // convert 0 → 12

    return `${year}-${month}-${day}, ${hours}:${minutes}:${seconds} ${ampm}`;
  }

  case "time":
    return dateObj.toLocaleTimeString();

  case "iso":
    // YYYY-MM-DD
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
