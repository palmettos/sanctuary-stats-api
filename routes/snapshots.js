const express = require('express');
const snapshotsController = require('../controllers/snapshots');
const passport = require('passport');
const apicache = require('apicache');
const cache = apicache.middleware;


const router = express.Router();
apicache.options({debug: true});
router.get('/equipped/:streamer/:character',
    cache('1 day'),
    (req, res, next) => {
        req.apiCacheGroup = req.originalUrl;
        next();
    },
    snapshotsController.getEquippedItems);

router.post('/equipped/:streamer/:character',
    // disable for testing
    // passport.authenticate('basic', {session: false}),
    (req, res, next) => {
        apicache.clear(req.originalUrl);
        next();
    },
    snapshotsController.updateEquippedItems);

module.exports = router;
