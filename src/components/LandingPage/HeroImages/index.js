import room22SouthWall from "./room22SouthWall.jpg";
import room15SouthWall from "./room15SouthWall.jpg";
import room13NorthWall from "./room13NorthWall.jpg";
import mainRoomWestWall from "./mainRoomWestWall.jpg";

// The first hero is the LCP element. It is served from public/heroes/ (a stable, non-hashed URL) and
// preloaded in public/index.html so the fetch starts during HTML parse instead of after the JS bundle
// renders it. Optimized copy: 1675px, mozjpeg q72 (~119KB vs the original 273KB). Keep this path in
// sync with the <link rel="preload"> in index.html.
const peasants = process.env.PUBLIC_URL + "/heroes/peasants-hero.jpg";

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
