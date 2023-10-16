const COPYRIGHT = {
  1: {
    copy: 'In Copyright',
    link: 'http://rightsstatements.org/page/InC/1.0/?language=en',
    type: 'small'
  },
  2: {
    copy: 'Copyright Undetermined',
    link: 'http://rightsstatements.org/page/UND/1.0/?language=en',
    type: 'small'
  },
  3: {
    copy: 'In Copyright',
    link: 'http://rightsstatements.org/page/InC/1.0/?language=en',
    type: 'small'
  },
  4: {
    copy: 'Public Domain',
    link: 'https://creativecommons.org/publicdomain/mark/1.0/',
    type: 'large'
  },
  6: {
    copy: 'Copyright Undetermined',
    link: 'http://rightsstatements.org/page/UND/1.0/?language=en',
    type: 'small'
  },
  7: {
    copy: 'Public Domain',
    link: 'https://creativecommons.org/publicdomain/mark/1.0/',
    type: 'large'
  },
  8: {
    copy: 'Public Domain',
    link: 'https://creativecommons.org/publicdomain/mark/1.0/',
    type: 'large'
  },
  10: {
    copy: 'Public Domain',
    link: 'https://creativecommons.org/publicdomain/mark/1.0/',
    type: 'large'
  },
  11: {
    copy: 'Public Domain, Temporarily Under Exclusive License',
    link: 'https://creativecommons.org/publicdomain/mark/1.0/',
    type: 'large-exclusive'
  }
};

export const getObjectCopyright = (object) => {
  if (!object || !object.objRightsTypeId) {
    return {
      link: '',
      copy: 'No Known Copyright',
      type: 'small',
    };
  }

  return COPYRIGHT[object.objRightsTypeId];
};
