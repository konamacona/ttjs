/**
 * reMap maps a given number within an original range to the same position in
 * the second range
 * @param {number} number The value to remap
 * @param {number} a1 the low-end of original range
 * @param {number} a2 the high-end of original range
 * @param {number} b1 the low-end of new range
 * @param {number} b2 the high-end of new range
 */
export function reMap(number, a1, a2, b1, b2) {
  return b1 + (number - a1) * (b2 - b1) / (a2 - a1);
}
