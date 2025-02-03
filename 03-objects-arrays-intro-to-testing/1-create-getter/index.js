/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  let props = path.split('.');
  function getter(obj) {
    for (const el of props) {
      if (obj.hasOwnProperty(el) && obj[el] !== undefined)
      {obj = obj[el];}
      else
      {return undefined;}
    }
    return obj;        
  }

  return getter;
}
