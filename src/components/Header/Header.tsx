import React, { useState, type FC } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
    AppBar,
    Toolbar,
    Container,
    Stack,
    Box,
    Button,
    Menu,
    MenuItem,
    Typography,
} from "@mui/material";

const Header: FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
        !!localStorage.getItem("accessToken")
    );
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => setAnchorEl(null);

    const logout = () => {
        localStorage.removeItem("accessToken");
        setIsLoggedIn(false);
        navigate("/");
    };

    return (
        <AppBar position="static" color="default" elevation={1}>
            <Container maxWidth="lg">
                <Toolbar disableGutters sx={{ minHeight: 64 }}>
                    {/* Left side */}
                    <Box sx={{ flexGrow: 1 }}>
                        {isLoggedIn ? (
                            <Button
                                component={RouterLink}
                                to="/"
                                color="inherit"
                                sx={{ fontWeight: 700 }}
                            >
                                Campaign
                            </Button>
                        ) : (
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                Campaigns
                            </Typography>
                        )}
                    </Box>

                    {/* Right side */}
                    {isLoggedIn ? (
                        <Stack direction="row" spacing={1}>
                            <Button onClick={logout} variant="outlined">
                                Logout
                            </Button>
                        </Stack>
                    ) : (
                        <>
                            <Button
                                onClick={handleMenuClick}
                                id="account-button"
                                aria-controls={
                                    open ? "account-menu" : undefined
                                }
                                aria-haspopup="true"
                                aria-expanded={open ? "true" : undefined}
                                variant="outlined"
                            >
                                Account
                            </Button>
                            <Menu
                                id="account-menu"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleMenuClose}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "right",
                                }}
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                MenuListProps={{
                                    "aria-labelledby": "account-button",
                                }}
                            >
                                <MenuItem
                                    component={RouterLink}
                                    to="/login"
                                    onClick={handleMenuClose}
                                >
                                    Login
                                </MenuItem>
                                <MenuItem
                                    component={RouterLink}
                                    to="/register"
                                    onClick={handleMenuClose}
                                >
                                    Registration
                                </MenuItem>
                            </Menu>
                        </>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Header;
