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

export function dist(p1, p2) {
  const deltaX = p1.x - p2.x;
  const deltaY = p1.y - p2.y;
  const deltaZ = p1.z - p2.z;

  return Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);
}
