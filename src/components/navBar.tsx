import {AppBar, Box, IconButton, Toolbar, Typography} from "@mui/material";
import {Link} from "react-router";
import FavoriteIcon from '@mui/icons-material/Favorite';
import DifferenceIcon from '@mui/icons-material/Difference';


const NavBar = () => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography
                        variant="h6"
                        noWrap
                        component={Link}
                        to="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        FILMS
                    </Typography>
                    <Box sx={{ ml: "auto", display: "flex", gap: 2 }}>
                        <Box
                            component={Link}
                            to="/favorites"
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                textDecoration: "none",
                                color: "inherit",
                            }}
                        >
                            <IconButton color="inherit" size="small">
                                <FavoriteIcon />
                            </IconButton>
                            <Typography variant="caption" sx={{ lineHeight: 1 }}>
                                Избранное
                            </Typography>
                        </Box>

                        <Box
                            component={Link}
                            to="/compare"
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                textDecoration: "none",
                                color: "inherit",
                            }}
                        >
                            <IconButton color="inherit" size="small">
                                <DifferenceIcon />
                            </IconButton>
                            <Typography variant="caption" sx={{ lineHeight: 1 }}>
                                Сравнение
                            </Typography>
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default NavBar;