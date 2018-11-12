const mongoose = require('mongoose');
const argon2 = require('argon2');


let userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    hash: {type: String, required: true},
    salt: {type: String, required: true}
})

userSchema.methods.validatePassword = function(password) {
    argon2.verify(this.hash, password + this.salt)
        .then(match => {
            if (match) {
                logger.info(`Authenticated user: ${this.username}`);
            } else {
                logger.info(`Authentication failure for user: ${this.username}`);
            }
        })
        .catch(error => {
            logger.info(`Error authenticating user: ${this.username}`);
        })
}
