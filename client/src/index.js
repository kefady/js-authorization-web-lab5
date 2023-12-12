import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from "react-router-dom";
import {AuthProvider} from "./context/AuthProvider";
import {AdminProvider} from "./context/AdminProvider";

import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AuthProvider>
        <AdminProvider>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </AdminProvider>
    </AuthProvider>
);
