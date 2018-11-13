const mongoose = require('mongoose');


let userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    hash: {type: String, required: true},
    salt: {type: String, required: true}
});

exports.userSchema = mongoose.model('user', userSchema);
