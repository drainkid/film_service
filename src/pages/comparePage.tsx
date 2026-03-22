import {Box, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography,} from "@mui/material";
import {useUnit} from "effector-react";
import NavBar from "../components/navBar.tsx";
import {$compare} from "../stores/compare/compare.store.ts";

const ComparePage = () => {
    const compares = useUnit($compare)

    const formatGenres = (genres?: Array<{ name?: string }>) => {
        if (!genres?.length) return "—"
        return genres.map((g) => g.name).filter(Boolean).join(", ") || "—"
    }

    const formatDuration = (movieLength: number | null) => {
        return movieLength ? `${movieLength} мин` : "—"
    }

    const formatRating = (rating?: { imdb?: number; kp?: number }) => {
        const imdb = rating?.imdb
        const kp = rating?.kp
        if (imdb) return `IMDb ${imdb.toFixed(1)}`
        if (kp) return `KP ${kp.toFixed(1)}`
        return "—"
    }

    if (compares.length === 0) {
        return (
            <>
                <NavBar />
                <Box sx={{p: 3}}>
                    <Typography variant="h5" gutterBottom>
                        Сравнение фильмов
                    </Typography>
                    <Typography color="text.secondary">
                        Добавьте 2 фильма в сравнение, чтобы увидеть таблицу.
                    </Typography>
                </Box>
            </>
        );
    }

    return (
        <>
            <NavBar />
            <Box sx={{p: 3}}>
                <Typography variant="h5" gutterBottom>
                    Сравнение фильмов
                </Typography>

                <TableContainer component={Paper}>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>Название</TableCell>
                                {compares.map((movie) => (
                                    <TableCell key={`name-${movie.id}`}>
                                        {movie.name || movie.alternativeName || "—"}
                                    </TableCell>
                                ))}
                            </TableRow>

                            <TableRow>
                                <TableCell>Жанры</TableCell>
                                {compares.map((movie) => (
                                    <TableCell key={`genres-${movie.id}`}>
                                        {formatGenres(movie.genres)}
                                    </TableCell>
                                ))}
                            </TableRow>

                            <TableRow>
                                <TableCell>Длительность</TableCell>
                                {compares.map((movie) => (
                                    <TableCell key={`duration-${movie.id}`}>
                                        {formatDuration(movie.movieLength)}
                                    </TableCell>
                                ))}
                            </TableRow>

                            <TableRow>
                                <TableCell>Год выпуска</TableCell>
                                {compares.map((movie) => (
                                    <TableCell key={`year-${movie.id}`}>{movie.year ?? "—"}</TableCell>
                                ))}
                            </TableRow>

                            <TableRow>
                                <TableCell>Рейтинг</TableCell>
                                {compares.map((movie) => (
                                    <TableCell key={`rating-${movie.id}`}>
                                        {formatRating(movie.rating)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </>
    );
};

export default ComparePage;
