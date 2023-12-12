import { useContext, useState } from "react";
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from "react-router-dom";
import { Container, CssBaseline, Box, Grid, Typography, TextField, Button, Snackbar, Avatar } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

import AuthContext from "../../context/AuthProvider.js";
import axios from "../../axios.js";

const SignUp = () => {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isValid }
    } = useForm({
        defaultValues: {
            firstName: '',
            lastName: '',
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
            const { data: response } = await axios.post("/auth/register", req);
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
        } else if (error.response?.status === 409) {
            setError("username", { message: "User with this username already exists." });
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
                        Sign up
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="given-name"
                                    name="firstName"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    autoFocus
                                    error={Boolean(errors.firstName?.message)}
                                    helperText={errors.firstName?.message}
                                    {...register('firstName', {
                                        required: { value: true, message: 'Please, enter your first name.' },
                                        minLength: { value: 2, message: 'Minimum length is 2 characters.' },
                                        pattern: {
                                            value: /[A-Za-zА-Яа-я'іІїЇєЄ-]+/,
                                            message: 'Invalid format. Only characters allowed.'
                                        }
                                    })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    autoComplete="family-name"
                                    error={Boolean(errors.lastName?.message)}
                                    helperText={errors.lastName?.message}
                                    {...register('lastName', {
                                        required: { value: true, message: 'Please, enter your last name.' },
                                        minLength: { value: 2, message: 'Minimum length is 2 characters.' },
                                        pattern: {
                                            value: /[A-Za-zА-Яа-я'іІїЇєЄ-]+/,
                                            message: 'Invalid format. Only characters allowed.'
                                        }
                                    })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="username"
                                    label="Username"
                                    name="username"
                                    autoComplete="username"
                                    error={Boolean(errors.username?.message)}
                                    helperText={errors.username?.message}
                                    {...register('username', {
                                        required: { value: true, message: 'Please, enter your username.' },
                                        minLength: { value: 3, message: 'Minimum length is 3 characters.' },
                                        pattern: {
                                            value: /[A-Za-z0-9_]{3}/,
                                            message: 'Invalid format. Only Latin characters, numbers and _ allowed.'
                                        }
                                    })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                    error={Boolean(errors.password?.message)}
                                    helperText={errors.password?.message}
                                    {...register('password', {
                                        required: 'Please, enter your password.',
                                        minLength: { value: 5, message: 'Minimum length is 5 characters.' },
                                        maxLength: { value: 16, message: 'Maximum length is 16 characters.' }
                                    })}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={!isValid}
                        >
                            Sign Up
                        </Button>
                        <Link to="/sign-in">
                            Already have an account? Sign in
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

export default SignUp;
