import {createEffect, createEvent, createStore, sample} from 'effector';
import type {Movie} from '../../types.ts';

const getInitialFavorites = (): Movie[] => {
    const stored = localStorage.getItem("favorites")
    try {
        return stored ? JSON.parse(stored) : [];
    } catch { return []; }
}


// 1. Эффекты (Side Effects)
const saveFavoritesFx = createEffect((favorites: Movie[]) => {
    localStorage.setItem("favorites", JSON.stringify(favorites))
})


// 2. События
export const addFavorite = createEvent<Movie>()

// 3. Стор (Чистая логика)
export const $favorites = createStore<Movie[]>(getInitialFavorites())
    .on(addFavorite, (state, movie) => {
        if (state.some(f => f.id === movie.id)) return state
        return [...state, movie]
    })

// Когда изменился стор $favorites -> сохраняем его в LocalStorage
sample({
    clock: $favorites,
    target: saveFavoritesFx,
});
