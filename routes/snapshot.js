const express = require('express');
const snapshotController = require('../controllers/snapshot');


const router = express.Router();
router.get('/test', snapshotController.test);

module.exports = router;