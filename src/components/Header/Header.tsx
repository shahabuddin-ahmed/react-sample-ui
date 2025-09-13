import React, { useState } from "react";
import type { FC } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Grid, Menu, MenuItem, Button } from "@material-ui/core";
import "./Header.scss";

const Header: FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
        !!localStorage.getItem("accessToken")
    );
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => setAnchorEl(null);

    const logout = () => {
        localStorage.removeItem("accessToken");
        setIsLoggedIn(false);
        navigate("/");
    };

    return (
        <header className="site-header">
            <div className="container">
                <Grid
                    container
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Grid item>
                        {isLoggedIn ? (
                            <Button className="ml-3" onClick={logout}>
                                Logout
                            </Button>
                        ) : (
                            <>
                                <Button
                                    component={RouterLink}
                                    to="/account"
                                    className="ml-3"
                                    onClick={handleClick}
                                >
                                    Account
                                </Button>
                                <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    MenuListProps={{
                                        "aria-labelledby": "basic-button",
                                    }}
                                >
                                    <MenuItem
                                        component={RouterLink}
                                        to="/login"
                                        onClick={handleClose}
                                    >
                                        Login
                                    </MenuItem>
                                    <MenuItem
                                        component={RouterLink}
                                        to="/register"
                                        onClick={handleClose}
                                    >
                                        Registration
                                    </MenuItem>
                                </Menu>
                            </>
                        )}
                    </Grid>
                </Grid>
            </div>
        </header>
    );
};

export default Header;
