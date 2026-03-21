import {Alert, Box, Button, CircularProgress, Typography} from "@mui/material"
import {useCallback, useEffect, useMemo, useState} from "react"
import type {Movie} from "../types.ts"
import MovieFilters from "../components/movieFilters.tsx"
import {useInfiniteScroll} from "../hooks/useInfiniteScroll.ts"
import {useSearchParams} from "react-router"
import {useDebounce} from "../hooks/useDebounce.ts"
import MovieCard from "../components/movieCard.tsx"
import {useFetchMovies} from "../hooks/useFetchMovies.ts"
import {fetchMovies} from "../api/kinopoisk.ts"
import NavBar from "../components/navBar.tsx";
import {useUnit} from "effector-react";
import {$favorites, addFavorite} from "../stores/favorites/favorites.store.ts";
import {isFavorite} from "../stores/favorites/utils.ts";

const MainPage = () => {
    const [movies, setMovies] = useState<Movie[]>([])
    const [hasMore, setHasMore] = useState(true)
    const [page, setPage] = useState(1)
    const [searchParams] = useSearchParams()
    const [isInitialRender, setIsInitialRender] = useState(true)

    const [getMovies, isLoading, error, resetError] =
        useFetchMovies(async (signal) => {

            if (isLoading || !hasMore || error) return

            const res = await fetchMovies({
                page: page,
                limit: 50,
                filters:debouncedFilters,
                signal:signal
            })

            if (res.data.docs && res.data.docs.length > 0) {
                setMovies(prev => {
                    const existingIds = new Set(prev.map(movie => movie.id))
                    const newMovies = res.data.docs.filter((movie: Movie) => !existingIds.has(movie.id))
                    return [...prev, ...newMovies]
                })
                if (res.data.docs.length < 50) {
                    setHasMore(false)
                }
            } else {
                setHasMore(false)
            }

        })

    const [addFav, favorites] = useUnit([addFavorite,$favorites])

    const filters = useMemo(() => ({
        genres: searchParams.get('genres'),
        ratingFrom: searchParams.get('ratingFrom'),
        ratingTo: searchParams.get('ratingTo'),
        yearFrom: searchParams.get('yearFrom'),
        yearTo: searchParams.get('yearTo'),
    }), [searchParams]);

    const debouncedFilters = useDebounce(filters,100)


    // Вызываем getMovies только после завершения дебаунса
    useEffect(() => {
        if (isInitialRender) {
            setIsInitialRender(false)
            return
        }
        if (error == null) {
            getMovies()
        }
    }, [page, debouncedFilters, isInitialRender, error, getMovies])

    useEffect(() => {
        setPage(1)
        setMovies([])
        setHasMore(true)
    }, [debouncedFilters])

    // Callback для IntersectionObserver
    const handleLoadMore = useCallback(() => {
        if (!isLoading && hasMore) {
            setPage(prev => prev + 1)
        }
    }, [isLoading, hasMore]);

    const [ lastElementRef ] = useInfiniteScroll({
        isLoading,
        hasMore,
        callback: handleLoadMore
    })

    return (
        <Box>
            <NavBar/>
            <Box
                display="flex"
                flexDirection="row"
                justifyContent="center"
                alignItems="flex-start"
                mt={2}
                px={2}
                className={'mainpage_container'}
            >
                {/* Фильтры слева */}
                <Box
                    minWidth={250}
                    maxWidth={300}
                    mt={7}
                    mr={4}
                    pr={2}
                    className={'filters'}
                    sx={{position: 'sticky', top: "20px"}}
                >
                    <MovieFilters/>
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
                                    getMovies()
                                }}
                            >
                                Попробовать снова
                            </Button>
                        }
                    >
                        Ошибка загрузки фильмов: {error || "Что-то пошло не так"}
                    </Alert>
                )}

                {/* Список фильмов справа */}
                <Box
                    display="flex"
                    flexDirection="column"
                    maxWidth={1200}
                    flexGrow={1}
                    className={'movieList-container'}
                >

                    {movies.map((movie) => (
                        <MovieCard
                            movieInf={movie}
                            key={movie.id}
                            addFavorite={addFav}
                            isFavorite={() => isFavorite(favorites, movie.id)}
                        />
                    ))}

                    {(hasMore) && (
                        <div
                            ref={lastElementRef}
                            style={{
                                height: 20,
                                background: 'transparent',
                            }}
                        />
                    )}

                    {/* Спиннер снизу */}
                    {(isLoading) && (
                        <Box display="flex" justifyContent="center" mb={2}>
                            <CircularProgress color='primary' size={160} />
                        </Box>
                    )}

                    {/* Сообщение о том, что больше нет фильмов */}
                    {!hasMore && movies.length > 0 && (
                        <Box display="flex" justifyContent="center" mt={2} mb={5}>
                            <Typography variant="body2" color="textSecondary">
                                Все фильмы загружены
                            </Typography>
                        </Box>
                    )}

                    {(!isLoading) && (movies.length === 0) && (
                        <Box display="flex" justifyContent="center" mt={2} mb={5}>
                            <Typography variant="body2" color="textSecondary">
                                По вашему запросу ничего не найдено
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default MainPage;