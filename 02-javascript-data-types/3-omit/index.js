/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (obj, ...fields) => {
  const keysArr = Object.keys(obj).filter((e) => !fields.includes(e));
  const resObj = {};
  keysArr.forEach((e) => resObj[e] = obj[e]);
  return resObj;    
};
