const express = require('express');
const authController = require('../controllers/auth');
const passport = require('passport');


const router = express.Router();
router.get('/key', passport.authenticate('jwt', {session: false}), authController.requestKey);

module.exports = router;
