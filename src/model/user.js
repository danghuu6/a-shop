const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    fullName: { type: String, default: '' },
    email: { type: String, required: true, min: 6, max: 255},
    password: { type: String, required: true, min: 6, max: 255},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', User);
