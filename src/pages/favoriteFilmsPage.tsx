import {Box, Typography} from "@mui/material";
import MovieCard from "../components/movieCard";
import NavBar from "../components/navBar.tsx";
import {useUnit} from "effector-react";
import {$favorites} from "../stores/favorites/favorites.store.ts";

const FavoriteFilmsPage = () => {

    const [favorites] = useUnit([$favorites])


    return (
        <>
            <NavBar/>
            <Box sx={{ p: 2 }}>
                <Typography variant="h4" gutterBottom>
                    Избранные фильмы
                </Typography>

                {favorites.length === 0 ? (
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        Вы еще не добавили фильмы в избранное.
                    </Typography>
                ) : (
                    favorites.map((movie) => (
                        <MovieCard key={movie.id} movieInf={movie} />
                    ))
                )}
            </Box>
        </>
    );
};

export default FavoriteFilmsPage;
