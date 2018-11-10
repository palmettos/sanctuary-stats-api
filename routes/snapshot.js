const express = require('express');
const snapshotController = require('../controllers/snapshot');


const router = express.Router();
router.get('/', snapshotController.test);

module.exports = router;