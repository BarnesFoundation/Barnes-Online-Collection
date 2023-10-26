// Key-value pair of broken chars fed into replace as ...args
const FIX_DIACRITIC_PAIRS = [
  ["Ã¡", "á"],

  ["Ã§", "ç"],

  ["Ã©", "é"],
  ["Ã¨", "è"],
  ["Ã‰", "É"],

  ["Ã­Ã�", "í"],

  ["Ã±", "ñ"],

  ["Ã³", "ó"],
  ['Å"', "oe"],

  ["Ã¼", "ü"],

  ["�", ""],
];

/**
 * Our elasticsearch data has corrupted symbols and diacritics.
 * This helper method will remove those and replace them.
 * @param {string | void} stringWithBrokenDiacritics string with broken diacritics/symbols.
 */
const fixDiacritics = (stringWithBrokenDiacritics) =>
  stringWithBrokenDiacritics && typeof stringWithBrokenDiacritics === "string"
    ? FIX_DIACRITIC_PAIRS.reduce(
        (acc, replaceArgs) => acc.replace(...replaceArgs),
        stringWithBrokenDiacritics
      )
    : undefined;

module.exports = {
  fixDiacritics,
};
