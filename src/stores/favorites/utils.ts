import type {Movie} from "../../types.ts";

export const isFavorite = (favorites: Movie[], id: number): boolean => {
    return favorites.some(movie => movie.id === id);
};