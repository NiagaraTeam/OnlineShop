  export const roundValue = (value: number, digits: number)=> {
    const roundedValue = Math.round(value * Math.pow(10, digits)) / Math.pow(10, digits);
    
    const formattedValue = roundedValue.toFixed(digits);
    return formattedValue;
};