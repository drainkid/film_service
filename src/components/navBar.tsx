import {AppBar, Box, Button, Toolbar, Typography} from "@mui/material";
import {Link} from "react-router";


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
                    <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
                        <Button component={Link} to="/favorites" color="inherit">
                            Избранное
                        </Button>
                        <Button component={Link} to="/compare" color="inherit">
                            Cравнение
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default NavBar;