// All hero slides served from public/heroes/ as optimized JPGs (≤1600px, mozjpeg q72) — the 4
// rotation slides were 941KB of unoptimized JPGs competing for slow-4G bandwidth on mobile; now
// ~463KB total (−51%). The first slide (peasants) is the LCP element and is additionally preloaded
// in public/index.html + injected as the static hero — keep that path in sync with the <link rel=preload>.
const peasants = process.env.PUBLIC_URL + "/heroes/peasants-hero.jpg";
const room22SouthWall = process.env.PUBLIC_URL + "/heroes/room22.jpg";
const room15SouthWall = process.env.PUBLIC_URL + "/heroes/room15.jpg";
const room13NorthWall = process.env.PUBLIC_URL + "/heroes/room13.jpg";
const mainRoomWestWall = process.env.PUBLIC_URL + "/heroes/mainroom.jpg";

const sceneOne = {
  src: peasants,
  // srcName: 'peasants',
  text: "The Barnes Foundation houses one of the world’s great collections of modern European paintings, with numerous works by Renoir, Cézanne, Matisse, Picasso, Van Gogh, and Modigliani.",
};

const sceneTwo = {
  src: room22SouthWall,
  // srcName: 'room22SouthWall',
  text: "It also features African art, Native American ceramics, Greek antiquities, Pennsylvania German furniture, and decorative ironwork.",
};

const sceneThree = {
  src: room15SouthWall,
  // srcName: 'room15SouthWall',
  text: "Albert C. Barnes collected these works between 1912 and 1951, arranging them in “ensembles” that include objects from across history and around the globe.",
};

const sceneFour = {
  src: room13NorthWall,
  // srcName: 'room13NorthWall',
  text: "The ensembles make visual connections between light, line, color, and space...",
};

const sceneFive = {
  src: mainRoomWestWall,
  // srcName: 'mainRoomWestWall',
  text: "...creating unique opportunities to look, talk, and share.",
};

export const heroes = [sceneOne, sceneTwo, sceneThree, sceneFour, sceneFive];
