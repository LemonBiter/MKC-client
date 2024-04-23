import React from 'react';
import { TextField, Button, Paper, Box } from '@mui/material';
import { useState } from 'react';
import {useLogin, useNotify, Notification} from "react-admin";

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const login = useLogin();
    const notify = useNotify();

    const handleSubmit = e => {
        e.preventDefault();
        login({ username, password }).catch((error) => {
                notify('Invalid username or password')
            }
        )
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                background: 'antiquewhite'
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    padding: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    minWidth: 300,
                }}
            >
                <section>MKC - Order Management System</section>
                <TextField
                    label="Username"
                    variant="outlined"
                    fullWidth
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                >
                    Login
                </Button>
            </Paper>
        </Box>
    );
};

export default LoginPage;