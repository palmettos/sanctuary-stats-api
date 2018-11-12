const express = require('express');
const snapshotsController = require('../controllers/snapshots');


const router = express.Router();
router.get('/:streamer', snapshotsController.listCharacters);
router.get('/:streamer/:character/equipped', snapshotsController.getEquippedItems);

router.post('/:streamer/:character/equipped', snapshotsController.processEquippedItems);

module.exports = router;
