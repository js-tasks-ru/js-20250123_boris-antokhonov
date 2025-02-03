/**
 * invertObj - should swap object keys and values
 * @param {object} obj - the initial object
 * @returns {object | undefined} - returns new object or undefined if nothing did't pass
 */
export function invertObj(obj) {
  const result = {};
  if (obj === undefined) {
    return undefined;}
  else 
  {
    Object.entries(obj).forEach((el) => result[el[1]] = el[0]);
    return result;
  }
}
