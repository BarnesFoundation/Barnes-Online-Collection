/** Split a given array if `GenericObject` type into an array containing
 * several arrays of the specified size
 */
function splitArray(array, size) {
  const arrayCollector = [];
  const arraySize = array.length;

  for (let i = 0; i < arraySize; i += size) {
    arrayCollector.push(array.slice(i, i + size));
  }

  return arrayCollector;
}

module.exports = {
  splitArray,
};
