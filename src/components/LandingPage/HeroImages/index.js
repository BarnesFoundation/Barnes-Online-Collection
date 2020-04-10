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
    srcDesktop: hero1Desktop,
    srcMobile: hero1Desktop,
    text: 'The Barnes Foundation houses the world\'s largest collections of Renoir and Cézanne, and important works by Matisse, Picasso and Modigliani.',
};

const sceneTwo = {
    srcDesktop: hero2Desktop,
    srcMobile: hero2Desktop,
    text: 'It also features African art, Native American ceramics, Greek antiquities, Pennsylvania German Furniture, and decorative ironwork.',
};

const sceneThree = {
    srcDesktop: hero3Desktop,
    srcMobile: hero3Desktop,
    text: 'Albert C. Barnes collected these works between 1912 and 1951, arranging them in "ensembles" that include objects from across history and around the globe.'
};

const sceneFour = {
    srcDesktop: hero4Desktop,
    srcMobile: hero4Desktop,
    text: 'The ensembles make visual connections between light, line, color and space...'
};

const sceneFive = {
    srcDesktop: hero5Desktop,
    srcMobile: hero5Desktop,
    text: '...creating unique opportunities to look, talk and share.'
}

export const heroes = [sceneOne, sceneTwo, sceneThree, sceneFour, sceneFive];
