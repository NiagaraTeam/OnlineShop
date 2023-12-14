export const roundValue = (value: number, digits: number) => {
    return Math.round(value * Math.pow(10, digits)) / Math.pow(10, digits);
  }