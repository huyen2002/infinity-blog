export const DateTimeUtils = {
  getFullDate: (date: Date) => {
    if (typeof date === "string") date = new Date(date);

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day < 10 ? `0${day}` : day}/${
      month < 10 ? `0${month}` : month
    }/${year}`;
  },
};
