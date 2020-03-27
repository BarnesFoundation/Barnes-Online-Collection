// import hero1 from './1.jpg';
import hero1 from './mainRoomSouthWall.jpg';
import hero3 from './room22SouthWall.jpg';
// import hero89 from './89.jpg';

const firstPanel = {
    src: hero1,
    text: 'The Barnes Foundation houses the world\'s largest collections of Renoir and Cezanne, and important works by Matisse, Picasso and Modigliani.',
    start: 'translate3d(168px, -34px, 0px) scale(1.3)',
    end: 'translate3d(168px, -70px, 0px) scale(1.3)'
};

const thirdPanel = {
    src: hero3,
    text: 'Albert C. Barnes collected these works between 1912 and 1951, arranging them in "ensembles" that include objects across history and around the globe.',
    start: 'scale(1.7) translate3d(125px, 0px, 0px)',
    end: 'scale(1.3) translate3d(-72px, 0px, 0px)',
}

export const heroes = [firstPanel, thirdPanel];