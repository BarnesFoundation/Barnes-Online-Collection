/** Replaces the Object Number `.` character with `_`
 * since that's how the folders named by Object Number are formatted in NetX
 *
 * For example, transforms `01.01.01` to `01-01-01`
 * @param objectNumber - The original object number using period characters
 */
function transformInvno(objectNumber) {
  return objectNumber.replace(/\./g, "_");
}

/** Replaces the NetX Object Number `_` character with `.`
 * since that's how the folders named by Object Number are formatted in NetX
 *
 * For example, transforms `01_01_01` to `01.01.01`
 * @param objectNumber - The NetX object number using underscore characters
 */
function transformNetXObjectNumber(objectNumber) {
  return objectNumber.replace(/_/g, ".");
}

module.exports = {
  transformInvno,
  transformNetXObjectNumber,
};
