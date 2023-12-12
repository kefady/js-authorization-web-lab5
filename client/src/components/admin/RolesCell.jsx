import { useState } from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const RolesCell = ({ row, roles, userRoles }) => {
    const [selectedRoles, setSelectedRoles] = useState(userRoles);

    const handleRoleChange = (event) => {
        const newRoles = event.target.value;

        setSelectedRoles(newRoles.length > 0 ? newRoles : [roles[0]]);
    };

    row.roles = selectedRoles;

    return (
        <Select fullWidth multiple value={selectedRoles} onChange={handleRoleChange}>
            {roles.map((role, index) => (
                <MenuItem key={index} value={role}>
                    {role}
                </MenuItem>
            ))}
        </Select>
    );
};

export default RolesCell;
