const express = require('express');
const snapshotsController = require('../controllers/snapshots');
const passport = require('passport');


const router = express.Router();
router.get('/:streamer', snapshotsController.listCharacters);
router.get('/:streamer/:character/equipped', snapshotsController.getEquippedItems);

router.post('/:streamer/:character/equipped',
    passport.authenticate('basic', {session: false}),
    snapshotsController.processEquippedItems);

module.exports = router;
