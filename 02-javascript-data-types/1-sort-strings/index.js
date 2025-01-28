/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  return [...arr].sort((a, b) => {
    return param == 'desc' ? 
      b.localeCompare(a, 'en', {sensitivity: 'variant', caseFirst: 'upper'}) : 
      a.localeCompare(b, 'en', {sensitivity: 'variant', caseFirst: 'upper'});
  });
}
