import { useContext, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import { Button, Container, Typography, Box, Snackbar, Avatar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AuthContext from "../../context/AuthProvider.js";

import axios from "../../axios.js";

const AboutMe = () => {
    const navigate = useNavigate();
    const { auth, setAuth } = useContext(AuthContext);
    const [serverError, setServerError] = useState(false);
    const [permissionError, setPermissionError] = useState(false);
    const [isAuth, setIsAuth] = useState(false);

    const fetchData = async () => {
        try {
            const response = await axios.get('/auth/me');
            setIsAuth(true);
            setAuth({ ...auth, ...response?.data.user });
        } catch (error) {
            handleErrors(error);
        }
    }

    useEffect(() => {
        fetchData();
    }, [setAuth]);

    const handleErrors = (error) => {
        if (!error?.response) {
            setServerError(true);
        } else if (error.response?.status === 401) {
            setIsAuth(false);
        } else {
            setServerError(true);
        }
    }

    const onClickLogout = () => {
        setAuth({});
        window.localStorage.removeItem("token");
        navigate('/sign-in');
    }

    const onClickAdmin = () => {
        setPermissionError(false);
        if (Object.values(auth?.roles).includes('admin')) {
            navigate('/admin');
        } else {
            setPermissionError(true);
        }
    }

    const handleCloseSnackbar = () => {
        setServerError(false);
        setPermissionError(false);
    };

    return (
        <>
            {isAuth ? (
                <Container maxWidth="xs">
                    <Box
                        component="div"
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <AccountCircleIcon />
                        </Avatar>
                        <Typography component="h1" variant="h4">
                            Profile
                        </Typography>
                    </Box>
                    <Box component="div">
                        <Typography variant="subtitle1" gutterBottom>
                            <strong>First Name:</strong> {auth?.firstName}
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                            <strong>Last Name:</strong> {auth?.lastName}
                        </Typography>
                        <Typography variant="subtitle1">
                            <strong>Username:</strong> {auth?.username}
                        </Typography>
                        <Typography variant="subtitle1">
                            <strong>Created At:</strong> {auth?.createdAt}
                        </Typography>
                    </Box>
                    <Button
                        type="button"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        onClick={onClickAdmin}
                        hidden={!Object.values(auth?.roles).includes('admin')}
                    >
                        Admin Console
                    </Button>
                    <Button
                        type="button"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        onClick={onClickLogout}
                    >
                        Log Out
                    </Button>
                </Container>
            ) : (
                <Container maxWidth="xs">
                    <Box
                        component="div"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            height: '100vh'
                        }}
                    >
                        <Typography variant="h4" gutterBottom>
                            You are not authorized to access this page.
                        </Typography>
                        <Typography variant="h5">
                            <Link to="/sign-in">
                                {"Sign-In"}
                            </Link>
                        </Typography>
                    </Box>
                </Container>
            )}
            <Snackbar
                open={serverError || permissionError}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <MuiAlert
                    elevation={6}
                    variant="filled"
                    onClose={handleCloseSnackbar}
                    severity="error"
                >
                    {serverError ? (
                        <>
                            <strong>Error:</strong> We're sorry, but we are currently experiencing issues with our server.<br /> Please try again later or contact support for assistance.
                        </>
                    ) : (
                        <>
                            <strong>Error:</strong> You don't have permissions.
                        </>
                    )}
                </MuiAlert>
            </Snackbar>
        </>
    );
};

export default AboutMe;
