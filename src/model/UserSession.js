const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSession = new Schema({
    email: { type: String, required: true, min: 6, max: 255},
    accessToken: {type: String, default: ''},
    expireDate: {type: Date},
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserSession', UserSession);
