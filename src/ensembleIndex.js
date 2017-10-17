const AWS_BUCKET = process.env.REACT_APP_AWS_BUCKET;
const AWS_PREFIX = process.env.REACT_APP_IMAGES_PREFIX;

export const ENSEMBLE_IMAGE_URL = (index) => {
  return `https://s3.amazonaws.com/${AWS_BUCKET}/${AWS_PREFIX}/ensembles/${index}.jpg`;
}

export const ENSEMBLE = {
  1: {
    roomTitle: 'Main Room',
    wallTitle: 'North Wall'
  },
  2: {
    roomTitle: 'Main Room',
    wallTitle: 'East Wall'
  },
  3: {
    roomTitle: 'Main Room',
    wallTitle: 'South Wall'
  },
  4: {
    roomTitle: 'Main Room',
    wallTitle: 'West Wall'
  },
  5: {
    roomTitle: 'Room 2',
    wallTitle: 'North Wall'
  },
  6: {
    roomTitle: 'Room 2',
    wallTitle: 'East Wall'
  },
  7: {
    roomTitle: 'Room 2',
    wallTitle: 'South Wall'
  },
  8: {
    roomTitle: 'Room 2',
    wallTitle: 'West Wall'
  },
  9: {
    roomTitle: 'Room 6',
    wallTitle: 'North Wall'
  },
  10: {
    roomTitle: 'Room 3',
    wallTitle: 'East Wall'
  },
  11: {
    roomTitle: 'Room 3',
    wallTitle: 'South Wall'
  },
  12: {
    roomTitle: 'Room 3',
    wallTitle: 'West Wall'
  },
  13: {
    roomTitle: 'Room 4',
    wallTitle: 'North Wall'
  },
  14: {
    roomTitle: 'Room 4',
    wallTitle: 'East Wall'
  },
  15: {
    roomTitle: 'Room 4',
    wallTitle: 'South Wall'
  },
  16: {
    roomTitle: 'Room 4',
    wallTitle: 'West Wall'
  },
  17: {
    roomTitle: 'Room 5',
    wallTitle: 'North Wall'
  },
  18: {
    roomTitle: 'Room 5',
    wallTitle: 'East Wall'
  },
  19: {
    roomTitle: 'Room 5',
    wallTitle: 'South Wall'
  },
  20: {
    roomTitle: 'Room 5',
    wallTitle: 'West Wall'
  },
  21: {
    roomTitle: 'Room 6',
    wallTitle: 'North Wall'
  },
  22: {
    roomTitle: 'Room 6',
    wallTitle: 'East Wall'
  },
  23: {
    roomTitle: 'Room 6',
    wallTitle: 'South Wall'
  },
  24: {
    roomTitle: 'Room 6',
    wallTitle: 'West Wall'
  },
  25: {
    roomTitle: 'Room 7',
    wallTitle: 'North Wall'
  },
  26: {
    roomTitle: 'Room 7',
    wallTitle: 'East Wall'
  },
  27: {
    roomTitle: 'Room 7',
    wallTitle: 'South Wall'
  },
  28: {
    roomTitle: 'Room 7',
    wallTitle: 'West Wall'
  },
  29: {
    roomTitle: 'Room 8',
    wallTitle: 'North Wall'
  },
  30: {
    roomTitle: 'Room 8',
    wallTitle: 'East Wall'
  },
  31: {
    roomTitle: 'Room 8',
    wallTitle: 'South Wall'
  },
  32: {
    roomTitle: 'Room 8',
    wallTitle: 'West Wall'
  },
  33: {
    roomTitle: 'Room 9',
    wallTitle: 'North Wall'
  },
  34: {
    roomTitle: 'Room 9',
    wallTitle: 'East Wall'
  },
  35: {
    roomTitle: 'Room 9',
    wallTitle: 'South Wall'
  },
  36: {
    roomTitle: 'Room 9',
    wallTitle: 'West Wall'
  },
  37: {
    roomTitle: 'Room 10',
    wallTitle: 'North Wall'
  },
  38: {
    roomTitle: 'Room 10',
    wallTitle: 'East Wall'
  },
  39: {
    roomTitle: 'Room 10',
    wallTitle: 'South Wall'
  },
  40: {
    roomTitle: 'Room 10',
    wallTitle: 'West Wall'
  },
  41: {
    roomTitle: 'Room 11',
    wallTitle: 'North Wall'
  },
  42: {
    roomTitle: 'Room 11',
    wallTitle: 'East Wall'
  },
  43: {
    roomTitle: 'Room 11',
    wallTitle: 'South Wall'
  },
  44: {
    roomTitle: 'Room 11',
    wallTitle: 'West Wall'
  },
  45: {
    roomTitle: 'Room 12',
    wallTitle: 'North Wall'
  },
  46: {
    roomTitle: 'Room 12',
    wallTitle: 'East Wall'
  },
  47: {
    roomTitle: 'Room 12',
    wallTitle: 'South Wall'
  },
  48: {
    roomTitle: 'Room 12',
    wallTitle: 'West Wall'
  },
  49: {
    roomTitle: 'Room 13',
    wallTitle: 'North Wall'
  },
  50: {
    roomTitle: 'Room 13',
    wallTitle: 'East Wall'
  },
  51: {
    roomTitle: 'Room 13',
    wallTitle: 'South Wall'
  },
  52: {
    roomTitle: 'Room 13',
    wallTitle: 'West Wall'
  },
  53: {
    roomTitle: 'Room 14',
    wallTitle: 'North Wall'
  },
  54: {
    roomTitle: 'Room 14',
    wallTitle: 'East Wall'
  },
  55: {
    roomTitle: 'Room 14',
    wallTitle: 'South Wall'
  },
  56: {
    roomTitle: 'Room 14',
    wallTitle: 'West Wall'
  },
  57: {
    roomTitle: 'Room 15',
    wallTitle: 'North Wall'
  },
  58: {
    roomTitle: 'Room 15',
    wallTitle: 'East Wall'
  },
  59: {
    roomTitle: 'Room 15',
    wallTitle: 'South Wall'
  },
  60: {
    roomTitle: 'Room 15',
    wallTitle: 'West Wall'
  },
  61: {
    roomTitle: 'Room 16',
    wallTitle: 'North Wall'
  },
  62: {
    roomTitle: 'Room 16',
    wallTitle: 'East Wall'
  },
  63: {
    roomTitle: 'Room 16',
    wallTitle: 'South Wall'
  },
  64: {
    roomTitle: 'Room 16',
    wallTitle: 'West Wall'
  },
  65: {
    roomTitle: 'Room 17',
    wallTitle: 'North Wall'
  },
  66: {
    roomTitle: 'Room 17',
    wallTitle: 'East Wall'
  },
  67: {
    roomTitle: 'Room 17',
    wallTitle: 'South Wall'
  },
  68: {
    roomTitle: 'Room 17',
    wallTitle: 'West Wall'
  },
  69: {
    roomTitle: 'Room 18',
    wallTitle: 'North Wall'
  },
  70: {
    roomTitle: 'Room 18',
    wallTitle: 'East Wall'
  },
  71: {
    roomTitle: 'Room 18',
    wallTitle: 'South Wall'
  },
  72: {
    roomTitle: 'Room 18',
    wallTitle: 'West Wall'
  },
  73: {
    roomTitle: 'Room 19',
    wallTitle: 'North Wall'
  },
  74: {
    roomTitle: 'Room 19',
    wallTitle: 'East Wall'
  },
  75: {
    roomTitle: 'Room 19',
    wallTitle: 'South Wall'
  },
  76: {
    roomTitle: 'Room 19',
    wallTitle: 'West Wall'
  },
  77: {
    roomTitle: 'Room 20',
    wallTitle: 'North Wall'
  },
  78: {
    roomTitle: 'Room 20',
    wallTitle: 'East Wall'
  },
  79: {
    roomTitle: 'Room 20',
    wallTitle: 'South Wall'
  },
  80: {
    roomTitle: 'Room 20',
    wallTitle: 'West Wall'
  },
  81: {
    roomTitle: 'Room 21',
    wallTitle: 'North Wall'
  },
  82: {
    roomTitle: 'Room 21',
    wallTitle: 'East Wall'
  },
  83: {
    roomTitle: 'Room 21',
    wallTitle: 'South Wall'
  },
  84: {
    roomTitle: 'Room 21',
    wallTitle: 'West Wall'
  },
  85: {
    roomTitle: 'Room 22',
    wallTitle: 'North Wall'
  },
  86: {
    roomTitle: 'Room 22',
    wallTitle: 'East Wall'
  },
  87: {
    roomTitle: 'Room 22',
    wallTitle: 'South Wall'
  },
  88: {
    roomTitle: 'Room 22',
    wallTitle: 'West Wall'
  },
  89: {
    roomTitle: 'Room 23',
    wallTitle: 'North Wall'
  },
  90: {
    roomTitle: 'Room 23',
    wallTitle: 'East Wall'
  },
  91: {
    roomTitle: 'Room 23',
    wallTitle: 'South Wall'
  },
  92: {
    roomTitle: 'Room 23',
    wallTitle: 'West Wall'
  },
  93: {
    roomTitle: 'Le Bonheur de vivre',
    wallTitle: null
  },
  94: {
    roomTitle: 'Second Floor Balcony North (Room 24)',
    wallTitle: 'North Wall'
  },
  95: {
    roomTitle: 'Mezzanine',
    wallTitle: null
  },
  96: {
    roomTitle: 'Lower Level Lobby',
    wallTitle: null
  },
  97: {
    roomTitle: 'Balcony East',
    wallTitle: 'East Wall'
  },
  98: {
    roomTitle: 'Balcony South',
    wallTitle: 'South Wall'
  },
  99: {
    roomTitle: 'Balcony West',
    wallTitle: 'West Wall'
  },
  100: {
    roomTitle: 'Gallery Foyer',
    wallTitle: null
  }
};
