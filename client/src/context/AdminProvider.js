import React, { createContext, useState } from "react";

const AdminContext = createContext({});

export const AdminProvider = ({ children }) => {
    const [users, setUsers] = useState({});
    const [roles, setRoles] = useState([]);

    return (
        <AdminContext.Provider value={{ users, setUsers, roles, setRoles }}>
            {children}
        </AdminContext.Provider>
    );
};

export default AdminContext;
