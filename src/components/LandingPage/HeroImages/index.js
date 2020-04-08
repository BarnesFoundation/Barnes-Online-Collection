import hero1Desktop from './Desktop/peasants.png';
import hero2Desktop from './Desktop/room22SouthWall.png';
import hero3Desktop from './Desktop/room15SouthWall.png';
import hero4Desktop from './Desktop/room13NorthWall.png'; 
import hero5Desktop from './Desktop/mainRoomWestWall.jpg';

import hero1Mobile from './Mobile/3 - Main Room South Wall.jpg';
import hero2Mobile from './Mobile/57 - Room 15 East Wall.jpg';
import hero3Mobile from './Mobile/87 - Room 22 South Wall.jpg';
import hero4Mobile from './Mobile/23 - Room 6 South Wall.jpg';
import hero5Mobile from './Mobile/4 - Main Room West Wall.jpg';

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
