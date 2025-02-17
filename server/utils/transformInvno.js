/** Replaces the Object Number `.` character with `_`
 * since that's how the folders named by Object Number are formatted in NetX
 *
 * For example, transforms `01.01.01` to `01-01-01`
 * @param objectNumber - The original object number using period characters
 */
function transformInvno(objectNumber) {
  return objectNumber.replace(/\./g, "_");
}

module.exports = {
  transformInvno,
};
