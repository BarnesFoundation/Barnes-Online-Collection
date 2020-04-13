// import hero1Desktop from './Desktop/peasants.png';
// import hero2Desktop from './Desktop/room22SouthWall.png';
// import hero3Desktop from './Desktop/room15SouthWall.png';
// import hero4Desktop from './Desktop/room13NorthWall.png'; 
// import hero5Desktop from './Desktop/mainRoomWestWall.png';

import hero1Desktop from './Compressed/peasants.png';
import hero2Desktop from './Compressed/room22SouthWall.png';
import hero3Desktop from './Compressed/room15SouthWall.png';
import hero4Desktop from './Compressed/room13NorthWall.png'; 
import hero5Desktop from './Compressed/mainRoomWestWall.png';

const sceneOne = {
    src: hero1Desktop,
    srcName: 'peasants',
    text: 'The Barnes Foundation houses the world\'s largest collections of Renoir and Cézanne, and important works by Matisse, Picasso and Modigliani.',
};

const sceneTwo = {
    src: hero2Desktop,
    srcName: 'room22SouthWall',
    text: 'It also features African art, Native American ceramics, Greek antiquities, Pennsylvania German Furniture, and decorative ironwork.',
};

const sceneThree = {
    src: hero3Desktop,
    srcName: 'room15SouthWall',
    text: 'Albert C. Barnes collected these works between 1912 and 1951, arranging them in "ensembles" that include objects from across history and around the globe.'
};

const sceneFour = {
    src: hero4Desktop,
    srcName: 'room13NorthWall',
    text: 'The ensembles make visual connections between light, line, color and space...'
};

const sceneFive = {
    src: hero5Desktop,
    srcName: 'mainRoomWestWall',
    text: '...creating unique opportunities to look, talk and share.'
}

export const heroes = [sceneOne, sceneTwo, sceneThree, sceneFour, sceneFive];
