import {createEffect, createEvent, createStore, sample} from "effector";
import type {Movie} from "../../types.ts";

const getInitialCompare = (): Movie[] => {
    const stored = localStorage.getItem('compare')
    try {
        return stored ? JSON.parse(stored) : []
    } catch {
        return []
    }
}

const saveCompareFx = createEffect((movies: Movie[]) => {
    localStorage.setItem('compare', JSON.stringify(movies))
})


export const addCompare = createEvent<Movie>()

export const $compare = createStore<Movie[]>(getInitialCompare())
    .on(addCompare, (state, movie) => {
        if (state.some((m) => m.id === movie.id)) return state
        if (state.length < 2) return [...state, movie]
        return [...state.slice(1), movie]
    })


sample({
    clock: $compare,
    target: saveCompareFx,
});