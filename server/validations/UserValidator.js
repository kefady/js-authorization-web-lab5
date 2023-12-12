const {check, validationResult} = require('express-validator');

exports.validateUser = [
    check('firstName', 'First name must be at least 2 characters').isLength({min: 2}),
    check('lastName', 'Last name must be at least 2 characters').isLength({min: 2}),
    check('username', 'Username cannot be empty').notEmpty(),
    check('password', 'Password must be at least 5 characters and at most 16').isLength({min: 5, max: 16}),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(422).json({success: false, message: "User validation error.", error: errors.array()});
        next();
    },
];

exports.validateUserUpdate = [
    check('firstName', 'First name must be at least 2 characters').isLength({min: 2}),
    check('lastName', 'Last name must be at least 2 characters').isLength({min: 2}),
    check('username', 'Username cannot be empty').notEmpty(),
    check('roles', "Roles cannot be empty.").notEmpty(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(422).json({success: false, message: "User validation error.", error: errors.array()});
        next();
    },
];