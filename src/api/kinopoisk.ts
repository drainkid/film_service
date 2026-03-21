import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "X-API-KEY": API_KEY,
    },
});

export interface FilterParams {
    genres?: string | null
    ratingFrom?: string | null
    ratingTo?: string | null
    yearFrom?: string | null
    yearTo?: string | null
}

export interface MovieRequestParams {
    page: number
    limit: number
    filters?: FilterParams
    signal?: AbortSignal
}

export const fetchMovies = async ({page, limit, filters = {}, signal}: MovieRequestParams) => {
    const params: Record<string, number | string> = {
        page,
        limit,
    }

    if (filters.genres) {
        params['genres.name'] = filters.genres
    }

    if (filters.ratingFrom && filters.ratingTo) {
        params['rating.imdb'] = `${filters.ratingFrom}-${filters.ratingTo}`
    } else if (filters.ratingFrom) {
        params['rating.imdb'] = `${filters.ratingFrom}-10`
    } else if (filters.ratingTo) {
        params['rating.imdb'] = `1-${filters.ratingTo}`
    }

    if (filters.yearFrom && filters.yearTo) {
        params['year'] = `${filters.yearFrom}-${filters.yearTo}`
    } else if (filters.yearFrom) {
        params['year'] = `${filters.yearFrom}-${new Date().getFullYear()}`
    } else if (filters.yearTo) {
        params['year'] = `1900-${filters.yearTo}`
    }

    return await api.get('/movie', {
        params,
        signal,
    })

}

export const fetchMovieById = async (id: string, signal?:AbortSignal) => {
    return await api.get(`/movie/${id}`, {signal})
};
