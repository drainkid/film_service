import {useEffect, useState} from "react";
import type {Movie} from "../types";

export const useFavorites = () => {
    const [favorites, setFavorites] = useState<Movie[]>([])

    useEffect(() => {
        const stored = localStorage.getItem("favorites")
        if (stored) {
            try {
                setFavorites(JSON.parse(stored))
            } catch {
                localStorage.removeItem("favorites")
            }
        }
    }, []);

    const addFavorite = (movie: Movie) => {
        setFavorites(prev => {
            if (prev.some(f => f.id === movie.id)) return prev

            const updated = [...prev, movie]
            localStorage.setItem("favorites", JSON.stringify(updated))
            return updated
        })
    }


    const isFavorite = (id: number) => {
        return favorites.some(f => f.id === id)
    };

    return { favorites, addFavorite, isFavorite }
};
