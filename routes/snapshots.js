const express = require('express');
const snapshotsController = require('../controllers/snapshots');


const router = express.Router();
router.all('/', snapshotsController.err);
router.get('/:streamer', snapshotsController.listCharacters);
router.get('/:streamer/:character', snapshotsController.getsnapshots);

module.exports = router;
