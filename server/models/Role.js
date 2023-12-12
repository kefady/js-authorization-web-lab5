const {Schema, model} = require('mongoose');

const Role = new Schema({
    role: {
        type: String,
        unique: true,
        default: 'user',
    }
}, {
    timestamps: true
});

module.exports = model('Role', Role);