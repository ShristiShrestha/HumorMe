/* standard stake category sizes */
export const tenM = Math.pow(10, 7);
export const oneM = Math.pow(10, 6);
export const oneHundredK = Math.pow(10, 5);
export const tenK = Math.pow(10, 4);

export const fiveM = 5 * oneM;
export const fiveHundredK = 5 * oneHundredK;
export const fiftyK = 5 * tenK;

export function getRandomNumber(low, high) {
    return Math.floor(Math.random() * (high - low + 1)) + low;
}

export const generateMinMax = max => Array.from(Array(max).keys());
