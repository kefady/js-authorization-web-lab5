const {Schema, model} = require('mongoose');

const User = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roles: [{
        type: String,
        ref: 'Role'
    }]
}, {
    timestamps: true
});

module.exports = model('User', User);