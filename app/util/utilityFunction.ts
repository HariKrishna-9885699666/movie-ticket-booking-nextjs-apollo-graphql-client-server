
export const getFormattedDate = (releaseDate: string, format?: 'Y' | 'M' | 'D') => {
    const date = new Date(parseInt(releaseDate, 10));
  
    switch (format) {
      case 'Y':
        return date.getFullYear().toString();
      case 'M':
        return date.toLocaleDateString("en-US", { month: "long" });
      case 'D':
        return date.toLocaleDateString("en-US", { day: "numeric" });
      default:
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
    }
  };
  
