const {userSchema} = require('../models/users');
const logger = require('../logger');
const mongoose = require('mongoose');
const crypto = require('crypto');
const argon2 = require('argon2');


exports.requestKey = function(req, res) {
    logger.info(`User: ${req.user.username}`);
    let key = crypto.randomBytes(16).toString('hex');
    let salt = crypto.randomBytes(16).toString('hex');
    argon2.hash(key + salt)
        .then(hash => {
            logger.info(`Hash generated: ${hash}`);
            let user = {
                hash: hash,
                salt: salt
            };
            userSchema.findOneAndUpdate({username: '_test'}, user, {upsert: true}, (err, doc, res) => {
                if (err) {
                    logger.error(`Error writing to database: ${err}`);
                } else {
                    logger.info(`Successfully wrote to database: ${doc}`);
                }
            });
        })
        .catch(err => {
            logger.error('Error generating hash');
        });
    res.send(JSON.stringify({'key': key}));
}
