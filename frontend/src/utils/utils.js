export const formatDateToFrench = (dateString) => {
  const date = new Date(dateString);
  const formatter = new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  return formatter.format(date);
};

export const convertTimeToDecimalHours = (timeString) => {
  if (timeString != 1 && timeString !== null) {
    // Split the timeString by ':' to extract hours, minutes, and seconds
    const [hours, minutes, seconds] = timeString.split(":").map(Number);

    // Convert minutes and seconds to a fraction of an hour
    const decimalHours = hours + minutes / 60 + seconds / 3600;

    // Return the decimal hours, formatted to 2 decimal places
    return decimalHours.toFixed(2);
  }
};
