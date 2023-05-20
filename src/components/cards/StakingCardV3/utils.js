const countsPerPeriod = (days, aprValue) => {
  return { _seconds: days * 24 * 60 * 60, aprValuePerPeriod: (aprValue / 12 / 30) * days };
};

export default countsPerPeriod;

export const pills = ["1M", "2M", "3M", "6M", "12M", "18M"];

export const toMax2Decimals = (x) => {
  return Number(x).toFixed(8);
};

export const toMax4Decimals = (x) => {
  return Number(x).toFixed(4);
};

export const countsPerDay = (e) => {
  switch (e) {
    case "1M":
      return 30;
    case "2M":
      return 30 * 2;
    case "3M":
      return 30 * 3;
    case "6M":
      return 30 * 6;
    case "12M":
      return 30 * 12;
    case "18M":
      return 30 * 18;
    default:
      break;
  }
};
