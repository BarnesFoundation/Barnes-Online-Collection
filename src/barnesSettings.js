const OBJECT_SET_SIZE = 50;

export const BARNES_SETTINGS = {
  min2D: Math.floor(OBJECT_SET_SIZE*0.4),
  minMetalworks: Math.floor(OBJECT_SET_SIZE*0.3),
  min3D: Math.floor(OBJECT_SET_SIZE*0.2),
  minKnickKnacks: Math.floor(OBJECT_SET_SIZE*0.1),
  terms2D: ['Architecture', 'Paintings', 'Drawings', 'Works on Paper', 'Prints', 'Enamels', 'Manuscripts', 'Photographs'],
  termsMetalworks: ['Metalworks'],
  terms3D: ['Sculptures', 'Furniture', 'Timepieces'],
  termsKnickKnacks: ['Flatware', 'Jewelry', 'Lighting Devices', 'Textiles', 'Tools and Equipment', 'Vessels'],
  size: OBJECT_SET_SIZE,
  line_threshhold: 0.7,
  broken_threshhold: 0.5
};
