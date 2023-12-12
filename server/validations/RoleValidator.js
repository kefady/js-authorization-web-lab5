const {check, validationResult} = require('express-validator');

exports.validateRole = [
    check('role', 'Role name cannot be empty.').notEmpty(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(422).json({success: false, message: "Role validation error.", error: errors.array()});
        next();
    },
];