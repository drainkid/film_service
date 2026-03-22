import {Box, FormControl, InputLabel, MenuItem, OutlinedInput, Select} from "@mui/material";
import {useSearchParams} from "react-router";
import React, {useEffect, useState} from "react";

const allGenres = ['драма', 'комедия', 'триллер', 'боевик', 'фантастика', 'ужасы', 'криминал', 'детектив'];
const years = Array.from({ length: new Date().getFullYear() - 1989 }, (_, i) => 1990 + i)
const ratings = Array.from({ length: 10 }, (_, i) => i + 1)

const MovieFilters = React.memo (() => {
    const [searchParams, setSearchParams] = useSearchParams()

    const [selectedGenres, setSelectedGenres] = useState<string[]>([])
    const [ratingFrom, setRatingFrom] = useState<string>('')
    const [ratingTo, setRatingTo] = useState<string>('')
    const [yearFrom, setYearFrom] = useState<string>('')
    const [yearTo, setYearTo] = useState<string>('')

    useEffect(() => {
        const genres = searchParams.get('genres')?.split(',') ?? []
        setSelectedGenres(genres);
        setRatingFrom(searchParams.get('ratingFrom') ?? '')
        setRatingTo(searchParams.get('ratingTo') ?? '')
        setYearFrom(searchParams.get('yearFrom') ?? '')
        setYearTo(searchParams.get('yearTo') ?? '')
    }, [searchParams])

    useEffect(() => {
        const params: Record<string, string> = {};
        if (selectedGenres.length > 0) params.genres = selectedGenres.join(',')
        if (ratingFrom) params.ratingFrom = ratingFrom
        if (ratingTo) params.ratingTo = ratingTo
        if (yearFrom) params.yearFrom = yearFrom
        if (yearTo) params.yearTo = yearTo

        setSearchParams(params)
    }, [selectedGenres, ratingFrom, ratingTo, yearFrom, yearTo, setSearchParams])

    return (
        <Box display="flex"
             flexDirection="column"
             gap={3} mt={3}
             mb={2}
             px={2}
        >
            <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Жанры</InputLabel>
                <Select
                    multiple
                    value={selectedGenres}
                    onChange={(e) => {
                        const value = typeof e.target.value === 'string'
                            ? e.target.value.split(',')
                            : e.target.value;
                        setSelectedGenres(value);
                    }}
                    input={<OutlinedInput label="Жанры" />}
                >
                    {allGenres.map((genre) => (
                        <MenuItem key={genre} value={genre}>
                            {genre}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Box display="flex" gap={2}>
                <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel>Рейтинг от</InputLabel>
                    <Select
                        value={ratingFrom}
                        onChange={(e) => setRatingFrom(e.target.value)}
                        label="Рейтинг от"
                    >
                        <MenuItem value="">-</MenuItem>
                        {ratings.map((r) => (
                            <MenuItem key={r} value={r.toString()}>
                                {r}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel>Рейтинг до</InputLabel>
                    <Select
                        value={ratingTo}
                        onChange={(e) => setRatingTo(e.target.value)}
                        label="Рейтинг до"
                    >
                        <MenuItem value="">-</MenuItem>
                        {ratings.map((r) => (
                            <MenuItem key={r} value={r.toString()}>
                                {r}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <Box display="flex" gap={2}>
                <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel>Год от</InputLabel>
                    <Select
                        value={yearFrom}
                        onChange={(e) => setYearFrom(e.target.value)}
                        label="Год от"
                    >
                        <MenuItem value="">-</MenuItem>
                        {years.map((y) => (
                            <MenuItem key={y} value={y.toString()}>
                                {y}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel>Год до</InputLabel>
                    <Select
                        value={yearTo}
                        onChange={(e) => setYearTo(e.target.value)}
                        label="Год до"
                    >
                        <MenuItem value="">-</MenuItem>
                        {years.map((y) => (
                            <MenuItem key={y} value={y.toString()}>
                                {y}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

            </Box>
        </Box>
    );
})

export default MovieFilters;
