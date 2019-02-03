const {BasicStrategy} = require('passport-http');
const JwtStrategy = require('passport-jwt').Strategy;
const {ExtractJwt} = require('passport-jwt');
const {userSchema} = require('../models/users');
const passport = require('passport');
const argon2 = require('argon2');
const logger = require('../logger');
const config = require('../config');


passport.use(new BasicStrategy(
    (username, password, done) => {
        logger.debug(`Authenticating user: ${username}`);
        userSchema.findOne({username: username}, (err, user) => {
            logger.debug(`Looking up ${username} in the database.`);
            if (err) {
                logger.debug(err);
                return done(err);
            }
            if (!user) {
                logger.debug('No user found.');
                return done(null, false);
            }
            
            logger.debug(`Verifying password for ${user.username}.`);
            argon2.verify(user.hash, password + user.salt)
                .then(match => {
                    if (match) {
                        logger.debug(`Key verified successfully for ${user.username}.`);
                        return done(null, user);
                    } else {
                        logger.debug(`Invalid password sent for user ${user.username}`);
                        return done(null, false);
                    }
                })
                .catch(err => {
                    logger.error(`Error during validation for user ${user.username}`);
                    return done(err);
                });
        });
    }
));

// Use a JWT generated from the debugger on jwt.io to test this
jwt_options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.secret
};
passport.use(new JwtStrategy(
    jwt_options,
    (jwt_payload, done) => {
        logger.info(`Verified JWT: ${jwt_payload.sub}`);
        return done(null, {username: 'test'});
    }
));
