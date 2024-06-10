/** Replaces the Object Number `.` character with `_`
 * since that's how the folders named by Object Number are formatted in NetX
 */
function transformInvno(objectNumber) {
  return objectNumber.replace(/\./g, "_");
}

module.exports = {
  transformInvno,
};
