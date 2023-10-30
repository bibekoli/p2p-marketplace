export const ConvertDateToDaysAgo = (date) => {
  const givenDate = new Date(date);
  const currentDate = new Date();
  const timeDiff = currentDate.getTime() - givenDate.getTime();

  const dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
  const hourDiff = Math.floor(timeDiff / (1000 * 3600));
  const minuteDiff = Math.floor(timeDiff / (1000 * 60));
  const monthDiff = currentDate.getMonth() - givenDate.getMonth() + 12 * (currentDate.getFullYear() - givenDate.getFullYear());
  const yearDiff = currentDate.getFullYear() - givenDate.getFullYear();

  if (dayDiff < 1) {
    if (hourDiff < 1) {
      if (minuteDiff < 1) {
        return "just now";
      }
      if (minuteDiff === 1) {
        return `${minuteDiff} minute ago`;
      }
      return `${minuteDiff} minutes ago`;
    }
    if (hourDiff === 1) {
      return `${hourDiff} hour ago`;
    }
    return `${hourDiff} hours ago`;
  }

  if (monthDiff < 1) {
    if (dayDiff === 1) {
      return `${dayDiff} day ago`;
    }
    return `${dayDiff} days ago`;
  }

  if (monthDiff % 12 === 0) {
    const year = monthDiff / 12;
    if (year === 1) {
      return `${year} year ago`;
    }
    return `${year} years ago`;
  }

  if (yearDiff < 1) {
    if (monthDiff === 1) {
      return `${monthDiff} month ago`;
    }
    return `${monthDiff} months ago`;
  }

  if (monthDiff <= 12) {
    const months = currentDate.getMonth() + 1 + (12 - givenDate.getMonth());
    if (months === 1) {
      return `${months} month ago`;
    }
    return `${months} months ago`;
  }

  const newGivenDate = givenDate.toLocaleString("default", { month: "long", day: "numeric", year: "numeric" });
  return newGivenDate;
};