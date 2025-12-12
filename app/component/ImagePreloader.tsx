'use client';
import { useEffect } from 'react';

// List of images to preload for better UX
const PRELOAD_IMAGES = [
    // Shop items
    '/ball.png',
    '/GoldBall.png',
    '/potionSmall.svg',
    '/potionLarge.svg',
    '/candycane.png',
    '/glove.png',
    // UI elements
    '/nurseJoyNoBackground.jpg',
    '/nurseJoy.jpg',
    '/pokeCenter.jpg',
    '/kanto_map.png',
    '/kanto-badges-1.png',
    '/ballEmpty.png',
    '/pokeball_close.png',
    '/EarlyBacksprite.png',
    // Starter pokemon
    '/starter_pokemon_bulbasaur.png',
    '/starter_pokemon_charmander.png',
    '/starter_pokemon_squirtle.png',
    '/selected_bulbasaur.png',
    '/selected_charmander.png',
    '/selected_squirtle.png',
    // Icons (type icons)
    '/icons/bug.svg',
    '/icons/dark.svg',
    '/icons/dragon.svg',
    '/icons/electric.svg',
    '/icons/fairy.svg',
    '/icons/fighting.svg',
    '/icons/fire.svg',
    '/icons/flying.svg',
    '/icons/ghost.svg',
    '/icons/grass.svg',
    '/icons/ground.svg',
    '/icons/ice.svg',
    '/icons/normal.svg',
    '/icons/poison.svg',
    '/icons/psychic.svg',
    '/icons/rock.svg',
    '/icons/steel.svg',
    '/icons/water.svg',
];

/**
 * ImagePreloader component - preloads important images in the background
 * to improve perceived performance when navigating to different screens.
 * 
 * This component renders nothing visible but triggers image loading
 * when mounted.
 */
const ImagePreloader = () => {
    useEffect(() => {
        // Preload images after a short delay to not block initial render
        const timeoutId = setTimeout(() => {
            PRELOAD_IMAGES.forEach((src) => {
                const img = new Image();
                img.src = src;
            });
        }, 1000); // Wait 1 second after page load before preloading

        return () => clearTimeout(timeoutId);
    }, []);

    // This component doesn't render anything visible
    return null;
};

export default ImagePreloader;

// Utility function to preload specific images on demand
export const preloadImages = (imageSources: string[]) => {
    imageSources.forEach((src) => {
        const img = new Image();
        img.src = src;
    });
};

// Predefined image groups for targeted preloading
export const IMAGE_GROUPS = {
    shop: ['/ball.png', '/GoldBall.png', '/potionSmall.svg', '/potionLarge.svg', '/candycane.png', '/glove.png'],
    heal: ['/nurseJoyNoBackground.jpg', '/nurseJoy.jpg', '/pokeCenter.jpg'],
    starters: [
        '/starter_pokemon_bulbasaur.png',
        '/starter_pokemon_charmander.png',
        '/starter_pokemon_squirtle.png',
        '/selected_bulbasaur.png',
        '/selected_charmander.png',
        '/selected_squirtle.png',
    ],
    typeIcons: PRELOAD_IMAGES.filter((src) => src.startsWith('/icons/')),
};
