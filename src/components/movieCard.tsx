import {Avatar, Box, Button, Rating, Typography} from "@mui/material";
import type {Movie} from "../types.ts";
import {useNavigate} from "react-router";
import React, {useState} from "react";
import ConfirmModal from "./confirmModal.tsx";

type MovieCardProps = {
    movieInf: Movie;
    addFavorite?: (movie: Movie) => void;
    isFavorite?: (id: number) => boolean;
};



const MovieCard = ({movieInf, addFavorite, isFavorite}: MovieCardProps) => {

    const [modalOpen, setModalOpen] = useState(false)
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/movie/${movieInf.id}`)
    }


    const handleAddToFavoritesClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation()
        setModalOpen(true)
    }

    const handleConfirm = () => {
        if (addFavorite) {
            addFavorite(movieInf as Movie);
        } // Преобразование для полной типизации
        setModalOpen(false)
    }

    return (
        <>
            <Box
                onClick={handleClick}
                sx={{
                display: 'flex',
                alignItems: 'center',
                py: 2,
                cursor: 'pointer',
                px: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                    backgroundColor: 'action.hover'
                }
            }}>
                <Avatar
                    src={movieInf.poster?.url || 'img.png'}
                    sx={{
                        width: 60,
                        height: 80,
                        mr: 2,
                        borderRadius: 1
                    }}
                    variant="rounded"
                />

                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                        {(movieInf.name || movieInf.alternativeName)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                        {movieInf.year}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Rating
                            value={movieInf.rating?.imdb ? movieInf.rating.imdb / 2 : 0}
                            precision={0.1}
                            readOnly
                            size="small"
                            sx={{ mr: 1 }}
                        />
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {movieInf.rating?.imdb?.toFixed(1) || 'N/A'}
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        size="small"
                        variant="contained"
                        disabled={isFavorite ? isFavorite(movieInf.id) : true}
                        onClick={handleAddToFavoritesClick}
                    >
                        {!(isFavorite) || isFavorite(movieInf.id) ? "В избранном" : "Добавить в избранное"}
                    </Button>
                    <Button
                        size="small"
                        variant="contained"
                        color='secondary'
                    >
                        Cравнение
                    </Button>
                </Box>
            </Box>
                <ConfirmModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    onConfirm={handleConfirm}
                    title={movieInf.name || movieInf.alternativeName || "фильм"}
                />
        </>
    );
};

export default MovieCard;