export const getNumberOrdinal = (num) => {
  const ordinal = ["th", "st", "nd", "rd"],
    value = num % 100;
  return ordinal[(value - 20) % 10] || ordinal[value] || ordinal[0];
};
