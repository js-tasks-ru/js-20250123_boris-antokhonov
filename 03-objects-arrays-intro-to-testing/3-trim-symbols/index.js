/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  let cntr = 1;
  let result = size === undefined ? string : '';
  
  if (string.length > 0 && size > 0) {
    result = string[0];
    for (let i = 0; i < string.length - 1; i++) {
      if (string[i] === string[i + 1]) {
        cntr++;
        if (cntr <= size) {
          result += string[i + 1];
        }
      }
      else {
        cntr = 1;
        result += string[i + 1];
      }
    }    
  }

  return result;
}
