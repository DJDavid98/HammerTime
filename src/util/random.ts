/* eslint-disable no-bitwise */
/**
 * Creates a seeded random number generator function
 * @see https://stackoverflow.com/a/47593316
 */
export const mulberry32 = (initialSeed: number) => {
  let seed = initialSeed;
  return (): number => {
    // eslint-disable-next-line no-param-reassign
    seed += 0x6d2b79f5;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
/* eslint-enable no-bitwise */
