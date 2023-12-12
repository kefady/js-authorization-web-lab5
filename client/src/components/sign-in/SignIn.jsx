import { useContext, useState } from "react";
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from "react-router-dom";
import { Container, CssBaseline, Box, Typography, TextField, Button, Snackbar ,Avatar } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

import AuthContext from "../../context/AuthProvider.js";
import axios from "../../axios.js";

const SignIn = () => {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isValid }
    } = useForm({
        defaultValues: {
            username: '',
            password: ''
        },
        mode: 'onChange'
    });
    const navigate = useNavigate();
    const { setAuth } = useContext(AuthContext);
    const [serverError, setServerError] = useState(false);

    const onSubmit = async (req) => {
        setServerError(false);
        try {
            const { data: response } = await axios.post("/auth/login", req);
            const token = response?.token;
            setAuth({ token });
            window.localStorage.setItem("token", token);
            navigate('/me');
        } catch (error) {
            handleErrors(error);
        }
    };

    const handleErrors = (error) => {
        if (!error?.response) {
            setServerError(true);
        } else if (error.response?.status === 404) {
            setError("username", { message: "User with this username not found." });
        } else if (error.response?.status === 400) {
            setError("password", { message: "Incorrect password. Please try again." });
        } else {
            setServerError(true);
        }
    };

    const handleCloseSnackbar = () => {
        setServerError(false);
    };

    return (
        <>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            type="text"
                            autoComplete="username"
                            error={Boolean(errors.username?.message)}
                            helperText={errors.username?.message}
                            autoFocus
                            {...register('username', {
                                required: { value: true, message: 'Please, enter your username.' },
                                minLength: { value: 3, message: 'Minimum length is 3 characters.' },
                                pattern: {
                                    value: /[A-Za-z0-9_]{3}/,
                                    message: 'Invalid format. Only Latin characters, numbers and _ allowed.'
                                }
                            })}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="password"
                            label="Password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            error={Boolean(errors.password?.message)}
                            helperText={errors.password?.message}
                            {...register('password', {
                                required: 'Please, enter your password.',
                                minLength: { value: 5, message: 'Minimum length is 5 characters.' },
                                maxLength: { value: 16, message: 'Maximum length is 16 characters.' }
                            })}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={!isValid}
                        >
                            Sign In
                        </Button>
                        <Link to="/sign-up">
                            {"Don't have an account? Sign Up"}
                        </Link>
                    </Box>
                </Box>
            </Container>
            <Snackbar
                open={serverError}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert
                    elevation={6}
                    variant="filled"
                    onClose={handleCloseSnackbar}
                    severity="error"
                >
                    <AlertTitle>Error</AlertTitle>
                    We're sorry, but we are currently experiencing issues with our server.<br></br>
                    Please try again later or contact support for assistance.
                </Alert>
            </Snackbar>
        </>
    );
};

export default SignIn;
