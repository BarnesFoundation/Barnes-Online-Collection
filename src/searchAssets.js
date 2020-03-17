import axios from 'axios';

const searchAssets = { data: null };

/**
 * Async method to set searchAssets.
 */
export const setSearchAssets = async () => {
    try {
        const res = await axios('/resources/searchAssets.json'); // Async import of searchAssets.
        searchAssets.data = res.data; // Set global singleton.
        return searchAssets;
    } catch (e) {
        console.error('Error setting search assets.');
        console.error(e);
    }

};

/**
 * Method that returns searchAssets.
 */
export const getSearchAssets = async () => {
    if (searchAssets.data) {
        return searchAssets.data;
    } else {
        const { data } = await setSearchAssets();
        return data;
    }
}
