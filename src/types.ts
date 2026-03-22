export interface Movie {
    createdAt: Date |null;
    ageRating: number | null;
    alternativeName: string | null;
    countries: Array<{
        name?: string;
    }>;
    description: string | null;
    genres: Array<{
        name?: string;
        [key: string]: unknown;
    }>;
    id: number;
    isSeries: boolean;
    movieLength: number | null;
    name: string;
    poster?: {
        url: string;
        previewUrl: string;
    };
    rating?: {
        kp: number;
        imdb: number;
        filmCritics: number;
        russianFilmCritics: number;
        await: number;
    };
    ratingMpaa?: string | null;
    releaseYears?: Array<{
        start?: number;
        end?: number | null;
        [key: string]: unknown;
    }>;
    seriesLength: number | null;
    shortDescription: string | null;
    status: string | null;
    ticketsOnSale: boolean;
    top10: number | null;
    top250: number | null;
    totalSeriesLength: number | null;
    type: 'movie' | 'tv-series' | 'cartoon' | 'anime' | string;
    typeNumber: number;
    votes: {
        kp: number;
        imdb: number;
        filmCritics: number;
        russianFilmCritics: number;
        await: number;
    };
    year: number;
}


