import {Alert, Avatar, Box, Button, Chip, CircularProgress, Rating, Typography} from '@mui/material';
import {useNavigate, useParams} from 'react-router';
import {useEffect, useState} from 'react';
import {fetchMovieById} from '../api/kinopoisk.ts';
import type {Movie} from '../types.ts';
import NavBar from "../components/navBar.tsx";
import {useFetchMovies} from "../hooks/useFetchMovies.ts";
import ConfirmModal from "../components/confirmModal.tsx";
import {useUnit} from "effector-react/compat";
import {$favorites, addFavorite} from "../stores/favorites/favorites.store.ts";
import {isFavorite} from "../stores/favorites/utils.ts";

const AboutFilmPage = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const [movie, setMovie] = useState<Movie | null | undefined>(undefined)
    const [openModal, setOpenModal] = useState(false)

    const [loadMovie, loading, error, resetError] = useFetchMovies(async () => {
        if (!id) return
        const res = await fetchMovieById(id)
        setMovie(res.data)
    })

    useEffect(() => {
        loadMovie()
    }, [id, loadMovie])

    const addFav = useUnit(addFavorite)
    const favorites = useUnit($favorites)

    const alreadyFavorite = movie ? isFavorite(favorites, movie.id) : false

    const handleConfirm = () => {
        if (movie && !isFavorite(favorites, movie.id)) {
            addFav(movie)
        }
        setOpenModal(false)
    }

    const formatDate = (isoDate: Date | null): string => {
        if (!isoDate) return '—'
        const date = new Date(isoDate)
        return date.toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    }

    if (loading || (movie === undefined && !error)) {
        return (
            <>
                <NavBar/>
                <Box display="flex" justifyContent="center" mt={5}>
                    <CircularProgress />
                </Box>
            </>
        );
    }

    if (!movie) {
        return (
            <>
                <NavBar/>
                <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
                    <Typography variant="h6" color="error" gutterBottom>
                        Фильм не найден
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error} <br/>
                            <Button size="small" onClick={() => loadMovie()}>Попробовать снова</Button>
                        </Alert>
                    )}
                </Box>
            </>
        );
    }

    return (
        <>
            <NavBar/>
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
                mt={4}
                px={2}
            >
                <Box
                    maxWidth="800px"
                    width="100%"
                    display="flex"
                    flexDirection={{ xs: 'column', sm: 'row' }}
                    gap={4}
                    alignItems="flex-start"
                >
                    <Avatar
                        variant="rounded"
                        src={movie.poster?.url || 'img.png'}
                        sx={{ width: 200, height: 280 }}
                    />
                    <Box flex={1}>
                        <Typography variant="h4" gutterBottom>
                            {movie.name || movie.alternativeName}
                        </Typography>

                        <Typography variant="body1" gutterBottom color="text.secondary">
                            {movie.description || 'Нет описания'}
                        </Typography>

                        <Typography variant="subtitle1" mt={2}>
                            <strong>Дата выхода:</strong> {formatDate(movie.createdAt)}
                        </Typography>

                        <Box display="flex" alignItems="center" mt={1}>
                            <Rating
                                value={movie.rating?.imdb ? movie.rating.imdb / 2 : 0}
                                precision={0.1}
                                readOnly
                            />
                            <Typography ml={1}>
                                {movie.rating?.imdb?.toFixed(1) || 'N/A'}
                            </Typography>
                        </Box>

                        <Box mt={2} display="flex" gap={1} flexWrap="wrap">
                            {movie.genres?.map((genre) => (
                                <Chip key={genre.name} label={genre.name} />
                            ))}
                        </Box>

                        <Box mt={4} display={'flex'} gap={2}>
                            <Button variant="outlined" onClick={() => navigate(-1)}>
                                Назад
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => setOpenModal(true)}
                                disabled={alreadyFavorite}
                            >

                                {alreadyFavorite ? "В избранном" : "В избранное"}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Box>

            {error && (
                <Alert
                    severity="error"
                    sx={{
                        position: "fixed",
                        top: 16,
                        right: 16,
                        zIndex: 1300,
                        width: 300,
                        boxShadow: 3,
                    }}
                    action={
                        <Button
                            color="inherit"
                            size="small"
                            onClick={() => {
                                resetError()
                                loadMovie()
                            }}
                        >
                            Попробовать снова
                        </Button>
                    }
                >
                    Ошибка загрузки фильмов: {error || "Что-то пошло не так"}
                </Alert>
            )}

            <ConfirmModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onConfirm={handleConfirm}
                title={movie.name || movie.alternativeName || "фильм"}
            />

        </>
    );
};

export default AboutFilmPage;
