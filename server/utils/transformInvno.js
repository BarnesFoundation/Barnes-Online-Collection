function transformInvno(objectNumber) {
  return objectNumber.replace(/\./g, "_");
}

module.exports = {
  transformInvno,
};
