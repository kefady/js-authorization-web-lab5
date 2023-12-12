import React, { useContext, useState, useEffect } from "react";
import {Link} from 'react-router-dom';

import { Button, Snackbar } from "@mui/material";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Delete as DeleteIcon, Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from "react-router-dom";

import _ from 'lodash';

import RolesCell from "./RolesCell.jsx";
import AdminContext from "../../context/AdminProvider.js";
import axios from "../../axios.js";

const Admin = () => {
    const { users, setUsers, roles, setRoles } = useContext(AdminContext);
    const [snackbars, setSnackbars] = useState([]);
    const [isAuth, setIsAuth] = useState(true); // Assume the user is authenticated initially
    const [serverError, setServerError] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuth) {
            fetchUserData();
            fetchRoleData();
        }
    }, [isAuth]);

    const fetchUserData = async () => {
        try {
            const response = await axios.get('/admin/users');
            setUsers({ ...response?.data.users });
            addSnackbar('Users loaded successfully');
        } catch (error) {
            handleErrors(error);
        }
    }

    const fetchRoleData = async () => {
        try {
            const response = await axios.get('/admin/roles');
            const rolesArray = response?.data.roles.map(role => role.role);
            setRoles(rolesArray);
            addSnackbar('Roles loaded successfully');
        } catch (error) {
            handleErrors(error);
        }
    }

    const handleSave = async (user) => {
        try {
            const response = await axios.put(`/admin/users/${user.id}`, user);
            const { oldUser, newUser } = response?.data;
            const updatedUsers = { ...users, [oldUser.id]: newUser };
            delete updatedUsers[oldUser.id];
            setUsers(updatedUsers);
            addSnackbar('User updated successfully');
        } catch (error) {
            handleErrors(error);
        }
    }

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`/admin/users/${id}`);
            const newUsers = _.omit(users, _.findKey(users, user => _.isEqual(user, response?.data.user)));
            setUsers(newUsers);
            addSnackbar('User deleted successfully');
        } catch (error) {
            handleErrors(error);
        }
    }

    const handleErrors = (error) => {
        console.log(error);
        if (!error?.response) {
            setServerError(true);
        } else if (error.response?.status === 401) {
            setIsAuth(false);
            addSnackbar('You are not authorized to access this page', 'error');
        } else if (error.response?.status === 403) {
            addSnackbar('You don\'t have permissions', 'error');
        } else {
            setServerError(true);
        }
    };

    const addSnackbar = (message, severity = 'success') => {
        const id = new Date().getTime() * Math.random();
        const newSnackbar = { id, message, severity };

        setSnackbars((prevSnackbars) => [...prevSnackbars, newSnackbar]);

        setTimeout(() => {
            removeSnackbar(id);
        }, 3000);
    };

    const removeSnackbar = (id) => {
        setSnackbars((prevSnackbars) => prevSnackbars.filter((snackbar) => snackbar.id !== id));
    };

    const renderSnackbars = () => (
        <div style={{ position: 'fixed', bottom: 0, right: 0, zIndex: 1000, margin: '16px' }}>
            {snackbars.map((snackbar) => (
                <Snackbar
                    key={snackbar.id}
                    open={true}
                    autoHideDuration={3000}
                    onClose={() => removeSnackbar(snackbar.id)}
                    message={snackbar.message}
                />
            ))}
        </div>
    );

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', flex: 1 },
        { field: 'username', headerName: 'Username', flex: 1, editable: true },
        { field: 'firstName', headerName: 'First name', flex: 1, editable: true },
        { field: 'lastName', headerName: 'Last name', flex: 1, editable: true },
        {
            field: 'roles',
            headerName: 'Roles',
            sortable: false,
            flex: 1,
            renderCell: (params) => <RolesCell
                row={params.row}
                roles={roles}
                userRoles={params.row.roles}
            />
        },
        {
            field: 'saveUser',
            headerName: 'Save user',
            sortable: false,
            flex: 0.5,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <Button startIcon={<SaveIcon />} onClick={() => handleSave(params.row)}>Save</Button>
            )
        },
        {
            field: 'deleteUser',
            headerName: 'Delete user',
            sortable: false,
            flex: 0.5,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <Button startIcon={<DeleteIcon />} style={{ color: 'red' }} onClick={() => handleDelete(params.row.id)}>Delete</Button>
            )
        }
    ];

    const rows = Object.values(users).map((user) => ({
        id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: Object.values(user.roles)
    }));

    return (
        <>
            {isAuth ? (
                <div style={{ height: "100vh", width: '100%' }}>
                    <Button
                        style={{ margin: '16px' }}
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate(-1)}
                    >
                        Back
                    </Button>
                    <DataGrid
                        style={{ paddingLeft: 10, paddingRight: 10 }}
                        rows={rows}
                        columns={columns}
                        pageSize={20}
                        pageSizeOptions={[10, 25, 50, 100]}
                    />
                </div>
            ) : (
                <div className={"alert-container"}>
                    <p>You are not authorized to access this page.</p>
                    <Link to='/me'>Back Home</Link>
                </div>
            )}
            {serverError && (
                <div className={"alert-container"}>
                    <p>We're sorry, but we are currently experiencing issues with our server.<br></br>
                        Please try again later or contact support for assistance.</p>
                    <Link to='/me'>Back Home</Link>
                </div>
            )}

            {renderSnackbars()}
        </>
    );
};

export default Admin;