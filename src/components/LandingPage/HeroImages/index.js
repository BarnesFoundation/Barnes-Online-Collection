import peasants from './peasants.jpg';
import room22SouthWall from './room22SouthWall.jpg';
import room15SouthWall from './room15SouthWall.jpg';
import room13NorthWall from './room13NorthWall.jpg';
import mainRoomWestWall from './mainRoomWestWall.jpg';

const sceneOne = {
    src: peasants,
    // srcName: 'peasants',
    text: 'The Barnes Foundation houses one of the world’s great collections of modern European paintings, with numerous works by Renoir, Cézanne, Matisse, Picasso, Van Gogh, and Modigliani.',
};

const sceneTwo = {
    src: room22SouthWall,
    // srcName: 'room22SouthWall',
    text: 'It also features African art, Native American ceramics, Greek antiquities, Pennsylvania German furniture, and decorative ironwork.',
};

const sceneThree = {
    src: room15SouthWall,
    // srcName: 'room15SouthWall',
    text: 'Albert C. Barnes collected these works between 1912 and 1951, arranging them in “ensembles” that include objects from across history and around the globe.'
};

const sceneFour = {
    src: room13NorthWall,
    // srcName: 'room13NorthWall',
    text: 'The ensembles make visual connections between light, line, color, and space...'
};

const sceneFive = {
    src: mainRoomWestWall,
    // srcName: 'mainRoomWestWall',
    text: '...creating unique opportunities to look, talk, and share.'
}

export const heroes = [sceneOne, sceneTwo, sceneThree, sceneFour, sceneFive];
